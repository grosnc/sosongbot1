/*eslint-env node, express*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// public 폴더를 정적자원 디렉토리로 지정
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});



// 키보드
//app.get('/keyboard', (req, res) => {
//	
// console.log('APIs initialize');
//	
//  const menu = {
//      type: 'buttons',
//      buttons: ["메뉴1", "메뉴2", "메뉴3"]
//  };
//
//  res.set({
//      'content-type': 'application/json'
//  }).send(JSON.stringify(menu));
//});