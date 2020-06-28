var express = require("express")
const session = require("express-session")
var app = express();
var Server = require('http').Server;
const fs = require("fs")


var server = Server(app)

app.use(session({
    saveUninitialized: false,
    secret: 'session_secret',
    resave: false
}));


app.use(function(req, res, next) {
    next()
})  

app.get('/', (req, res) => {
    req.session.user = 1
    fs.readFile("./index.html", 'utf-8', function(err, content){
        res.end(content)
    })    
});


io  = require('socket.io').listen(server)

io.sockets.on('connection', function (socket) {
    console.log('Someone just log in') 
});

server.listen(3000, () => {
    console.log("server is connnected to 3000")
});