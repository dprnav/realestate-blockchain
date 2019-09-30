var http = require('http');
var querystring = require('querystring');
var post_data = querystring.stringify({
  'address' : "fsfd",
  'city': "fsfd",
  'state': "fsfd",
  'country': "fsfd",
  'amount': "fsfd",
  'image': "fsfd",
  'description': "fsfd"
});

// An object of options to indicate where to post to
    var post_options = {
        host: '35.185.167.108',
        port: '8080',
        path: '/campgrounds',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
