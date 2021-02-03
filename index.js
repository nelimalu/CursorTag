var socket = new WebSocket("ws://localhost:1345");

var canvas = document.querySelector('canvas');

canvas.width = 800;
canvas.height = 700;

var c = canvas.getContext('2d');


const colour = "rgba(" + randint(0, 255).toString() + "," + randint(0, 255).toString() + "," + randint(0, 255).toString() + ",1)"
const username = Math.random().toString()

var users = {};

var mouse = {
	username: username,
	x: canvas.width / 2,
	y: canvas.height / 2
}

function User(colour, x, y) {
	this.username = username;
	this.colour = colour;
	this.x = x;
	this.y = y;
}

socket.onopen = function(event) {
	console.log("[CONNECTION] Connection established.");

	var localUser = new User(colour, mouse.x, mouse.y);
	socket.send("JOIN" + JSON.stringify(localUser));
};

socket.onmessage = function(event) {
	var category = event.data.slice(0,4);
	var data = event.data.slice(4);
	
	if (category == "DATA") {
		users = JSON.parse(data);
	}
	else if (category == "NPLR") {
		var player = JSON.parse(data);
		users[player["username"]] = player;
	}
	else if (category == "NCRD") {
		var player = JSON.parse(data);
		users[player["username"]].x = player.x;
		users[player["username"]].y = player.y;
	}

};

socket.onclose = function(event) {
	socket.send("byee");
	console.log('[CLOSE] Connection died');
};

socket.onerror = function(error) {
	alert('[ERROR] Could not connect to the server. Please try again later.');
};

function sendLocation() {
	socket.send("NLOC" + JSON.stringify(mouse))
}


/*
<=====<!>====>
 CANVAS STUFF
<=====<!>====>
*/

canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
canvas.exitPointerLock = canvas.exitPointerLock || canvas.mozExitPointerLock;

var MOUSE_LOCKED = false;

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
	sendLocation();
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

	Object.entries(users).forEach(
	    ([key, value]) => drawCircle(value.x, value.y, 5, value.colour)
	);

	// drawCircle(mouse.x, mouse.y, 5, colour)
}

animate();
