let vm = (()=> {
    'use strict'
    let connect = ()=> {
        let url = document.getElementById('url').value;
        console.log('url', url);
        var connection = new WebSocket('ws://127.0.0.1:9002/'+url);
        var mouse = {x: 0, y: 0};
        var canvas = document.getElementById('drawing');
        var context = canvas.getContext('2d');

        connection.onopen = function () {
            console.log((new Date()) + ' Connection  accepted.');
        }

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
            if(e.offsetX) {
                mouse.x = e.offsetX;
                mouse.y = e.offsetY;
            }
            else if(e.layerX) {
                mouse.x = e.layerX;
                mouse.y = e.layerY;
            }
            //  mouse.x = e.pageX - rect.offsetLeft ;
            // mouse.y = e.pageY - rect.offsetTop;
        }, false);

        function paintCanvas() {
            var json = JSON.stringify(mouse);
            console.log(json);
            connection.send(json);
        }
    }
    return {
        connect: connect
    };
})();