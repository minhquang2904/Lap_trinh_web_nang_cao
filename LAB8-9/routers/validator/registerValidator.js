const {check}  = require('express-validator')

module.exports = [
    check('email').exists().withMessage('Vui long nhap email')
                    .notEmpty().withMessage('Khong duoc de trong email')
                    .isEmail().withMessage('Dia chi email khong hop le'),

    check('password').exists().withMessage('Vui long nhap mat khau')
                        .notEmpty().withMessage('Mat khau khong duoc de trong')
                        .isLength({min: 6}).withMessage('Mat khau phai co it nhat 6 ky tu'),
]