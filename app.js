
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

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var portName = "/dev/tty.usbmodemfa131";

var sp = new SerialPort(portName, {
		baudrate: 9600,
		// defaults for Arduino serial communication
		dataBits: 8, 
		parity: 'none', 
		stopBits: 1, 
		flowControl: false,
		parser: serialport.parsers.readline('\r\n')
});

sp.on('open',function() {
  console.log('Port open');
});

io.sockets.on('connection', function (socket) {
	console.log("connected");
});

sp.on('data', function(data) {
	console.log('>>>>>' +data);
	handleData(data);
	io.sockets.emit('data', [handleData(data), data]);
});

var patt1=/^[ad]\d{1,2}[io][=]\d+$/;
function handleData(data) {
	var result = {};
	data = data.replace(" ", "");
	if(data.indexOf('#') == 0) {
		data = data.replace('#', '');
		var splitArr = data.split(',');
		var obj = "";
		for(var i = 0; i < splitArr.length; i++) {
			obj = splitArr[i];
			if(patt1.test(obj)){
				var arr = obj.split('=');
				if(parseInt(arr[0].substring(1,3)) >13 ){
					return;
				}
				result[arr[0]] = arr[1];
			}
		}
	}
	return result;
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port 3000' );
});
