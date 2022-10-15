const mongoose = require('mongoose')

const user = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    photos: String,
    activated: Boolean
})

const User = mongoose.model('Account', user);
module.exports = User