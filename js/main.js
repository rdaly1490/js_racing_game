// where the magic happens
window.onload = function() {
	canvas = document.getElementById('game-canvas');
	canvasContext = canvas.getContext('2d');

	var fps = 30;
	setInterval(updateAll, 1000/fps);

	setupInput();
	carImageLoad();
	carReset();
}

function updateAll() {
	moveAll();
	drawAll();
} 

function moveAll() {
	carMove();
	carTrackHandling();
}

function clearScreen() {
	colorRect(0, 0, canvas.width, canvas.height, 'black');
}

function drawAll() {
	clearScreen();
	carDraw();
	drawTrack();
}











