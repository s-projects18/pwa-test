var http = require('http');
var fileSystem = require('fs');
var url = require("url");

var server = http.createServer(function(req, resp){
    var page = url.parse(req.url).pathname;
    var mime = "text/html";
    
    if(page=='/') page='/index.html';
    if(page.indexOf('.js')>-1) mime='application/javascript';
    if(page.indexOf('.json')>-1) mime='application/json';
    if(page.indexOf('.png')>-1) mime='image/png';
    
	fileSystem.readFile('.'+page, function(error, fileContent){
		if(error){
			resp.writeHead(500, {'Content-Type': 'text/plain'});
			resp.end('Error');
		}
		else{
			resp.writeHead(200, {'Content-Type': mime});
			resp.write(fileContent);
			resp.end();
		}
	});
});

server.listen(8080);
console.log('Listening at: localhost:8080');
