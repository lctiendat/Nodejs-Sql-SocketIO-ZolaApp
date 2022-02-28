const io = require('socket.io')();
const socket = {
    io: io
}
const chatCPM = require('./components/chat.component');
const userCPN = require('./components/user.component');


//getRoomUser()
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

    function getRoomUser(rooms) {
        socket.join(rooms)
    }


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
            let arrRoom = []
            rooms.forEach(room => {
                arrRoom.push(room.room)
            });
            getRoomUser(arrRoom)
        })

        socket.broadcast.emit('user_connected', data)

    })

    /**
     * Gửi tin nhắn private
     */
    socket.on('send-message-private', (data) => {
        chatCPM.getRoom(data.receiver, data.sender).then((result) => {
            socket.to(JSON.parse(JSON.stringify(result))[0].room).emit('receive-message-private', data)
        }).catch((err) => {
            console.log(err);
        })
    })

    socket.on('send-message-group', data => {
        userCPN.getUserByEmail(data.sender).then(user => {
            //   console.log(user);
            socket.to((data.code).toString()).emit('receive-message-group', [{
                sender: user[0].name,
                message: data.content,
                code: data.code,
                type: data.type
            }])
        })
    })

    socket.on("disconnect", (reason) => {
        socket.broadcast.emit('user-disconnect', socket.emailUser)
        console.log(`${socket.emailUser} disconnected for ${reason}`);
    });

    /**
     * Thêm bạn bè
     */
    socket.on('add-friend', data => {
        console.log(data);
    })
})

module.exports = socket;