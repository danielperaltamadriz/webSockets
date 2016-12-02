(function() {
    'use strict'
    var connection = new WebSocket('ws://163.178.104.105:9002');
    var mouse = {x: 0, y: 0};
    var canvas = document.getElementById('drawing');
    var context = canvas.getContext('2d');

    connection.onopen = function () {
        console.log((new Date()) + ' Connection  accepted.');
    };

    connection.onmessage = function (message) {
        try {
            var json = JSON.parse(message.data);
            mouse.x = json.x
            mouse.y = json.y;
        } catch (ev) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        var rect = canvas.getBoundingClientRect();
        context.fillStyle = "red";
        context.fillRect(mouse.x, mouse.y, 1, 1);
        context.stroke();
    };

    canvas.addEventListener('mousedown', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.pageX - rect.left;
        mouse.y = e.pageY - rect.top;
        paintCanvas();
        canvas.addEventListener('mousemove', paintCanvas, false);
    }, false);

    canvas.addEventListener('mouseup', function (e) {
        canvas.removeEventListener('mousemove', paintCanvas, false);
    }, false);

    canvas.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.pageX - rect.left;
        mouse.y = e.pageY - rect.top;
    }, false);

    function paintCanvas() {
        var json = JSON.stringify(mouse);
        console.log(json);
        connection.send(json);
    };
})();