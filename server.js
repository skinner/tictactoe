var static = require('node-static');
var http = require('http');
var socketIO = require('socket.io');
var BoardModel = require('./boardmodel');
var GameModel = require('./gamemodel');
var PlayerModel = require('./playermodel');

var fileServer = new static.Server('./public');

var server = http.createServer(function (request, response) {
    request.addListener('end', function () {
        console.log('serving request');
        fileServer.serve(request, response);
    }).resume();
});

var webSocket = socketIO(server);

var game = new GameModel();

webSocket.on('connection', function(socket) {
    console.log('a user connected');
    var player = new PlayerModel(socket);
    game.addPlayer(player);
});

server.listen(8080);
