var carPic = document.createElement('img');
var roadPic = document.createElement('img');
var wallPic = document.createElement('img');
var goalPic = document.createElement('img');
var treePic = document.createElement('img');
var flagPic = document.createElement('img');

var picsToLoad = 0; // set in loadImages() based on length of imageList array

// every time an image loads it will decrement our counter, so game wont kick off
// until all images are loaded.
function countLoadedImages() {
	picsToLoad--;
	if (picsToLoad === 0) {
		startGame();
	}
}

function beginLoadingImage(imageVar, filename) {
	imageVar.onload = countLoadedImages;
	imageVar.src = filename;
}

function loadImages() {

	var imageList = [
		{varName: carPic, fileName: './images/player1car.png'},
		{varName: roadPic, fileName: './images/track_road.png'},
		{varName: wallPic, fileName: './images/track_wall.png'},
		{varName: goalPic, fileName: './images/track_goal.png'},
		{varName: treePic, fileName: './images/track_tree.png'},
		{varName: flagPic, fileName: './images/track_flag.png'}
	];

	picsToLoad = imageList.length;

	imageList.forEach(function(item) {
		beginLoadingImage(item.varName, item.fileName);
	});
}
