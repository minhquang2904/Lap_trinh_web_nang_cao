const mongoose = require('mongoose')

const AccountSchema = mongoose.Schema({
    email:{
        type: String,
        unique: true
    },
    password: String,
})

module.exports = mongoose.model('Account', AccountSchema)