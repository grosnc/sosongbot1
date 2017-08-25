/*eslint-env node, express*/
/** 
* Created by http://myeonguni.com on 2016-09-02. 
*/ 
  
var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser'); 
var session = require('express-session'); 
var mongoose = require('mongoose');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();


// start server on the specified port and binding host
var server = app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
//local용
/*
var server = app.listen(8080, '0.0.0.0', function() {
// print a message when the server starts listening
console.log('server starting on localhost');
});*/

app.use(bodyParser.json());//body json
app.use(bodyParser.urlencoded()); 
app.use(session({ 
secret: 'zhJ5Ia4X598Y6PEd2hBVeZQC8TA', 
resave: false, 
saveUninitialized: true 
})); 
//public 폴더를 정적자원 디렉토리로 지정
app.use(express.static(__dirname + '/public'));

//db연결
//db설정
mongoose.connect('mongodb://sosong:sosong@aws-us-east-1-portal.26.dblayer.com:20793/admin?ssl=true');

var db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error:'));
db.once('open', function() {
	console.log("mongo db connection OK.");
});

//keyboard routing
app.use('/keyboard', require('./router/keyboard'));

//message routing
app.use('/message', require('./router/message'));

//var router = require('./router/main')(app, fs); 
