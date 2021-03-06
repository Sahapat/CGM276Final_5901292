var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var lottery = getRandomInt(100);

server.listen(3000, function () {
    console.log("current lottery is " + lottery);
});

io.on('connection', function (socket) {
    socket.emit('login');

    socket.on('login success', function (data) {
        console.log(data.name + " has login");
    });

    socket.on('request suggest', function (data) {
        console.log(data.name + " has request: " + data.number);
        if (data.number == lottery) {
            var checkResult = {
                name: data.name,
                status: 0
            }
            socket.broadcast.emit('return result',checkResult);
            socket.emit('return result',checkResult);
            console.log(data.name+" win the lottery");
            lottery = getRandomInt(100);
            console.log("the new lottery has been created");
            console.log("current lottery is " + lottery);
            socket.emit('new lottery created');
            socket.broadcast.emit('new lottery created');
        }
        else {
            var resResult = 0;
            if(data.number < lottery)
            {
                resResult = -1;
            }
            else
            {
                resResult = 1;
            }
            var checkResult={
                name:data.name,
                status:resResult
            }
            socket.emit('return result',checkResult);
            console.log(data.name+" is not correct");
        }
    })
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

console.log("-----server is running-----");