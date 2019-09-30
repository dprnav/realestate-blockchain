var http = require('http');
var querystring = require('querystring');
var post_data = querystring.stringify({
  'id' : "0x431df35ea9375a77c8bc166a2ce0c39a918dff8a"
});

// An object of options to indicate where to post to
    var post_options = {
        host: '192.168.8.101',
        port: '5050',
        path: '/myaction',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 45
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
