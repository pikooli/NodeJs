
// receive a image in base64 

const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const fs = require('fs');
const mime = require('mime');
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());
 
 
const uploadImage = async (req, res, next) => {
    // to declare some path to store your converted image
    var matches = req.body.base64image.replace(/^data:image\/jpeg;base64,/, "")

    response = {};
 
    response.type = /^data:image\/jpeg;base64,/;
    response.data = new Buffer.alloc(matches.length, matches, 'base64');

    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let fileName = "image." + type;

    try {
            fs.writeFileSync("./images/" + fileName, imageBuffer, 'utf8');
            return res.send({"status":"success"});
        } catch (e) {
            next(e);
        }
}
 
app.post('/upload/image', uploadImage)
 
app.listen(port, () => console.log(`Server is listening on port ${port}`))