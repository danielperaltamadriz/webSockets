(function() {
    'use strict'

    var webSocketsServerPort = 9002;
    var webSocketServer = require('websocket').server;
    var http = require('http');
    let pathnames = [];

    var server = http.createServer(function (request, response) {
    });

    server.listen(webSocketsServerPort, function () {
        console.log((new Date()) + " Server is listening on port: " + webSocketsServerPort);
    });

    var wsServer = new webSocketServer({
        httpServer: server
    });

    wsServer.on('request', function (request) {
        let url = request.resourceURL.pathname;
        console.log('url', url)
        var connection = request.accept(null, request.origin);
        console.log((new Date()) + ' Connection accepted.');
        if(typeof (pathnames[url])=='undefined')
            pathnames[url] = [];
        pathnames[url].push(connection);

        connection.on('message', function (msg) {
            for (var i = 0; i < pathnames[url].length; i++) {
                broadcast(msg.utf8Data, url);
            }
        });
    });

    function broadcast(msg, url) {
        for (var i = 0; i < pathnames[url].length; i++)
            pathnames[url][i].send(msg);
    };
})();