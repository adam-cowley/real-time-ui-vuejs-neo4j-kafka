const express = require('express')

const app = express()
app.get('/', (req, res) => res.send('Hello!'))
const server = app.listen(3000, () => console.log('Listening on http://localhost:3000'))

require('dotenv').config();

// Include the neode instance
const neode = require('./neode')

// Kafka consumer
const consumer = require('./consumer')

// Create a socket.io instance
require('./io')(server, neode, consumer)



