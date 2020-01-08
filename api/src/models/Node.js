module.exports = {
    id: {
        type: 'uuid',
        primary: true,
    },

    status: {
        type: 'string',
        valid: [ 'locked', 'unlocked', ],
    },
    x: 'float',
    y: 'float',
}