const {check}  = require('express-validator')

module.exports = [
    check('name').exists().withMessage('Vui long nhap ten san pham')
                    .notEmpty().withMessage('Khong duoc de trong ten san pham'),

    check('price').exists().withMessage('Vui long nhap gia san pham')
                        .notEmpty().withMessage('Khong duoc de trong gia san pham')
                        .isNumeric().withMessage('Gia san pham phai la so'),
    
    check('description').exists().withMessage('Vui long nhap mo ta san pham')
                    .notEmpty().withMessage('Khong duoc de trong mo ta san pham')
]