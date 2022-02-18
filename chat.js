const io = require('socket.io')();
const socket = {
    io: io
}
const chatCPM = require('./components/chat.component');


io.on('connection', (socket) => {
    console.log('Connecttion Server');

    const UserLogin = new Promise((res, rej) => {
        socket.on('userLogin', data => {
            res(data)
        })
    })

    UserLogin.then(data => {
        socket.emailUser = data
        const users = []
        for (let [id, socket] of io.of('/').sockets) {
            users.push({
                id: id,
                email: socket.emailUser
            })
        }
        socket.emit('list-user', users)
        console.log(users);
    })

    const userSendMsgPrivate = new Promise((res, rej) => {
        socket.on('send-message-private', (data) => {
            res(data)
        })
    })

    userSendMsgPrivate.then(data => {
        console.log(data);
        chatCPM.getRoom(data.receiver, data.sender).then((result) => {
            console.log(result);
            socket.join(`'${result.room}'`)
            socket.to(`'${result.room}'`).emit('receive-message-private', data)
        }).catch((err) =>{
            console.log(err);
        })
    })
    //     console.log(data);
    //     chatCPM.getRoom(data.receiver, data.sender).then((result) => {
    //         socket.join(`1`)
    //         socket.to(`1`).emit('receive-message-private', data)
    //     })
    // })socket.on('send-message-private', (data) => {

    socket.on('send-message', data => {
        socket.emit('user-send-message', data);
    })

    socket.on('disconnect', socket => {
        console.log('Disconnect Server');
    })
})



module.exports = socket;