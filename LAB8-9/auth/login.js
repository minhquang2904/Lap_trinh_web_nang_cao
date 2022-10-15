const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const {token} = req.body
    const {JWT} = process.env
    if(!token){
        return res.json({
            code: 2,
            message: "Vui long dang nhap de thuc hien chuc nang"
        })
    }
    
    jwt.verify(token, JWT, (err, data) => {
        if(err){
            return res.json({
                code: 1,
                message: "Token khong hop le"
            })
        }
        req.user = data
        next()
    })
}