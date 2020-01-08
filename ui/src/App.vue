<template>
    <div id="app">
        <pre style="position:absolute; right:0;top:0;background: #ccc; z-index:300;width: 200px; height: 400px">
            locked: {{ locked }}
            nodes:
            {{nodes}}
        </pre>

        <svg height="100%" width="100%" style="background: #f2f2f2">
            <Node
                v-for="n in nodes"
                :key="n.id + n.x + n.y"
                :node="n"
                :selected="selected"
                :locked="locked"
            
                :lock="lock"
                :move="move"
                :unlock="unlock"
            />
        </svg>
    </div>
</template>

<script>
/* eslint-disable */
import Node from '@/components/Node'
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default {
    name: 'app',
    components: {
        Node,
    },
    data: () => ({
        loading: true,
        selected: null,
        locked: [],

        nodes: [],
    }),
    created() {
        // Add listeners to update the app state
        socket.on('welcome', nodes => {
            this.nodes = nodes
            this.loading = false
        })

        // Handle another user locking a node
        socket.on('locked', e => {
            const index = this.locked.indexOf(e.id);
            if ( index > -1 ) {
                this.locked.splice(index, 1)
            }

            // Update status
            const nodeIndex = this.nodes.findIndex(n => n.id == e.id)
            this.nodes[ nodeIndex ].status = "locked"

            console.log('LOCKED!', e)
        })

        // Handle a node becoming unlocked
        socket.on('unlocked', e => {
            // Remove from locked
            const index = this.locked.indexOf(e.id);
            if ( index > -1 ) {
                this.locked.splice(index, 1)
            }

            // Update status and position
            const nodeIndex = this.nodes.findIndex(n => n.id == e.id)

            this.nodes[ nodeIndex ].x = e.x;
            this.nodes[ nodeIndex ].y = e.y;
            this.nodes[ nodeIndex ].status = "unlocked";

            console.log('UNLOCKED!', e)
        })
    },

    methods: {
        send(message, body) {
            console.log('sending', message, body)
            return socket.emit(message, body)
        },

        lock(node) {
            const { id, } = node;

            this.selected = node.id

            this.send('lock', { id, })
        },
        move(node, data) {
            const { id, } = node;

            this.send('move', { id, ...data })
        },
        unlock(node, data) {
            this.selected = null

            const { id, } = node;
            
            this.send('unlock', { id, ...data })
        },
    },

}
</script>

<style>
#app {
  margin: 0; padding: 0;
  position: absolute; top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
