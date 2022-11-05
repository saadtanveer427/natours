var path = require('path');
var fs = require('fs');

exports.key = fs.readFileSync(path.join(__dirname, './ssl/key1.pem'), 'utf8');
exports.cert = fs.readFileSync(path.join(__dirname, './ssl/cert1.pem'), 'utf8');