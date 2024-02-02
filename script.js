'use strict';
console.log("Hello, world!");

const Vector2 = function(x = 0, y = 0) {
	this.x = x;
	this.y = y;
}

const Player = function() {
	this.position = new Vector2();
	this.velocity = new Vector2();
	this.score = 0;
	this.onGround = true;
	this.run_img_src = ['img/char_0.png', 'img/char_1.png', 'img/char_2.png'];
	this.jump_img_src = 'img/char_j.png';
	this.dead_img_src = 'img/char_d.png';
}

function Obstacle(width, height, position) {
	this.width = width;
	this.height = height;
	this.position = position;
}

const FPS = 60;
const GAME_PLAYING = 1;
const GAME_OVER = -1;

const slider = document.getElementById('fov');
const resetBtn = document.getElementById('reset_btn');
const fpsCounter = document.getElementById('fps');
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext("2d");

let STAGE_WIDTH = sessionStorage.getItem("fov") ?? 50;
let STAGE_RATIO = canvas.width / STAGE_WIDTH;
let MAX_SCORE = sessionStorage.getItem("maxScore") ?? 0;

let posture = 0;
let frame = 0;
let distance = 0;
let speed = 0.4;

const GRAVITY = 0.5;
const INIT_VELOCITY = 12;
const MIN_INTERVAL = 20;
const MAX_INTERVAL = 55;

let gameState = GAME_PLAYING;
let gameOverFrame = undefined;

const GROUND_MARGIN = 200;
const CHARACTER_WIDTH = 40;
const CHARACTER_HEIGHT = 35;
const CHARACTER_MARGIN = 40
const PERSPECTIVE_MARGIN = 10;

const player = new Player();
const obs = [];
const clouds = [];

let tailX = 0;
let ctail = 0;
let prev = 0;
let collided = false;

const dino_img = new Image();
const gameover_img = new Image();
dino_img.src = player.run_img_src[0];
gameover_img.src = 'img/gameover.png';

function tick(t) {
	if (frame == gameOverFrame + 2) {
		ctx.drawImage(gameover_img, 256, -10, 512, 256);
		setMaxScore(player.score);
		return;
	}

	// canvas clear
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw sky
	ctx.fillStyle = '#a0d8ef';
	ctx.fillRect(0, 0, canvas.width, GROUND_MARGIN);

	// draw ground
	ctx.fillStyle = "#79c06e";
	ctx.fillRect(0, GROUND_MARGIN, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.moveTo(0, GROUND_MARGIN);
	ctx.lineTo(canvas.width, GROUND_MARGIN);
	ctx.stroke();

	// setTimeout(() => {
	requestAnimationFrame(tick);
	// }, 1000 / FPS);

	// draw obstacle
	for (let i = 0; i < obs.length; i++) {
		let screenX = (STAGE_RATIO * (obs[i].position.x - distance)) + CHARACTER_MARGIN;
		let screenY = GROUND_MARGIN;
		ctx.rect(screenX, screenY + PERSPECTIVE_MARGIN, obs[i].width, -obs[i].height);

		if (screenX < -(obs[i].width + 10)) obs.splice(i, 1);
	}

	// draw clouds
	for (let i = 0; i < clouds.length; i++) {
		let screenX = (STAGE_RATIO * (clouds[i].x - distance) * 0.35);
		let screenY = clouds[i].y;
		const cloud_img = new Image();
		cloud_img.src = 'img/cloud.png';
		ctx.drawImage(cloud_img, screenX, screenY, 50, 50);

		if (screenX < -50) clouds.splice(i, 1);
	}

	// collision check
	collided = false;
	for (let i = 0; i < obs.length; i++) {
		let px = player.position.x;
		let py = player.position.y;
		let obx = obs[i].position.x;
		let obw = obs[i].width;
		let obh = obs[i].height;
		let left = Math.abs(px - obx);
		let right = CHARACTER_WIDTH / STAGE_RATIO;
		if (px > obx) {
			left = px - (obx + (obw / STAGE_RATIO))
			right = 0;
		}
		if (left < right && (py + obh) > 0) {
			if (right == 0 || Math.abs(px - obx) < (CHARACTER_WIDTH / STAGE_RATIO) / 2) {
				player.dead_img_src = 'img/char_dh.png';
			}
			collided = true;
			speed = 0;
			gameState = GAME_OVER;

			break;
		}
	}

	ctx.fillStyle = (collided) ? "red" : "black";
	ctx.fill();

	// edit player params
	if (gameState == GAME_OVER) {
		gameOverFrame = gameOverFrame ?? frame;
		dino_img.src = player.dead_img_src;
		ctx.drawImage(dino_img, CHARACTER_MARGIN, GROUND_MARGIN + player.position.y - CHARACTER_HEIGHT + PERSPECTIVE_MARGIN + 5, CHARACTER_WIDTH, CHARACTER_HEIGHT);
	} else {
		if (!player.onGround) {
			player.velocity.y += GRAVITY;
			player.position.y += player.velocity.y;
			if (player.position.y > 0) {
				player.position.y = 0;
				player.velocity.y = 0;
				player.onGround = true;
				dino_img.src = player.run_img_src[posture];
			}
		} else {
			dino_img.src = player.run_img_src[posture];
		}

		// draw character
		ctx.drawImage(dino_img, CHARACTER_MARGIN, GROUND_MARGIN + player.position.y - CHARACTER_HEIGHT + PERSPECTIVE_MARGIN + 5, CHARACTER_WIDTH, CHARACTER_HEIGHT);
	}

	// generate obstacles
	if (obs.length < 50) {
		tailX += getRandomInt(MIN_INTERVAL, MAX_INTERVAL);
		obs.push(new Obstacle(getRandomInt(15, 55), getRandomInt(45, 75), new Vector2(tailX, 0)))
	}

	// generate clouds
	if (clouds.length < 50) {
		ctail += getRandomInt(30, 100);
		let y = getRandomInt(0, 50);
		clouds.push(new Vector2(ctail, 30 + y))
	}

	// draw score
	ctx.font = "bold 22px monospace";
	ctx.strokeStyle = "black";
	ctx.fillStyle = "white";
	ctx.textAlign = "right";
	ctx.lineWidth = 1.5;
	ctx.fillText(`SCORE: ${player.score}`, canvas.width - 100, 30);
	ctx.strokeText(`SCORE: ${player.score}`, canvas.width - 100, 30);
	ctx.textAlign = "left";
	ctx.fillText(`HI SCORE: ${MAX_SCORE}`, 50, 30);
	ctx.strokeText(`HI SCORE: ${MAX_SCORE}`, 50, 30);

	// edit game params
	distance += speed;
	player.position.x = distance;
	frame++;

	// calc player score && game speed
	if (frame % 5 == 0 && gameState != GAME_OVER) {
		player.score++;
		if (player.score % 50 == 0 && player.score != 0) {
			speed = Math.min(speed + 0.02, 1);
		}
	}

	if (frame % 10 == 0) posture = (posture + 1) % 3;

	// calc FPS
	if (frame % 5 == 0) {
		let dt = t - prev;
		fpsCounter.innerText = `[fps]: ${(1000/(dt/5)).toPrecision(5)}`;
		prev = t;
	}
}

// add control listener
slider.addEventListener("input", () => {
	STAGE_WIDTH = slider.value;
	STAGE_RATIO = canvas.width / STAGE_WIDTH;
	sessionStorage.setItem("fov", slider.value);
});
resetBtn.addEventListener("click", () => {
	MAX_SCORE = 0;
	sessionStorage.removeItem("maxScore");
});
window.addEventListener("load", () => {
	let fov = sessionStorage.getItem("fov") ?? 50;
	slider.value = fov;
});

window.addEventListener("keydown", jump);
canvas.addEventListener("mousedown", jump);
canvas.addEventListener("click", retry);

function jump(e) {
	if (e.type == "mousedown" || e.code == "Space") {
		if (!player.onGround) return;

		player.onGround = false;
		dino_img.src = player.jump_img_src;
		player.velocity.y = -INIT_VELOCITY;
	}
}

function setMaxScore(score) {
	sessionStorage.setItem("maxScore", (sessionStorage.length == 0) ? score : Math.max(sessionStorage.getItem("maxScore"), score));
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}

function retry(e) {
	if (gameState != GAME_OVER) return;
	if (e.type == "click" || e.code == "Space") location.reload();
}

tick();