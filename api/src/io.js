
const createSocket = (server, neode, consumer) => {
    const io = require('socket.io')(server)


    // Handle Socket connections
    io.on('connection', socket => {
        console.log(`--> JOINED: ${socket.id}`)

        neode.all('Node')
            .then(res => res.toJson())
            .then(data => socket.emit('welcome', data))

        // You could just use a plain cypher query instead:
        // const session = driver.session()
        // session.run(`MATCH (n:Node) RETURN n`)
        //     .then(res => {
        //         return res.records.map(row => row.get('n').properties)
        //     })
        //     .then(data => socket.emit('welcome', data))


        // Handle Lock Event
        socket.on('lock', data => {
            console.log(`\n    LOCK:   ${socket.id} locked ${data.id}`)

            // const session = driver.session()
            // session.run(`MATCH (n:Node {id: $id}) SET n.status = 'locked'`, data)
            //     .then(() => {
            //         io.emit('locked', { by:socket.id, ...data })
            //     })
            //     .catch(e => console.error(e))

            neode.find('Node', data.id)
                .then(node => node.update({
                        status: 'locked',
                        by: socket.id,
                }))
                .then(node => node.toJson())
                // .then(json => io.emit('locked', json))
        })

        // Handle Unlock Event
        socket.on('unlock', data => {
            console.log(`\n    UNLOCK: ${socket.id} unlocked ${data.id} at ${data.x},${data.y}`)

            // session.run(`MATCH (n:Node {id: $id}) SET n.status = 'unlocked', n.x = $x, n.y = $y `, data)
            //     .then(() => {
            //         io.emit('unlocked', { by:socket.id, ...data })
            //     })
            //     .catch(e => console.error(e))

            neode.find('Node', data.id)
                .then(node => node.update({
                    status: 'unlocked',
                    by: null,
                    x: data.x,
                    y: data.y,
                }))
                .then(node => node.toJson())
                // .then(json => io.emit('unlocked', json))

            
        })

        socket.on('move', data => {
            console.log(`\n    MOVE  : ${socket.id} moved ${data.id} to ${data.x},${data.y}`)

            io.emit('moved', { by:socket.id, ...data })
        })

        socket.on('disconnect', () => console.log(`<-- LEFT  : ${socket.id}`))

        return io
    })

    // Listen for Kafka 
    consumer.on('message', ({ value, }) => {
        // Parse the JSON value into an object
        const { payload, } = JSON.parse(value)

        // Get the properties from the update
        const { properties, } = payload.after

        // ... and the status
        const { status, } = properties

        console.log('\n\nemitting from kafka:', status, properties)

        // Emit the message through all connected sockets
        io.emit(status, properties)
    })

}

module.exports = createSocket