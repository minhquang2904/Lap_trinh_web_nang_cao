const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

const AccountRouter = require('./routers/Account')
const OrderRouter = require('./routers/Order')
const ProductRouter = require('./routers/Product')

app.use(express.urlencoded({extended : false}))
app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.json({
        code: 0,
        message: 'API'
    })
})

app.use('/api/account', AccountRouter)
app.use('/api/orders', OrderRouter)
app.use('/api/products',ProductRouter)



mongoose.connect('mongodb://localhost/lab89', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, console.log(`http://localhost:${PORT}`))
})
.catch(e => console.log('Not connect db' + e.message))



