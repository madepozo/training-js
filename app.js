var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var Post = require('./models/postModel');
var routes = require('./routes/postRoutes');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Postdb');

app.use(express.static(__dirname + '/views'));
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

routes(app);
app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.listen(port);


console.log('API server started on: ' + port);