const io = require('socket.io')();

const socket = {
    io: io
}
io.on('connection', socket => {
    console.log('Connecttion Server');

    socket.on('send-message', data => {
        io.emit('user-send-message', data);
    })
})


module.exports = socket;