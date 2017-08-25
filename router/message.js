/**
 *'/message' 경로 접근에 대한 처리 
 */
var app = require('express');
var router = app.Router();
var mongoose = require('mongoose');
var fs = require('fs');
var db = mongoose.connection;
var rtn_msg = ''; 

router.use(function(req,res,next){
	console.log('Time:' , Data.now(), ' user_key:', req.body["user_key"]);
	
	fs.readFile(__dirname + '/../data/unavailable_msg.json', 'utf-8', function(err,data){
		rtn_msg = JSON.parse(data);
	});
});

module.exports = router;