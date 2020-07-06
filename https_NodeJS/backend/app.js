const https = require("https");
const fs = require("fs")

const options = {
    key: fs.readFileSync("./certificat/key.pem"),
    cert: fs.readFileSync("./certificat/cert.pem")
}

https.createServer(options, function(req, res){
    res.writeHead(200)
    res.end("hello world");
}).listen(3000)