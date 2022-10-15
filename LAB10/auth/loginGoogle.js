const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GOOGLE_CLIENT_ID = '124775906858-sidkfh151fdpi1j9aemkeerl3qumumuh.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'
const User = require('../model/User')
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')
const Active = require('../model/Active')
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

function sendActive(email, message){
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Active account',
    text: message
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if(err){
      console.log(err)
    }else{
      console.log('Email sent')
    }
  })
}

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
},
(accesToken, refreshToken, profile, done) => {
  let email = profile.emails[0].value
  User.findOne({email: email}, (err, user) => {
    if(err) return done(err, null)
    if(user){
      return done(null, profile)
    }else{
      const newUser = User({
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        photos: profile.photos[0].value,
        activated: false
      })
      newUser.save()
      .then((user) => {
        let otp = otpGenerator.generate(4, { digits: true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets:false })
        
        bcrypt.hash(otp, saltRounds)
        .then(hash => {
          const active = Active({
            email: user.email,
            otp: hash,
            status: false,
          })
  
          active.save()
          .then(() => {
            sendActive(profile.emails[0].value, `http://localhost:3000/active/${user._id} and your otp is ${otp}`)
            return done(null, profile)
          })
          .catch(err => {
            console.log("Can not add new active")  
          })
        })
        .catch(err => {
          console.log("can not bcrypt otp")
        })
      })
      .catch(err => {
        console.log("Can not add new user")
      })
    }
  })
},
))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})