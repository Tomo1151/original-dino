'use strict';
console.log("Hello, world!");

const Vector2 = function (x = 0, y = 0) {
	this.x = x;
	this.y = y;
}

const Player = function() {
	this.position = new Vector2();
	this.velocity = new Vector2();
	this.score = 0;
	this.onGround = true;
	this.run_img_src = 'img/dino.webp';
	this.jump_img_src = 'img/dino.webp';
}

function Obstacle(width, height, position) {
	this.width = width;
	this.height = height;
	this.position = position;
}

const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext("2d");
const STAGE_WIDTH = 100;
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;
let frame = 0;
let distance = 0;

const GROUND_MARGIN = 200;
const CHARACTER_WIDTH = 40;
const CHARACTER_HEIGHT = 35;
const CHARACTER_MARGIN = 40
const GRAVITY = 0.75;

const MIN_INTERVAL = 10;
const MAX_INTERVAL = 40;
const player = new Player();

const obs = [];
obs.push(new Obstacle(15, 40, new Vector2(10, 0)));
obs.push(new Obstacle(15, 40, new Vector2(40, 0)));
obs.push(new Obstacle(15, 40, new Vector2(60, 0)));
obs.push(new Obstacle(15, 40, new Vector2(80, 0)));
obs.push(new Obstacle(15, 40, new Vector2(100, 0)));
let tailX = 100;
let checkFrame = 0;
let collided = false;

const dino_img = new Image();
dino_img.src = player.run_img_src;


function tick() {
	// canvas clear
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	// draw character
	ctx.drawImage(dino_img, CHARACTER_MARGIN, GROUND_MARGIN + player.position.y - CHARACTER_HEIGHT, CHARACTER_WIDTH, CHARACTER_HEIGHT);


	// edit parameter
	if (!player.onGround) {
		player.velocity.y += GRAVITY;
		player.position.y += player.velocity.y;

		if (player.position.y > 0) {
			player.position.y = 0;
			player.velocity.y = 0;
			player.onGround = true;
			dino_img.src = player.run_img_src;
		}
	}

	// draw ground
	ctx.beginPath();
	ctx.moveTo(0, GROUND_MARGIN);
	ctx.lineTo(canvas.width, GROUND_MARGIN);
	ctx.stroke();
	requestAnimationFrame(tick);

	// draw obstacle
	for (let i = 0; i < obs.length; i++) {
		let screen_x = (canvas.width / STAGE_WIDTH * (obs[i].position.x - distance))+CHARACTER_MARGIN;
		let screen_y = GROUND_MARGIN;
		ctx.rect(screen_x, screen_y, obs[i].width, -obs[i].height);


		// console.log(screen_x)
		if (screen_x < 0) {
			obs.splice(i, 1);
		}
	}

	collided = false;
	// checkFrame = 0;
	// collision check

	for (let i = 0; i < obs.length; i++) {

		let px = player.position.x;
		let py = player.position.y;
		let pw = 10;
		let ph = 10;
		let obx = obs[i].position.x;
		let oby = obs[i].position.y;
		let obw = obs[i].width;
		let obh = obs[i].height;

		// console.log(`p: (${px}, ${py}), ob: ${obx} obh: ${obh}`)

		if (Math.abs(px+1 - obx) < 1.5 && (py + obh-1.5) > 0) {
			collided = true;
		}
	}
	// console.log(collided)

	// if (collided) checkFrame++;
	checkFrame = (collided) ? checkFrame + 1 : 0;
	// if(collided) console.log(checkFrame)
	ctx.fillStyle = (checkFrame > 2) ? "red" : "black";
	ctx.fill();


	// generate obstacles
	if(obs.length < 50) {
		tailX += getRandomInt(MIN_INTERVAL, MAX_INTERVAL);
		obs.push(new Obstacle(15, 40, new Vector2(tailX, 0)))
	}

	// draw score
	ctx.font = "20px monospace";
	ctx.textAlign = "right";
	ctx.fillText(`${player.score}`, canvas.width - 100, 30);

	distance += 0.75;
	player.position.x = distance;
	frame++;

	if(frame % 5 == 0) {
		player.score++;
		// console.log(`${player.position.x}, ${player.position.y}`);
		// console.log(JSON.stringify(obs));
	}
}

window.addEventListener("keydown", jump);
window.addEventListener("click", jump);

function jump(e) {
	if(e.type == "click" || e.code == "Space") {
		if (player.onGround) {
			player.onGround = false;
			dino_img.src = player.jump_img_src;
			player.velocity.y = -10;
		}
	}
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


tick();