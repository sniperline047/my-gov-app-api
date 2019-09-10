var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))

var Users = require('./routes/Users.js');

app.use('/users',Users)

io.on('connection', (socket) => {
	console.log('A user Connected');
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
	socket.on('disconnect', function(){
    	console.log('User disconnected');
    });
})

http.listen(port, () => {
	console.log("Server is running on port:" + port);
})
