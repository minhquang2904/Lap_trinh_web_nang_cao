const express = require('express')
const Router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {validationResult} = require('express-validator')
const registerValidator = require('./validator/registerValidator')
const loginValidator = require('./validator/loginValidator')
const AccountModel = require('../models/account')


Router.get('/',(req, res) => {
    res.json({
        code: 0,
        message: 'Account'
    })
})

Router.post('/login',loginValidator, (req, res) => {

    let result = validationResult(req)
    let user = undefined

    if(result.errors.length === 0){
        let {email, password} = req.body
        AccountModel.findOne({email: email})
        .then(e => {
            if(!e){
                throw new Error('Email khong ton tai')
            } 
            user = e
            return bcrypt.compare(password, e.password)
        })
        .then(passwordMatch => {
            if(!passwordMatch){
                return res.json({
                    code: 3,
                    message: "Login failure"
                })
            }

            const {JWT} = process.env
            jwt.sign({
                email: user.email,
            }, JWT,{
                expiresIn: '1h'
            }, (err, token) => {
                if(err) throw err
                return res.json({
                    code: 0,
                    message: 'Login success',
                    token: token
                })    
            })
        })
        .catch(e => {
            return res.json({
                code: 2,
                message: "Login not success, " + e.message
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


Router.post('/register',registerValidator ,(req, res) => {
    let result = validationResult(req)

    if(result.errors.length === 0){

        let {email, password} = req.body
        AccountModel.findOne({email: email})
        .then(e => {
            if(e){
                throw new Error('Email da ton tai')
            } 
        })
        .then(() => bcrypt.hash(password, 10))
        .then(hashed => {

            let user = new AccountModel({
                email: email,
                password: hashed,
            })

            user.save()
            .then(() => {
                return res.json({
                    code: 0,
                    message: 'Register Success',
                    data: user
                })
            })
            .catch(e => {
                return res.json({
                    code: 2,
                    message: "Register not success" + e.message
                })
            })
        })
        .catch(e => {
            return res.json({
                code: 2,
                message: "Register not success, " + e.message
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


module.exports = Router