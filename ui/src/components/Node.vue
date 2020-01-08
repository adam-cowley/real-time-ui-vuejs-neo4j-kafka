<template>
    <circle
        :cx="x"
        :cy="y"
        
        :r="r" 
        
        :style="style"
        @mousedown.prevent="handleLock"
        @mousemove.prevent="handleMove"
        @mouseup.prevent="handleUnlock"
        @mouseout.prevent="handleUnlock"

        :title=" JSON.stringify(node) "
    />
</template>

<script>
/* eslint-disable */

export default {
    name: 'Node',
    props: {
        node: Object,
        selected: String,
        lock: Function,
        move: Function,
        unlock: Function,

        r: {
            type: Number,
            default: 50,
        }
    },
    data: () => ({
        x: 0,
        y: 0,
    }),
    mounted() {
        this.reposition()
    },
    watch: {
        node() {
            this.reposition()
        },
    },
    computed: {
        style() {
            let fill = '#202020'

            if ( this.selected == this.node.id ) fill = '#ff0000'
            else if ( this.node.status === "locked" ) fill = '#666666';

            return {
                fill,
            }
        },
    },
    methods: {
        reposition() {
            this.x = this.node.x;
            this.y = this.node.y;
        },
        handleLock(e) {
            if ( this.node.status === "locked" ) {
                return;
            }

            this.lock(this.node)
        },
        handleUnlock(e) {
            if ( this.selected === this.node.id ) {
                this.unlock(this.node, {x: e.clientX, y: e.clientY})
            }
        },
        handleMove(e) {
            if ( this.selected === this.node.id ) {
                this.$el.setAttributeNS(null, "cx", e.clientX)
                this.$el.setAttributeNS(null, "cy", e.clientY)
            }
        },
    },
    watch: {
        node() {
            this.reposition()
        },
    },
}
</script>

