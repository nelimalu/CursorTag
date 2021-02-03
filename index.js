var canvas = document.querySelector('canvas');

canvas.width = 800;
canvas.height = 700;

var c = canvas.getContext('2d');

const colour = "rgba(" + randint(0, 255).toString() + "," + randint(0, 255).toString() + "," + randint(0, 255).toString() + ",1)"

canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
canvas.exitPointerLock = canvas.exitPointerLock || canvas.mozExitPointerLock;

var MOUSE_LOCKED = false;

var mouse = {
	x: canvas.width / 2,
	y: canvas.height / 2
}

function randint(min, max) {
	return Math.floor(Math.random() * Math.floor(max - min)) + min;
}

function drawCircle(x, y, radius, colour) {
	c.beginPath();
	c.arc(x, y, radius, 0, Math.PI * 2, false);
	c.fillStyle = colour;
	c.fill();
}

function toggleMouse() {
	if (MOUSE_LOCKED) {
		document.exitPointerLock();
	} else {
		canvas.requestPointerLock()
	}
}

function checkIllegalMovement() {

	if (mouse.x > canvas.width) {
		mouse.x = canvas.width;
	} if (mouse.x < 0) {
		mouse.x = 0;
	} if (mouse.y > canvas.height) {
		mouse.y = canvas.height;
	} if (mouse.y < 0) {
		mouse.y = 0;
	}
}

window.addEventListener("mousedown", function(event) {
	var rect = canvas.getBoundingClientRect();

	toggleMouse();
});

window.addEventListener("mousemove", function(event) {
	var rect = canvas.getBoundingClientRect();

	if (MOUSE_LOCKED) {
		mouse.x = mouse.x + event.movementX;
		mouse.y = mouse.y + event.movementY;
		checkIllegalMovement()
	}
});

if ("onpointerlockchange" in document) {
	document.addEventListener('pointerlockchange', function(event) {
		MOUSE_LOCKED = !MOUSE_LOCKED;
	});
}

function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);

	c.fillStyle = 'black';
	c.fillRect(0, 0, innerWidth, innerHeight);

	drawCircle(mouse.x, mouse.y, 5, colour)
}

animate();
