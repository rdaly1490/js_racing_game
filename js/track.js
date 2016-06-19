var trackWidth = 40;
var trackHeight = 40;
var trackColums = 20;
var trackRows = 15;
var trackGap = 2;

var trackGrid = [4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,
				 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
				 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
				 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
				 1, 0, 0, 0, 1, 1, 1, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 0, 0, 1,
				 1, 0, 0, 1, 1, 0, 0, 1, 4, 4, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 5, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 5, 0, 0, 0, 5, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 0, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 5, 0, 0, 1,
				 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
				 0, 3, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
				 0, 3, 0, 0, 0, 0, 1, 4, 4, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
				 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 4];

var trackRoad = 0;
var trackWall = 1;
var playerStart = 2;
var trackGoal = 3;
var trackTree = 4;
var trackFlag = 5;

function isObstacleAtColRow(col, row) {
	if(col >= 0 && col < trackColums &&
		row >= 0 && row < trackRows) {
		 var trackIndexUnderCoord = rowColToArrayIndex(col, row);
		 return trackGrid[trackIndexUnderCoord] !== trackRoad;
	} else {
		return false;
	}
}

function carTrackHandling() {
	var carTrackCol = Math.floor(carX / trackWidth);
	var carTrackRow = Math.floor(carY / trackHeight);
	var trackIndexUnderCar = rowColToArrayIndex(carTrackCol, carTrackRow);

	if(carTrackCol >= 0 && carTrackCol < trackColums &&
		carTrackRow >= 0 && carTrackRow < trackRows) {

		// if bumps into a wall negate car speed to bounce in opposite direction
		if(isObstacleAtColRow( carTrackCol,carTrackRow )) {

			// here we fix a bug where car movement would sometimes get it stuck in a wall
			// basically undoes the cars recent motionso that it's center no longer
			// overlaps a wall
			carX -= Math.cos(carAngle) * carSpeed;
			carY -= Math.sin(carAngle) * carSpeed;

			// here we bounce the car backwards if user crashes into a wall
			carSpeed *= -0.5;
		}
	}
}

function rowColToArrayIndex(col, row) {
	return col + trackColums * row;
}

function drawTrack() {

	for (var eachRow = 0; eachRow < trackRows; eachRow++) {
		for (var eachColumn = 0; eachColumn < trackColums; eachColumn++) {

			// for each row we go down, add an entire row (or set of columns) to our index.  For each over, add 1 column.
			var arrayIndex = rowColToArrayIndex(eachColumn, eachRow);
			var tileType = trackGrid[arrayIndex];
			var useImage;

			// draw images depending on the value of current index
			switch(tileType) {
				case trackRoad:
					useImage = roadPic;
					break;
				case trackWall:
					useImage = wallPic;
					break;
				case trackGoal:
					useImage = goalPic;
					break;
				case trackTree:
					useImage = treePic;
					break;	
				case trackFlag:
					useImage = flagPic;				
			}

			// draws image from top left corner of segment
			canvasContext.drawImage(useImage, trackWidth * eachColumn, trackHeight * eachRow);
		}
	}
}
