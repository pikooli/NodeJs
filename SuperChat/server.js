var express = require('express');
var ent = require("ent");   // ent allow you to encode and decode caracted to prevent people sending script to other.
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000);
// WARNING: app.listen(80) will NOT work here!

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on("connect", function(socket){

    console.log("someone is connected");
    
    socket.on("speudo", function(speudo){
        speudo = ent.encode(speudo);
        socket.speudo = speudo;
    });

    socket.on("message", (message, fn)=>{
        message = ent.encode(message);
        socket.broadcast.emit("message", {speudo: socket.speudo, content: message});
        fn(socket.speudo, message);
        console.log(socket.speudo + " : " + message);
    });
});