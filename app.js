
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

// all environments
// app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

io.sockets.on('connection', function (socket) {
	var serialport = require("serialport");
	var SerialPort = serialport.SerialPort; // localize object constructor

	var sp = new SerialPort("/dev/tty.usbmodemfa131", {
		baudrate: 9600,
		parser: serialport.parsers.readline("\n")
	});

	sp.on("open", function () {
		// console.log('open');
		sp.on('data', function(data) {
			console.log('data ' +data);
		  socket.emit('data', handleData(data));

		  // socket.on('my other event', function (data) {
		  //   console.log(data);
		  // });
		  // console.log('data received: ' + data);
		});
	});
  
});

function handleData(data) {
	var result = {};
	console.log(data);
	if(data.indexOf('#') == 0) {
		data = data.replace('#', '');
		data.split(',').forEach(function(x){
			console.log(x);
		    var arr = x.split('=');
		    console.log(arr);
		    result[arr[0]] = arr[1];
		});
	}
	// console.log(result);
	return result;
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port 3000' );
});
