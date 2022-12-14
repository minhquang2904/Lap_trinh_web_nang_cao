const express = require('express');
const https = require('https')
const fetch = require('node-fetch')
const bodyParser = require('./middlewares/bodyParser')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash')
const {check, validationResult} = require('express-validator');
const uuid = require('short-uuid')

port = 8080

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser)
app.use(cookieParser('29042001'));
app.use(session({cookie: {maxAge : 6000}}));
app.use(flash())

app.get('/', (req, res) => {
    const request = https.request(
        {
            hostname: 'web-nang-cao.herokuapp.com',
            path: '/lab5/users',
            port: 443,
            method: 'GET'
        },
        (response) => {
            let body = ''
            response.on('data', data => {
                body += data.toString();
            });
            response.on('end', () => {
                const user = JSON.parse(body)
                res.render('index', {user})
            });
            response.on('error',(e) => console.log(e));
        } 
    );
    
    request.on('error', (e) => console.log(e));
    request.end();
});

app.get('/add', (req, res) => {
    let error = req.flash('error')
    res.render('add', {error})
});

app.get('/profile/:id', (req, res) => {
    if(!req.params.id){
        return res.json({code: 1, message: 'Failure'})
    }

    fetch('https://web-nang-cao.herokuapp.com/lab5/users/' + req.params.id, {
        method: 'GET',
    })
    .then(res => res.json())
    .then(json => {
        return res.render('profile', {json})
    })
    .catch(e => {
        console.log(e)
        return res.json({code: 2, message: 'Error'})
    })
});

app.post('/delete/:id', (req, res) => {
    if(!req.params.id){
        return res.json({code: 1, message: 'Failure'})
    }
    fetch('https://web-nang-cao.herokuapp.com/lab5/users/' + req.params.id, {
        method: 'DELETE',
    })
    .then(res => res.json())
    .then(json => {
        return res.json(json)
    })
    .catch(e => {
        console.log(e)
        return res.json({code: 2, message: 'Error'})
    })
});

app.post('/edit', (req, res) => {
    if(!req.params.id){
        return res.json({code: 1, message: 'Failure'})
    }
    fetch('https://web-nang-cao.herokuapp.com/lab5/users/',{
        method: 'PUT',
        headers: {"Content-type": "application/json;charset=UTF-8"},
        body: JSON.stringify({
            id: JSON.parse(req.body.user).id,
            name: JSON.parse(req.body.user).name,
            age: JSON.parse(req.body.user).age.parseInt(age),
            email: JSON.parse(req.body.user).email,
            gender: JSON.parse(req.body.user).gender,
        }),
    })
    .then(res => res.json())
    .then(json => {
        console.log('Success')
        return res.json(json)  
    })
    .catch(e => {
        console.log(e)
        return res.json({code: 2, message: 'Error'})
    })
}); 

const validator = [
    check('name').notEmpty().withMessage('Ch??a nh???p t??n ng?????i d??ng')
                    .isLength({min: 6}).withMessage('T??n ng?????i d??ng ph???i c?? ??t nh???t 6 k?? t???')
                    .isLength({max: 40}).withMessage('T??n ng?????i d??ng t???i ??a 40 k?? t???'),
    
    check('gender').exists().withMessage('Vui l??ng ch???n gi???i t??nh'),

    check('age').notEmpty().withMessage('Vui l??ng nh???p tu???i')
                    .isInt({min: 20}).withMessage('Tu???i ph???i l???n h??n 20')
                    .isInt({max: 100}).withMessage('Tu???i kh??ng ???????c v?????t qu?? 100'),

    check('email').notEmpty().withMessage('Ch??a nh???p email ng?????i d??ng')
                    .isEmail().withMessage('Email ng?????i d??ng kh??ng h???p l???')
]

app.post('/add', validator ,(req, res) => {
    const {name, age, gender, email} = req.body
    
    const result = validationResult(req)

    if(result.errors.length > 0){
        req.flash('error', result.errors[0].msg)
        res.redirect('/add')
    }else{

        fetch('https://web-nang-cao.herokuapp.com/lab5/users', {
            method: 'POST',
            body: JSON.stringify({
                name: req.body.name,
                age: parseInt(req.body.age),
                email: req.body.email,
                gender: req.body.gender,
                created_at: Date(),
                update_at: Date(),
            }),
            headers: {"Content-type": "application/json;charset=UTF-8"}
        })
        .then(res => res.json())
        .then(json => {
            res.redirect('/')
        })
        .catch(e => {
            console.log(e)
            return res.json({code: 2, message: 'Error'})
        })
    }
});

app.use((req, res) => {
    res.render('error');
});
app.listen(port, console.log(`\nB???n ??ang ch???y c???ng ${port} : ` + `http://localhost:${port}/`) )
