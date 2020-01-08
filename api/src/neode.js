const neode = require('neode')
    .fromEnv()
    .withDirectory(__dirname + '/models')

module.exports = neode