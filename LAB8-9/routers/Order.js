const express = require('express')
const Router = express.Router()
const rateLimit = require('express-rate-limit')


const OrderModel = require('../models/order')
const orderValidator = require('./validator/orderValidator')
const {validationResult} = require('express-validator')
const checkLogin = require('../auth/login')

const ordertList = rateLimit({
	windowMs: 10 * 1000, 
	max: 5, 
	standardHeaders: true, 
	legacyHeaders: false, 
    message: "Khong the gui qua 5 request trong 10s"
})


const order = rateLimit({
	windowMs: 10 * 1000, 
	max: 3,
	standardHeaders: true,
	legacyHeaders: false,
    message: "Khong the gui qua 3 request trong 10s"
})

Router.get('/', ordertList,(req, res) => {
    OrderModel.find()
    .then(orderList => {
        return res.json({
            code: 0,
            message: 'Danh sach don hang',
            data: orderList
        })
    })
    .catch(e => {
        return res.json({
            code: 1,
            message: 'Khong the hien thi danh sach don hang',
        })
    })
})

Router.get('/:id',order, (req, res) => {
    OrderModel.findById(req.params.id)
    .then(order => {
        return res.json({
            code: 0,
            message: 'Don hang can tim',
            data: order
        })
    })
    .catch(e => {
        return res.json({
            code: 1,
            message: 'Khong the hien thi hoac khong dung id san pham',
        })
    })
})

Router.post('/',checkLogin, orderValidator, (req, res) => {
    
    let result = validationResult(req)
    if(result.errors.length === 0){
        let {sum, quantity, price} = req.body

        let product = new OrderModel({
            sum: sum,
            productList: {
                quantity: quantity,
                price: price
            }
        })

        product.save()
        .then(() => {
            return res.json({
                code: 0,
                message: 'Them don hang thanh cong',
                data: product
            })
        })
        .catch(e => {
            return res.json({
                code: 2,
                message: e.message
            })
        })

    }else{
        let messages = result.array()
        let message = ''
        for(i in messages){
            message = messages[i].msg
            break
        }
    
        return res.json({
            code: 1,
            message: message
        })
    }
})

Router.delete('/:id',checkLogin, (req, res) => {
    OrderModel.findByIdAndDelete(req.params.id)
    .then(order => {
        if(req.params.id){
            return res.json({
                code: 0,
                message: 'Xoa don hang thanh cong',
            })
        }else{
            return res.json({
                code: 1,
                message: 'Xoa don hang khong thanh cong',
            })
        }
    })
    .catch(e => {
        return res.json({
            code: 2,
            message: 'Khong the xoa don hang',
        })
    })
})

Router.put('/:id',checkLogin, (req, res) => {

    let updateData = req.body

    OrderModel.findByIdAndUpdate(req.params.id, updateData, {
        new: true
    })
    .then(order => {
        console.log(order)
        if(req.params.id){
            return res.json({
                code: 0,
                message: 'Cap nhat don hang thanh cong',
                data: order
            })
        }else{
            return res.json({
                code: 0,
                message: 'Cap nhat don hang khong thanh cong',
            })
        }
    })
    .catch(e => {
        return res.json({
            code: 2,
            message: 'Khong the cap nhat don hang',
        })
    })
})

module.exports = Router