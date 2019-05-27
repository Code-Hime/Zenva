//initial position
var x = 10;
var y = 10;

//initial rectangle size
var w = 20;
var h = 30;

//initial speed
var speed = 2;

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var blueZone;
var greenZone;

var update = function () {

    var crossedRightLimit = x >= 270;
    var crossedLeftLimit = x <= 10;

    if(crossedRightLimit) {
        x = 270;
        speed = -speed;
    }

    else if(crossedLeftLimit) {
        x = 10;
        speed = -speed;
    }

    x = x + speed;

    blueZone = x > 0 && x < 100;
    greenZone = !blueZone && x < 200;
};

var draw = function () {
    ctx.clearRect(0, 0, 500, 300);

    if(blueZone) {
        ctx.fillStyle = "#3333FF"
    }
    else if (greenZone) {
        ctx.fillStyle = "#00CC66";
    }
    else {
        ctx.fillStyle = "rgb(200, 0, 100)";
    }
    ctx.fillRect(x, y, w, h);
};

var step = function() {

    update();
    draw();

    window.requestAnimationFrame(step);
};

step();