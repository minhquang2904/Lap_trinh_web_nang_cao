const express = require('express');
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express()
const userRouter = require('./routers/user')
const fs = require('fs')
const FileReader = require('./fileReader')
const multer = require('multer')

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser('Lab6-7'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

const uploads = multer({
    dest: __dirname + '/uploads/'
})

app.use((req, res, next) => {
    req.vars = {root:__dirname}
    next()
})

app.use('/user', userRouter)

const getCurrentDir = (req, res, next) => {
    if(!req.session.user){
        return next()
    }
    const {userRoot} = req.session.user
    let {dir} = req.query
    if(dir  === undefined){
        dir = ''
    }
    
    let current = `${userRoot}/${dir}`
    if(!fs.existsSync(current)){
        current = userRoot
    }

    req.vars.current = current
    req.vars.userRoot = userRoot
    next()
}

app.get('/',getCurrentDir,(req, res) => {
    if(!req.session.user){
        return res.redirect('/user/login')
    }

    let {userRoot, current} = req.vars

    FileReader.load(userRoot, current)
    .then(files => {
        var user = req.session.user
        res.render('index', {user, files})    
    })
})

app.post('/upload', uploads.single('file') , (req, res) => {
    const {email , path} = req.body
    const file = req.file

    console.log(email, path)
    console.log(file)

    if(!email || !path || !file){
        return res.json({code: 1, message: "Error" })
    }

    const {root} = req.vars
    const currentPath = `${root}/users/${email}/${path}`

    if(!fs.existsSync(currentPath)){
        return res.json({code: 2, message: "Error" })
    }

    let name = file.originalname
    let newPath = currentPath + '/' + name

    fs.renameSync(file.path, newPath)

    return res.json({code: 0, message: "Success" })
})

const port = process.env.PORT || 8080;

app.listen(port, console.log(`\nhttp://localhost:${port}` + `\nhttp://localhost:${port}/login` + `\nhttp://localhost:${port}/register`))