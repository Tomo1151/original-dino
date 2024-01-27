'use strict';
console.log("Hello, world!");

class Vector2 {
	#x;
	#y;
	constructor(x = 0, y = 0) {
		this.#x = x;
		this.#y = y;
	}

	get x() {return this.#x;}
	set x(x) {this.#x = x;}
	get y() {return this.#y;}
	set y(y) {this.#y = y;}
}

class Player {
	#position = new Vector2();
	#velocity = new Vector2();
	#score = 0;
	#onGround = true;
	get position() {return this.#position;}
	set position(position) {this.#position = position;}
	get velocity() {return this.#velocity;}
	set velocity(velocity) {this.#velocity = velocity;}
	// get acceleration() {return this.#acceleration;}
	// set acceleration(acceleration) {this.#acceleration = acceleration;}
	get onGround() {return this.#onGround;}
	set onGround(onGround) {this.#onGround = onGround;}
}

class Obstacle {
	#position = new Vector2();
}

const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;
let frame = 0;
let distance = 0;

const GROUND_MARGIN = 200;
const CHARACTER_WIDTH = 40;
const CHARACTER_HEIGHT = 35;
const GRAVITY = 0.1;

const player = new Player();
console.log(player)

const dino_img = new Image();
let loaded = false;
dino_img.src = "img/dino.webp";
dino_img.onload = () => {loaded = true;}

console.log(dino_img)
function tick() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)


	if (loaded) {
		ctx.drawImage(dino_img, 40, GROUND_MARGIN + player.position.y - CHARACTER_HEIGHT, CHARACTER_WIDTH, CHARACTER_HEIGHT);
	}


	// edit parameter
	if (!player.onGround) {
		player.velocity.y += GRAVITY;
		player.position.y += player.velocity.y;

		if (player.position.y > 0) {
			player.position.y = 0;
			player.velocity.y = 0;
			player.onGround = true;
		}
	}

	// draw ground
	ctx.beginPath();
	ctx.moveTo(0, GROUND_MARGIN);
	ctx.lineTo(canvas.width, GROUND_MARGIN);
	ctx.stroke();
	requestAnimationFrame(tick);

	// draw score
	ctx.font = "20px monospace";
	ctx.textAlign = "right";
	ctx.fillText(`${distance}`, canvas.width - 100, 30);

	if(frame % 10 == 0) distance++;
	frame++;
}

window.addEventListener("keydown", jump);
window.addEventListener("click", jump);

function jump(e) {
	if(e.type == "click" || e.code == "Space") {
		if (player.onGround) {
			player.onGround = false;
			player.velocity.y = -4;
		}
	}
}

tick();