var trackWidth = 40;
var trackHeight = 40;
var trackColums = 20;
var trackRows = 15;
var trackGap = 2;

var levelOne = [4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,
				 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
				 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
				 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
				 1, 0, 0, 0, 1, 1, 1, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 0, 0, 1,
				 1, 0, 0, 1, 1, 0, 0, 1, 4, 4, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 5, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 5, 0, 0, 0, 5, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 2, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 5, 0, 0, 1,
				 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
				 0, 3, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
				 0, 3, 0, 0, 0, 0, 1, 4, 4, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
				 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 4];

// here we'll store a copy of the current level via the loadLevel function
var trackGrid = [];

var trackRoad = 0;
var trackWall = 1;
var playerStart = 2;
var trackGoal = 3;
var trackTree = 4;
var trackFlag = 5;
// to add new more track types in the future just add new var here and to imageList in ImageLoading.js

function returnTileTypeAtColRow(col, row) {
	if(col >= 0 && col < trackColums &&
		row >= 0 && row < trackRows) {
		 var trackIndexUnderCoord = rowColToArrayIndex(col, row);
		 return trackGrid[trackIndexUnderCoord];
	} else {
		// treat anything out of world bounds as wall just in case
		return trackWall;
	}
}

function carTrackHandling(whichCar) {
	var carTrackCol = Math.floor(whichCar.x / trackWidth);
	var carTrackRow = Math.floor(whichCar.y / trackHeight);
	var trackIndexUnderCar = rowColToArrayIndex(carTrackCol, carTrackRow);

	if(carTrackCol >= 0 && carTrackCol < trackColums &&
		carTrackRow >= 0 && carTrackRow < trackRows) {

		var tileHere = returnTileTypeAtColRow(carTrackCol,carTrackRow);
		// if bumps into a wall negate car speed to bounce in opposite direction
		if(tileHere === trackGoal) {
			loadLevel(levelOne);
			console.log(whichCar.name + ' won the race!!');
		} else if (tileHere !== trackRoad) {

			// here we fix a bug where car movement would sometimes get it stuck in a wall
			// basically undoes the cars recent motionso that it's center no longer
			// overlaps a wall
			whichCar.x -= Math.cos(whichCar.angle) * whichCar.speed;
			whichCar.y -= Math.sin(whichCar.angle) * whichCar.speed;

			// here we bounce the car backwards if user crashes into a wall
			whichCar.speed *= -0.5;
		}
	}
}

function rowColToArrayIndex(col, row) {
	return col + trackColums * row;
}

function drawTrack() {

	var arrayIndex = 0;
	var drawTileX = 0;
	var drawTileY = 0;

	for (var eachRow = 0; eachRow < trackRows; eachRow++) {
		for (var eachColumn = 0; eachColumn < trackColums; eachColumn++) {

			var tileType = trackGrid[arrayIndex];

			// draw images depending on the value of current index
			var useImage = trackPics[tileType];

			// draws image from top left corner of segment
			canvasContext.drawImage(useImage, drawTileX, drawTileY);

			drawTileX += trackWidth;
			arrayIndex++;
		}
		drawTileY += trackHeight;
		// kind of like a typewriter, want to go to end of page then shoot back to the beginning
		// and start drawing again from there
		drawTileX = 0;
	}
}
