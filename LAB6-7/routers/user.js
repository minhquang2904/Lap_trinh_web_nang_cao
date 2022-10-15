const express = require('express')
const {check, validationResult} = require('express-validator')
const db = require('../db')
const bcrypt = require('bcrypt')
const Router = express.Router()
const fs = require('fs')

Router.get('/login', (req, res) => {
    const error = req.flash('error') || ''
    const email = req.flash('email') || ''
    const password = req.flash('password') || ''
    res.render('login',  {error, email, password})
})

const loginValidator = [
    check('email')
    .exists().withMessage('Vui lòng nhập email')
    .notEmpty().withMessage('Chưa nhập email')
    .isEmail().withMessage('Không đúng định dạng email'),

    check('password')
    .exists().withMessage('Vui lòng nhập mật khẩu')
    .notEmpty().withMessage('Chưa nhập mật khẩu')
    .isLength({min: 6}).withMessage('Mật khẩu phải có ít nhất 6 kí tự'),
]

Router.post('/login',loginValidator ,(req, res) => {
    var result = validationResult(req)
    const body = req.body
    const email = body.email
    const password = body.password

    if(result.errors.length === 0){
        const sql = 'SELECT  * FROM account WHERE email = ?'
        const params = [email]
        db.query(sql, params, (err, result, fields) => {            
            if(err){
                req.flash('error', err.message)
                req.flash('email',email)
                req.flash('password',password)
                return res.redirect('/login')
            }else if(result.length === 0){
                req.flash('error', 'Không tồn tại email')
                req.flash('email',email)
                req.flash('password',password)
                return res.redirect('/user/login')
            }
            else{
                const hashed = result[0].password
                const pass =  bcrypt.compareSync(password, hashed)
                if(!pass){
                    req.flash('error', 'Sai mật khẩu')
                    req.flash('email',email)
                    req.flash('password',password)
                    return res.redirect('/user/login')
                }else{
                    var user = result[0]
                    req.session.user =  user
                    user.userRoot = `${req.vars.root}/users/${user.email}`
                    req.app.use(express.static(user.userRoot))
                    res.redirect('/')
                }
            }
        })
    }else{
        result = result.array()
        var message
        for(fields in result){
            message = result[fields].msg
            break
        }

        req.flash('error',message)
        req.flash('email',email)
        req.flash('password',password)
        res.redirect('/user/login')
    }
})

Router.get('/register', (req, res) => {
    const error = req.flash('error') || ''
    const name = req.flash('name') || ''
    const email = req.flash('email') || ''
    res.render('register', {error, name, email})
})

const resValidator = [
    check('name')
    .exists().withMessage('Vui lòng nhập tên ngươi dùng')
    .notEmpty().withMessage('Chưa nhập tên ngưởi dùng')
    .isLength({min: 6}).withMessage('Tên người dùng phải có ít nhất 6 kí tự')
    .isLength({max: 40}).withMessage('Tên người dùng không vượt quá 40 kí tự'),

    check('email')
    .exists().withMessage('Vui lòng nhập email')
    .notEmpty().withMessage('Chưa nhập email')
    .isEmail().withMessage('Không đúng định dạng email'),

    check('password')
    .exists().withMessage('Vui lòng nhập mật khẩu')
    .notEmpty().withMessage('Chưa nhập mật khẩu')
    .isLength({min: 6}).withMessage('Mật khẩu phải có ít nhất 6 kí tự'),

    check('repassword')
    .exists().withMessage('Vui lòng nhập xác nhận mật khẩu')
    .notEmpty().withMessage('Vui lòng nhập xác nhận mật khẩu')
    .custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Mật khẩu không khớp')
        }
        return true
    })
]

Router.post('/register',resValidator, (req, res) => {
    var result = validationResult(req)
    const body = req.body
    const name = body.name
    const email = body.email
    const password = body.password

    if(result.errors.length === 0){
        const sql = 'insert into account(name, email, password) values(?,?,?)'
        const params = [name, email, bcrypt.hashSync(password, 10)]
        db.query(sql, params, (err, result, fields) => {
            if(err){
                req.flash('error', err.message)
                req.flash('name',name)
                req.flash('email',email)
                res.redirect('/user/register')
            }else{
                const {root} = req.vars
                const dir = `${root}/users/${email}`

                fs.mkdir(dir, () => {
                    return res.redirect('/user/login')
                })
            }
        })
    }else{
        result = result.array()
        var message
        for(fields in result){
            message = result[fields].msg
            break
        }

        req.flash('error',message)
        req.flash('name',name)
        req.flash('email',email)
        res.redirect('/user/register')
    }
})

Router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/user/login')
})

module.exports = Router