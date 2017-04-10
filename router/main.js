/**
 * Created by http://myeonguni.com on 2016-09-04.
 */

module.exports = function(app, fs)
{	
	// 키보드
	app.get('/keyboard', function(req, res){
        fs.readFile( __dirname + "/../data/" + "keyboard.json", 'utf8', function (err, data) {
           console.log( data );
           res.end( data );
        });
    });
	
	// 메시지
	app.post('/message', function(req, res){
		var result = {  };
		
		// CHECK REQ VALIDITY
        if(!req.body["user_key"] || !req.body["type"] || !req.body["content"]){
            result["success"] = 0;
            result["error"] = "invalid request";
			res.json(result);
            return;
        }
		
		// 초기 keyboard 버튼일 경우(도움말||시작하기||만든이)
		if(req.body["content"] === "도움말" || req.body["content"] === "시작하기" || req.body["content"] === "만든이"){
			fs.readFile( __dirname + "/../data/message.json", 'utf8',  function(err, data){
				var messages = JSON.parse(data);
				// 각 keyboard 버튼에 따른 응답 메시지 설정
				if(req.body["content"] === "도움말"){
					messages["message"] = {"text" : "얻고 싶은 이미지파일의 키워드를 검색하시면 자동으로 해당 이미지파일이 반환됩니다."};
				}else if(req.body["content"] === "시작하기"){
					messages["message"] = {"text" : "오늘 하루도 행복한 하루되세요. *^^*"};
				}else{
					messages["message"] = {"text" : "명우니닷컴(http://myeonguni.com)에서 개발하였습니다."};
				}
				fs.writeFile(__dirname + "/../data/message.json",
							 JSON.stringify(messages, null, '\t'), "utf8", function(err, data){
				})
				fs.readFile( __dirname + "/../data/message.json", 'utf8', function (err, data) {
					// 결과 로그 출력
					console.log("Request_user_key : "+req.body["user_key"]);
					console.log("Request_type : keyboard - "+req.body["content"]);
					res.end(data);
					return;
				})
			})
		}else { // 아닐 경우 이미지검색 실시
		    console.log( '안녕 test야' );
			var request = require('request'); //get방식으로 request에 대한 response를 받기위해
			var watson = require('watson-developer-cloud');

			var natural_language_classifier = watson.natural_language_classifier({
			  username: 'd76902b6-f214-4a16-9ff7-0db1a6de9888',
			  password: 'YjyQG68nMzHo',
			  version: 'v1'
			});
			
			
			var inputText =  req.body["content"]; //입력된 문자
			console.log( '입력된 문자 : ' + inputText);
			
			natural_language_classifier.classify({
				  text: inputText,
				  classifier_id: '90e7b4x199-nlc-36441' },
				  function(err, response) {
				    if (err)
				      console.log('error:', err);
				    else{
				      console.log(JSON.stringify(response, null, 2));
				      var result1 = JSON.stringify(response, null, 2);
				      console.log("결과 : " + result1);
				      fs.readFile( __dirname + "/../data/message.json", 'utf8',  function(err, data){
							var messages = JSON.parse(data);
							messages["message"] = {"text" : result1};
							fs.writeFile(__dirname + "/../data/message.json",
									 JSON.stringify(messages, null, '\t'), "utf8", function(err, data){
							})
							fs.readFile( __dirname + "/../data/message.json", 'utf8', function (err, data) {
								// 결과 로그 출력
								console.log("Request_user_key : "+req.body["user_key"]);
								console.log("Request_type : keyboard - "+req.body["content"]);
								res.end(data);
								return;
							})
						})
				      }
			});
			
			
			
			

				
			 
//			function callback(error, response, body) {
//				// 에러 체크
//				if(error) return console.log('Error:', error);
//				// 상태 값 체크
//				if(response.statusCode !== 200)	return console.log('Invalid Status Code Returned:', response.statusCode);
//				
//				natural_language_classifier.classify({
//				  text: 'How hot will it be today?',
//				  classifier_id: '90e7b4x199-nlc-36160' },
//				  function(err, response) {
//				    if (err)
//				      console.log('error:', err);
//				    else{
//				      console.log(JSON.stringify(response, null, 2));
//				      }
//				});
//			}
			
//			request(natural_language_classifier);

		}
    });
	
	// 친구추가
	app.post('/friend', function(req, res){
        var result = {  };
		
		// 요청 param 체크
        if(!req.body["user_key"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }
		
		// 파일 입출력
        fs.readFile( __dirname + "/../data/friend.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
			// 이미 존재하는 친구일 경우
            if(users[req.body["user_key"]]){
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }
            // 친구추가
            users[req.body["user_key"]] = req.body;
            fs.writeFile(__dirname + "/../data/friend.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = 200;
                res.json(result);
                return;
            })
        })
    });
	
	// 친구삭제(차단)
	app.delete('/friend/:user_key', function(req, res){
        var result = { };
		
        // 파일 입출력
        fs.readFile(__dirname + "/../data/friend.json", "utf8", function(err, data){
            var users = JSON.parse(data);
 
            // 존재하지 않는 친구일 경우
            if(!users[req.params.user_key]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }
			// 친구 삭제
            delete users[req.params.user_key];
            fs.writeFile(__dirname + "/../data/friend.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = 200;
                res.json(result);
                return;
            })
        })
    })
	
	// 채팅방 나가기
	app.delete('/chat_room/:user_key', function(req, res){
        var result = { };
		result = 200;
		res.json(result);
		return;
    })
}
