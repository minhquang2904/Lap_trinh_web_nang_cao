const express = require('express');
const bodyParser = require('body-parser');
const emailValidator = require('email-validator');
const multer = require('multer');
const app = express();
const fs = require('fs');
const uuid = require('short-uuid');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const uploads = multer({dest: 'uploads'});
require('dotenv').config();
port = 8080;

const products = new Map();

const product = fs.readFileSync(__dirname + '/items.json').toString();
const listproduct = JSON.parse(product)
listproduct.forEach(product => {
    products.set(product.id, product)
})

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'))
app.use(cookieParser('secret'));
app.use(session({cookie: {maxAge: null}}));
app.use(session({secret: 'secret_password_here'}))
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message
    next()
});


app.set("view engine",'ejs');

app.get("/", (req, res) => {
    res.send('Hello');
});

app.get("/login", (req, res) => {
    if(req.session.user){
        res.redirect('/list-product')
    }else{
        res.render('login', {
            email: '', 
            password: ''
        });
    }
});

app.get('/list-product', (req ,res) => {
    if(!req.session.user){
        res.redirect('/login')
    }else{
        res.render('listproduct', {
            products: Array.from(products.values())
        })
    }
});

app.get('/list-product/add-product', (req, res) => {
    res.render('addproduct', {
        productName: '',
        productPrice: '',
        productDesc: ''
    });
});

app.get('/list-product/see-product/:id', (req, res) => {
    var productID = req.params.id;
    var product = products.get(productID)
    res.render('seeproduct', {product: product});
});

app.get('/list-product/edit-product/:id', (req, res) => {
    var productID = req.params.id;
    var product = products.get(productID)
    var imgName = product.productImg.split('/').pop();
    res.render('editproduct', {product: product , imgName});
}); 

// app.put('/list-product/edit-product/:id', (req, res) =>{
//     var id = req.body.id;
//     if(products.has(id)){
//         products.set(productName)
//         return res.json({code: 2, message: 'Cập nhật thành công'})
//     }
// });

app.post('/list-product/delete-product',(req, res) => {
    var id = req.body.id;
    if(products.has(id)){
        products.delete(id);
        return res.json({code: 2, message: 'Xóa thành công'})
    }
});

app.post('/list-product/add-product', uploads.single('productImg') ,(req, res) => {
    var productName = req.body.productName;
    var productPrice = req.body.productPrice;
    var productImg = req.file;
    var productDesc = req.body.productDesc;
    var error = ''

    if(productName.trim() == ''){
        error = 'Chưa nhập tên sản phẩm'
        res.render('addproduct', {error: error, productName: productName , productPrice: productPrice,productDesc: productDesc  })
    }else if(productPrice == ''){
        error = 'Chưa nhập giá sản phẩm'
        res.render('addproduct', {error: error, productName: productName , productPrice: productPrice,productDesc: productDesc})
    }else if(productImg == undefined){
        error = 'Chưa chọn ảnh sản phẩm'
        res.render('addproduct', {error: error, productName: productName , productPrice: productPrice,productDesc: productDesc})
    }else if(productImg.size > 5000000){
        error = 'Kích thước ảnh phải dưới 5 MB'
        res.render('addproduct', {error: error, productName: productName , productPrice: productPrice,productDesc: productDesc})
    }else if(productDesc.trim() == ''){
        error = 'Chưa nhập mô tả sản phẩm'
        res.render('addproduct', {error: error, productName: productName , productPrice: productPrice,productDesc: productDesc})
    }else{
        var oldPath = productImg.path;
        var newPath =  'uploads/' + productImg.originalname ;
        fs.renameSync(oldPath,newPath);

        var product = {
            id: uuid.generate(),
            productName: productName,
            productPrice: productPrice,
            productImg: newPath,
            productDesc: productDesc
        }

        products.set(product.id, product)
        var item = Array.from(products.values());
        fs.writeFileSync(__dirname + '/items.json', JSON.stringify(item))

        req.session.message = {
            type: 'success',
            intro: 'Thành công! ',
            message: 'Thêm sản phẩm thành công'
        }
        
        res.redirect('/list-product')
    }
});

app.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var error = '';
    if(email == ''){
        error = 'Chưa nhập email';
        res.render('login', {error: error , email: email , password: password});
    }else if(!emailValidator.validate(email)){
        error = 'Không đúng định dạng email';
        res.render('login', {error: error , email: email , password: password});
    }else if(password == ''){
        error = 'Chưa nhập password';
        res.render('login', {error: error , email: email , password: password});
    }else if(email != process.env.EMAIL || password != process.env.PASSWORD){
        error = 'Email hoặc mật khẩu không đúng';
        res.render('login', {error: error , email: email , password: password});
    }else{
        req.session.user = email;
        res.redirect('/list-product');
    }
});

app.use((req, res) => {
    res.set('Content-Type','text/html');
    res.end('404')
});

app.listen(port, () => {
    console.log('\nBạn đang chạy với cổng - ' + port + '\n')
});

