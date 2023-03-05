const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('view engine', 'ejs');
var message = [];

app.get('/', function(req, res) {
    res.render('index',{message}); //przesłanie wiadomości
});

app.post('/msg', urlencodedParser, function(req, res) {
    console.log("dupa z dupy bez dupy: " + req.body.frontmessage);
    message.push(req.body.frontmessage);
    res.render('index', {message})
})
const server = http.createServer(app);
const port = 8002;
server.listen(port);
console.debug('Server listening on port ' + port);