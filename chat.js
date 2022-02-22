const io = require('socket.io')();
const socket = {
    io: io
}
const chatCPM = require('./components/chat.component');



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
        rooms.forEach((room) => {
            if (room != null)
                socket.join(room.toString())
        })
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
            let arrRoom = [];
            rooms.forEach(room => {
                arrRoom.push(room.room)
            });
            getRoomUser(arrRoom)
        })
        //  console.log(arrRoom);
    })

    //    socket.join('room-n9vBArgwS5xhdp8T1YNf')

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

    socket.on('disconnect', socket => {
        console.log('Disconnect Server');
    })
})



module.exports = socket;