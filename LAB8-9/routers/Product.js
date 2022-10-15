const express = require('express')
const Router = express.Router()
const rateLimit = require('express-rate-limit')

const ProductModel = require('../models/product')
const productValidator = require('./validator/productValidator')
const {validationResult} = require('express-validator')
const checkLogin = require('../auth/login')

const productList = rateLimit({
	windowMs: 10 * 1000, 
	max: 5, 
	standardHeaders: true, 
	legacyHeaders: false, 
    message: "Khong the gui qua 5 request trong 10s"
})


const product = rateLimit({
	windowMs: 10 * 1000, 
	max: 3,
	standardHeaders: true,
	legacyHeaders: false,
    message: "Khong the gui qua 3 request trong 10s"
})

Router.get('/',productList, (req, res) => {
    ProductModel.find()
    .then(listproduct => {
        return res.json({
            code: 0,
            message: 'Danh sach san pham',
            data: listproduct
        })
    })
    .catch(e => {
        return res.json({
            code: 2,
            message: 'Khong the hien thi danh sach san pham',
        })
    })
})

Router.get('/:id', product,(req, res) => {
    ProductModel.findById(req.params.id)
    .then(product => {
        if(!req.params.id){
            return res.json({
                code: 0,
                message: 'Khong tim thay san pham',
                data: product
            })
        }else{
            return res.json({
                code: 1,
                message: 'Da tim thay san pham',
                data: product
            })
        }
    })
    .catch(e => {
        return res.json({
            code: 2,
            message: 'Khong the hien thi danh sach san pham',
        })
    })
})

Router.post('/',checkLogin, productValidator, (req, res) => {
    
    let result = validationResult(req)
    if(result.errors.length === 0){
        let {name, price, description} = req.body

        let product = new ProductModel({
            name: name,
            price: price,
            description: description
        })

        product.save()
        .then(() => {
            return res.json({
                code: 0,
                message: 'Them san pham thanh cong',
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
    ProductModel.findByIdAndDelete(req.params.id)
    .then(product => {
        if(req.params.id){
            return res.json({
                code: 0,
                message: 'Xoa san pham thanh cong',
            })
        }else{
            return res.json({
                code: 1,
                message: 'Xoa san pham khong thanh cong',
            })
        }
    })
    .catch(e => {
        return res.json({
            code: 2,
            message: 'Khong the xoa san pham',
        })
    })
})

Router.put('/:id',checkLogin, (req, res) => {

    let updateData = req.body

    ProductModel.findByIdAndUpdate(req.params.id, updateData, {
        new: true
    })
    .then(product => {
        if(req.params.id){
            return res.json({
                code: 0,
                message: 'Cap nhat san pham thanh cong',
                data: product
            })
        }else{
            return res.json({
                code: 0,
                message: 'Cap nhat san pham khong thanh cong',
            })
        }
    })
    .catch(e => {
        return res.json({
            code: 2,
            message: 'Khong the cap nhat san pham',
        })
    })
})


module.exports = Router