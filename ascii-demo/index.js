
function logo(){
var fs = require('fs');
var path = require('path');
var readStream = fs.createReadStream(path.join(__dirname, '../ascii-demo') + '/theOffice.txt', 'utf8');
let data = ''
readStream.on('data', function(chunk) {
    data += chunk;
}).on('end', function() {
    console.log(data);
});
};

logo();