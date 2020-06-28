var http = require('http');

const data = JSON.stringify({
    todo: 'Buy the milk'
  })

var options = {
  host: 'localhost',
  path: '/test',
  port: '3001',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

callback = function(response) {
    var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });
  response.on('end', function () {
    console.log(str);
  });
}

var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
req.write(data);
req.end();