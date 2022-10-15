const mongoose = require('mongoose')

const active = new mongoose.Schema({
    email: String,
    otp: String,
    status: Boolean,
}, {timestamps: true})

const Active = mongoose.model('Active', active);
module.exports = Active