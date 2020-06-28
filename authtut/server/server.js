const express = require("express")
const {uuid} = require("uuidv4") 
const session = require("express-session")
const fileStore = require("session-file-store")(session)
const bodyParser = require("body-parser")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const axios = require("axios")
const bcrypt = require("bcrypt")

const app = express();

//no use anymore
const users = [{
    id: "2f24vvg", email:"test@test.com", password: "password"
}]

// configure passport.js to use the local strategy 

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
      console.log('Inside local strategy callback')
      // here is where you make a call to the database
      // to find the user based on their username or email address
      // for now, we'll just pretend we found that it was users[0]
      axios.get(`http://localhost:5000/users?email=${email}`)
      .then(res =>{
          const user = res.data[0] 
          if (!user)
                return done(null, false, {message: "Invalid credentials.\n"});
          if(!bcrypt.compareSync(password, user.password))
            return done(null, false, {message: "Invalid credentials.\n"});
        return done(null, user)
        })
        .catch(error => done(error))
    }
  ));
// tell passport how to srialize the user 
passport.serializeUser(( user, done ) => {
    console.log("Inside serializeUser callback. User id is save to the session file store here ")
    console.log(user)
    done(null, user.id)
})

passport.deserializeUser((id, done) =>{
    console.log("Inside deserializeUser callback")
    console.log(`The user id passport saved in the session file store is : ${id}`)
  axios.get(`http://localhost:5000/users/${id}`)
  .then(res => done(null, res))
  .catch(err => done(err, false))
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(session({
    genid :(req) => {
        console.log("Inside the session middleware")
        console.log(`session ID : ${req.sessionID}`)
        return uuid();
    },
    store: new fileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    console.log("Inside the homepage callback function")
    console.log(`session ID : ${req.sessionID}`)
    res.send(`you hit home page`)
})

app.get("/login", (req, res) => {
    console.log("Inside GET /login callback function")
    console.log(req.sessionID)
    res.send("You got the login page\n")
})

app.post("/login", (req, res,next) => {
    console.log("Inside POST /login callback function \n")
    passport.authenticate('local', (err, user, info) => {
        if (info) {return res.send(info.message)}
        if (err) {return res.send(err)}
        if (!user) {return res.redirect('/login')}
        console.log("Inside passport.authenticate() callback")
        console.log(`req.session.passport : ${JSON.stringify(req.session.passport)}`)
        console.log(`req.user: ${JSON.stringify(req.user)}`)
        req.login(user, (err) => {
            console.log("Inside req.login() callback\n")
            console.log(`req.session.passport : ${JSON.stringify(req.session.passport)}`)
            console.log(`req.user: ${JSON.stringify(req.user)}`)
            if (err) {return next(err)}
            return res.redirect("/authrequired")
        })
    })
    (req, res, next)
})

app.get('/authrequired', (req, res) => {
    console.log('Inside GET /authrequired callback')
    console.log(`User authenticated ? ${req.isAuthenticated()}`)
    if (req.isAuthenticated())
        res.send("You hit the authentication endpoint\n")
    else
        res.redirect('/')
})

app.on("listening", ()=>{
    console.log("listen on port 3000")
})

app.listen(3000, () => {
    console.log("Listen on localhost:3000")
})