const {check}  = require('express-validator')

module.exports = [
    check('sum').exists().withMessage('Vui long nhap tong gia tien')
                    .notEmpty().withMessage('Khong duoc de trong tong gia tien')
                    .isNumeric().withMessage('Tong gia tien phai la so'),

    check('quantity').exists().withMessage('Vui long nhap so luong san pham')
                        .notEmpty().withMessage('Khong duoc de trong so luong san pham')
                        .isNumeric().withMessage('So luong san pham phai la so'),

    
    check('price').exists().withMessage('Vui long nhap gia san pham')
                    .notEmpty().withMessage('Khong duoc de trong gia san pham')
                    .isNumeric().withMessage('Gia san pha, phai la so'),
]