var canvas, canvasContext;

var blueCar = new carClass();
var greenCar = new carClass();

window.onload = function() {
	canvas = document.getElementById('game-canvas');
	canvasContext = canvas.getContext('2d');

	// Loading Screen
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	colorText('LOADING GAME...', canvas.width/2, canvas.height/2, 'white');

	// when image loading done, start game function will be called.  Stops any
	// possibility of janky image loading
	loadImages();
}

function startGame() {
	var fps = 30;
	setInterval(updateAll, 1000/fps);

	setupInput();
	blueCar.reset();
	greenCar.reset();
}

function updateAll() {
	moveAll();
	drawAll();
} 

function moveAll() {
	blueCar.move();
	greenCar.move();
}

function drawAll() {
	/*
		Note: Needed to re-draw black canvas before pngs were added for tracks so it
		would re-draw the default black grid and not leave a 'blur' of our car image.
		Now track images and wall images are re-drawn on their own every frame.  Leaving
		this as a reminder for future Rob
		colorRect(0, 0, canvas.width, canvas.height, 'black');
	*/
	drawTrack();
	blueCar.draw();
	greenCar.draw();
}











