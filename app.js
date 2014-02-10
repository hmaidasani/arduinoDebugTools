
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
	// var arduino = require('duino'),
 //    board = new arduino.Board();

 //    board.on('connected', function(){
 //      // board.write('HELLO WORLD');
 //      console.log("hi");
 //    });

 //    board.on('data', function(data) {
 //      console.log(data);
 //    });
	var serialport = require("serialport");
	var SerialPort = serialport.SerialPort; // localize object constructor
	var portName = "/dev/tty.usbmodemfa131";

	// var serialPort = new SerialPort(portName, {
 //        baudrate: 9600,
 //        // defaults for Arduino serial communication
 //         dataBits: 8, 
 //         parity: 'none', 
 //         stopBits: 1, 
 //         flowControl: false, 
 //         parser: serialport.parsers.readline("\n")
 //    });
	// var receivedData = "";
	// serialPort.on("open", function () {
	// 	console.log('open serial communication');
	//     // Listens to incoming data
	//     serialPort.on('data', function(data) { 
	//       	receivedData += data.toString();
	      	
	//       		// save the data between 'B' and 'E'
	//            console.log(">>>>>>"+receivedData);
	//            receivedData = '';
	        
	//         // send the incoming data to browser with websockets.
	//        // socketServer.emit('update', sendData);
	//     });  
	// });  
	var sp = new SerialPort("/dev/tty.usbmodemfa131", {
		baudrate: 9600,
		// defaults for Arduino serial communication
         dataBits: 8, 
         parity: 'none', 
         stopBits: 1, 
         flowControl: true,
		parser: serialport.parsers.readline("\r\n")
	});

	sp.on("open", function () {
		// console.log('open');
		sp.on('data', function(data) {
			// console.log('>>>>>' +data);
			handleData(data);
		  socket.emit('data', [handleData(data), data]);

		  // socket.on('my other event', function (data) {
		  //   console.log(data);
		  // });
		  // console.log('data received: ' + data);
		});
	});
  
});

var patt1=/^[ad]\d{1,2}[io][=]\d+$/;
function handleData(data) {
	var result = {};
	// console.log("handle>>>>>"+data);
	data = data.replace(" ", "");
	if(data.indexOf('#') == 0) {
		data = data.replace('#', '');
		var splitArr = data.split(',');
		// console.log("===="+splitArr);
		var obj = "";
		for(var i = 0; i < splitArr.length; i++) {
			obj = splitArr[i];
			//console.log(obj);
			
			if(patt1.test(obj)){
				var arr = obj.split('=');
				// console.log(parseInt(arr[0].substring(1,3)));
				if(parseInt(arr[0].substring(1,3)) >13 ){
					// console.log("?????"+arr[0]);
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
