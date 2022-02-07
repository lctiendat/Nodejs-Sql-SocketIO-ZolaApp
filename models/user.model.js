import mongoose from 'mongoose'

const Schema = mongoose.Schema

const User = new Schema({
    name: {
        type: String,
        require : [true , 'Tên không được để trống']
    },
    email: String,
    password: String,
    token: String,
    role: {
        type: String,
        default: 'user'
    },
    delete_flag: {
        type: Number,
        default: 0
    },
    created: Date,
    modified: Date
})

module.exports = mongoose.model('Users', User)