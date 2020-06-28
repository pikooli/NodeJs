var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer")

var transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 25,
    auth: {
        user: 'darkpikooli@gmail.com',
        pass: 'ParisSchool42'
    }
});



var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res, next) {
    res.render('./index.ejs');
});

app.post('/email', function(req, res, next) {
    /* Notre code pour nodemailer */
    var mailOptions = {
        from: "darkpikooli@gmail.com",
        to: "panamepoul@gmail.com",
        subject: "test",
        text: "test",
        html: '<b>' + "test" + '</b>'
    }
    transporter.sendMail(mailOptions, function(error, info){
        if (error)
            return console.log(error)
        console.log("Message send : " + info.reponse)
    })
    transporter.close()
});

app.use(function(req, res) {
    res.sendStatus(404);
});

app.listen(8080);