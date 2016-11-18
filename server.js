(function() {
    'use strict'
    var webSocketsServerPort = 9002;
    var webSocketServer = require('websocket').server;
    var http = require('http');
    var clients = [];

    var server = http.createServer(function (request, response) {
    });

    server.listen(webSocketsServerPort, function () {
        console.log((new Date()) + " Server is listening on port: " + webSocketsServerPort);
    });

    var wsServer = new webSocketServer({
        httpServer: server
    });

    wsServer.on('request', function (request) {
        var connection = request.accept(null, request.origin);
        console.log((new Date()) + ' Connection accepted.');
        clients.push(connection);

        connection.on('message', function (msg) {
            broadcast(msg.utf8Data);
        });
    });

    function broadcast(msg) {
        for (var i = 0; i < clients.length; i++)
            clients[i].send(msg);
    };
})();