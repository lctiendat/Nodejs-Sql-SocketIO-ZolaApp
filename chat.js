const io = require('socket.io')();
const socket = {
    io: io
}
const chatCPM = require('./components/chat.component');

let daLoginNamespace = io.of('dalogin');
daLoginNamespace.use(function (socket, next) {
    let token = socket.handshake.query.token;
    // check token xem có đúng token của user đã login ko
    // nếu đúng thì gán user info vào socket // rồi có thể, lấy tất cả các room từ chat để socket join
    if (token)
        next();
    // ko đúng thì 
    // next(new Error('Authen user faile'))
});
daLoginNamespace.on('connection', socket => {
    //user login sẽ vào đây
    socket.on('send_message', data => {

    });

});

io.on('connection', (socket) => {
    console.log('Connecttion Server');

    /**
    * Lấy danh sách người dùng đã connect
    */
    socket.on('userLogin', data => {
        socket.emailUser = data
        const users = []
        for (let [id, socket] of io.of('/').sockets) {
            users.push({
                id: id,
                email: socket.emailUser
            })
        }
        socket.emit('list-user', users)
        chatCPM.getAllRoomOfUser(data).then(rooms => {
            for (let index = 0; index < rooms.length; index++) {
                const element = rooms[index];
                socket.join((element.room).toString())
            }
        }) 
       // socket.join('11')
        console.log(users);
    })


    /**
     * Gửi tin nhắn private
     */
    socket.on('send-message-private', (data) => {
        chatCPM.getRoom(data.receiver, data.sender).then((result) => {
            //   socket.join(`'${result.room}'`)
            socket.to('11').emit('receive-message-private', data)
        }).catch((err) => {
            console.log(err);
        })
    })

    socket.on('disconnect', socket => {
        console.log('Disconnect Server');
    })
})



module.exports = socket;