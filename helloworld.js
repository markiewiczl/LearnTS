const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const util = require("util");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('view engine', 'ejs');
var messages = [];
var author = [];

app.get('/', function(req, res) {
    res.render('index',{messages: messages, author: author});
});

app.post('/msg', urlencodedParser, function(req, res) {
    console.log("dupa z dupy bez dupy: " + req.body.frontmessage);
    messages.push(req.body.frontmessage);
    author.push(req.body.author);
    res.render('index', {messages: messages, author: author})
})

app.post('/delete', urlencodedParser, function(req, res) {
    var index = messages.indexOf(req.body.removedAuthor)
    if (index > -1) {
        messages.splice(index, 1)
        author.splice(index, 1)
    }
    res.render('index', {messages: messages, author: author})
})

const server = http.createServer(app);
const port = 8080;
app.listen(port);