var canvas, canvasContext;

var carX = 75;
var carSpeedX = 5;

var carY = 75;
var carSpeedY = 5;

var mouseX = 0;
var mouseY = 0;

var trackWidth = 40;
var trackHeight = 40;
var trackColums = 20;
var trackRows = 15;
var trackGap = 2;

var trackGrid = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
				 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
				 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
				 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1,
				 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 0, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
				 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
				 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
				 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

// where the magic happens
window.onload = function() {
	canvas = document.getElementById('game-canvas');
	canvasContext = canvas.getContext('2d');

	var fps = 30;
	setInterval(updateAll, 1000/fps);

	canvas.addEventListener('mousemove', updateMousePosition)

	carReset();
}

function updateMousePosition(e) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	// for sanity sake: take mouse X coord and subtract out how far canvas is from left side
	// and how far the user has scolled side to side.  Same for Y.
	mouseX = e.clientX - rect.left - root.scrollLeft;
	mouseY = e.clientY - rect.top - root.scrollTop;
}

function carReset() {
	for (var eachRow = 0; eachRow < trackRows; eachRow++) {
		for (var eachColumn = 0; eachColumn < trackColums; eachColumn++) {
			var arrayIndex = rowColToArrayIndex(eachColumn, eachRow);
			if (trackGrid[arrayIndex] === 2) {
				trackGrid[arrayIndex] = 0;
				carX = eachColumn * trackWidth;
				carY = eachRow * trackHeight;
			}
		}
	}
}

function updateAll() {
	moveAll();
	drawAll();
}

function carMove() {
	carX+= carSpeedX;
	carY+= carSpeedY;
	
	if (carX < 0 && carSpeedX < 0.0) { // left
		carSpeedX *= -1;
	}
	if (carX > canvas.width && carSpeedX > 0.0) { // right
		carSpeedX *= -1;
	}	
	if (carY < 0) { // top
		carSpeedY *= -1;
	}
	if (carY > canvas.height) { // bottom
		carReset();
	}
}

function isTrackAtColRow(col, row) {
	if(col >= 0 && col < trackColums &&
		row >= 0 && row < trackRows) {
		 var trackIndexUnderCoord = rowColToArrayIndex(col, row);
		 return trackGrid[trackIndexUnderCoord] === 1;
	} else {
		return false;
	}
}

function carTrackHandling() {
	var carTrackCol = Math.floor(carX / trackWidth);
	var carTrackRow = Math.floor(carY / trackHeight);
	var trackIndexUnderCar = rowColToArrayIndex(carTrackCol, carTrackRow);

	// remove a track if hit, conditional allows us to check we're within bounds of game
	// technically since we're using car center, the car can extend past the current index hit causing
	// side-wall track to remove the following indexed track on the other side of the game board, since
	// it doesn't recognize track wrap into more rows.  Just an arr of indexes to the game.
	if(carTrackCol >= 0 && carTrackCol < trackColums &&
		carTrackRow >= 0 && carTrackRow < trackRows) {

		// only need to change car direction of remove track if track is there, don't change for
		// track that already disappeared
		if(isTrackAtColRow( carTrackCol,carTrackRow )) {

			/////////////////////////////////////////

			// HERE WE CHANGE CAR DIRECTION
			// from the moment before the track is hit compared to when the track is hit, if
			// the row changes (i.e. row 2 to 3) we want to reflect the car vertically because we know
			// we hit either the top of bottom.  If the column changes, we know we hit the left or
			// right side and want to reflect the car horizontally.  If we manage to hit a corner, we
			// need to change both x and y (since both row and col change), so we fire both changes below.

			/////////////////////////////////////////

			var prevCarX = carX - carSpeedX;
			var prevCarY = carY - carSpeedY;
			var prevTrackCol = Math.floor(prevCarX / trackWidth);
			var prevTrackRow = Math.floor(prevCarY / trackHeight);

			var bothTestsFailed = true;

			// if there's not a track adjacent to the one hit then bounce horizontally
			// otherwise there's a track there so we can't hit that side.
			if(prevTrackCol != carTrackCol) {
				if(isTrackAtColRow(prevTrackCol, carTrackRow) == false) {
					carSpeedX *= -1;
					bothTestsFailed = false;
				}
			}
			if(prevTrackRow != carTrackRow) {
				if(isTrackAtColRow(carTrackCol, prevTrackRow) == false) {
					carSpeedY *= -1;
					bothTestsFailed = false;
				}
			}

			// prevents car from squeezing through gap between track if corner exposed,
			// now bounces off corner properly
			// |__|__|
			//   /|  |
			//
			if(bothTestsFailed) {
				carSpeedX *= -1;
				carSpeedY *= -1;
			}

		}
	}
} 

function moveAll() {
	// carMove();
	carTrackHandling();
}

function drawAll() {
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	colorCircle(carX, carY, 10, 'white');
	drawTrack();
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY,boxWidth,boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX, textY);
}

function rowColToArrayIndex(col, row) {
	return col + trackColums * row;
}

function drawTrack() {

	for (var eachRow = 0; eachRow < trackRows; eachRow++) {
		for (var eachColumn = 0; eachColumn < trackColums; eachColumn++) {

			// for each row we go down, add an entire row (or set of columns) to our index.  For each over, add 1 column.
			var arrayIndex = rowColToArrayIndex(eachColumn, eachRow);

			if (trackGrid[arrayIndex] === 1) {
				colorRect(trackWidth * eachColumn, trackHeight * eachRow, trackWidth - trackGap, trackHeight - trackGap, 'blue');
			}
		}
	}
}











