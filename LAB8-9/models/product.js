const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    name: {
        type: String
    },
    price: Number,
    description: String
})

module.exports = mongoose.model('Product', ProductSchema)