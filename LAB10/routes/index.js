var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../model/User')
const bcrypt = require('bcrypt');
const Active = require('../model/Active')
const nodemailer = require('nodemailer')
const multer  = require('multer')
const upload = multer({ dest: '../uploads/' })
const path = require('path')
const fs = require('fs')

require('../auth/loginGoogle')
router.use(passport.initialize());
router.use(passport.session());

router.get('/login', (req, res, next) => {
  res.render('login')
})
 
router.get('/auth/google',
  passport.authenticate('google', 
  {
    scope: ['email', 'profile'], 
    prompt : "select_account" // Added here
  })
)

router.get('/auth/google/callback', 
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/failure'
  })
)

router.get('/auth/failure', (req, res) =>{
  res.render('error', {message: 'Something is wrong'})
})

router.get('/', (req, res) => {
  if(req.session.passport){
    // console.log(req.session.passport.user._json.email)
    let email = req.session.passport.user._json.email
    let alert = req.session.alert || ""
    User.findOne({email: email}, (err, user) => {
      if(err) throw err
      if(user){
        if(user.activated == true){
          return res.render('page', {email: user.email, photos: user.photos, name: user.name, id: user.id, alert: alert})
        }else{
          return res.render('error', {message: 'Your account is not actived'})  
        }
      }else{
        return res.render('error', {message: 'No user'})
      }
    })
  }else{
    return res.redirect('/login')
  }
})

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})

router.post('/', upload.single('attachment'), (req, res) => {
  const {receiver, subjectMail, contentMail} = req.body
  let pathUploads = path.join(__dirname, '../uploads');
  const file = req.file

  let name = file.originalname
  let newPath = pathUploads + '/' + name
  fs.renameSync(file.path, newPath)

  const mailOptions = {
    from: process.env.EMAIL,
    to: receiver,
    subject: subjectMail,
    text: contentMail,
    attachments: [
      {
        filename: name,
        path: newPath
      }
    ]
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if(err){
      req.session.alert = "Send mail failed"
      return res.redirect('/')
    }else{
      req.session.alert = "Send mail successfully"
      console.log("Send mail success")
      return res.redirect('/')
    }
  })

})



router.get('/logout', (req, res) => {
  req.session.destroy()
  req.logOut(() => console.log("Logout user"))
  return res.redirect('/login');
})

router.get('/active/:id', (req, res) => {
  res.render('active')
})

router.post('/active/:id', (req, res) => {
  let id = req.params.id
  let otp = req.body.otp
  User.findById({_id: id}, (err, user) => {
    if(err) throw err

    if(user){
      if(user.activated === true){
        return res.redirect('/login')
      }else{
        // bcrypt.compare(otp, )
        Active.findOne({email: user.email}, (err, u) => {
          if(err) throw err
          
          bcrypt.compare(otp, u.otp)
          .then(result => {
            if(result){
              Active.updateOne({email: user.email}, {$set: { status: true }}, {upsert: true}, function(err){
                if(err) return res.send(err.message)
                User.updateOne({_id: id}, {$set: { activated: true }}, {upsert: true}, function(err){
                  if(err) return res.send(err.message)
                  return res.redirect('/login')
                })
              })
            }else{

            }
          })
          .catch(err => {
            return res.redirect('/error', {message: err.message})
          })

        })
      }
    }else{
      return res.redirect('/error', {message: "User khong ton tai"})
    }
  })

})


module.exports = router;
