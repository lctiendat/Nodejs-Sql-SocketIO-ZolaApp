const io = require('socket.io')();
const socket = {
    io: io
}


function getUser() {
    return ``
}


io.on('connection', (socket) => {
    console.log('Connecttion Server');
    const users = []
    for (let [id, socket] of io.of('/').sockets) {
        users.push({
            id: id,
            email: getUser()
        })
    }
    socket.emit('list-user', users)
    socket.broadcast.emit('new-user', {
        id: socket.id,
        email: getUser()
    })
    socket.on('send-message', data => {
        io.emit('user-send-message', data);
    })
})

io.on('disconnect', socket => {
    console.log('Disconnect Server');
})

module.exports = socket;