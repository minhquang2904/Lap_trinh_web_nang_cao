const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({
    sum: Number,
    productList: {
        quantity: Number,
        price: Number
    }
})

module.exports = mongoose.model('Order', OrderSchema)