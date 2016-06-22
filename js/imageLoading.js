var carPic = document.createElement('img');
var trackPics = []

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

function loadImageForTrackCode(trackCode, fileName) {
	trackPics[trackCode] = document.createElement('img');
	beginLoadingImage(trackPics[trackCode], fileName);
}

function loadImages() {

	var imageList = [
		{varName: carPic, fileName: './images/player1car.png'},
		{trackType: trackRoad, fileName: './images/track_road.png'},
		{trackType: trackWall, fileName: './images/track_wall.png'},
		{trackType: trackGoal, fileName: './images/track_goal.png'},
		{trackType: trackTree, fileName: './images/track_tree.png'},
		{trackType: trackFlag, fileName: './images/track_flag.png'}
	];

	/*
		var trackRoad = 0;
		var trackWall = 1;
		var playerStart = 2;
		var trackGoal = 3;
		var trackTree = 4;
		var trackFlag = 5;
	*/

	picsToLoad = imageList.length;

	imageList.forEach(function(item) {
		if (item.varName !== undefined) {
			beginLoadingImage(item.varName, item.fileName);
		} else {
			loadImageForTrackCode(item.trackType, item.fileName);
		}
	});
}
