var canvas, canvasContext;
var carPic = document.createElement('img');
var carPicLoaded = false;

var carX = 75;
var carY = 75;
//carAngle is in radians
var carAngle = 0;
var carSpeed = 0;

var decelerationMultiple = 0.97;
var drivePower = 0.5;
var reversePower = 0.2;
var turnRate = 0.04;

var mouseX = 0;
var mouseY = 0;

var trackWidth = 40;
var trackHeight = 40;
var trackColums = 20;
var trackRows = 15;
var trackGap = 2;

// Key Codes
var leftArrowKey = 37;
var upArrowKey = 38;
var rightArrowKey = 39; 
var downArrowKey = 40;

// help stop stacking key events, act more like a game controller button
// instead of keyboard input by telling if buttons are held down
var gasKeyHeld = false;
var reverseKeyHeld = false;
var leftKeyHeld = false;
var rightKeyHeld = false;

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

var trackRoad = 0;
var trackWall = 1;
var playerStart = 2;

// where the magic happens
window.onload = function() {
	canvas = document.getElementById('game-canvas');
	canvasContext = canvas.getContext('2d');

	var fps = 30;
	setInterval(updateAll, 1000/fps);

	canvas.addEventListener('mousemove', updateMousePosition)

	document.addEventListener('keydown', keyPressed)
	document.addEventListener('keyup', keyReleased)

	carPic.onload = function() {
		carPicLoaded = true;
	}
	carPic.src = 'player1car.png';

	carReset();
}

function keyPressed(e) {
	// preventDefault stops page from scrolling left or right
	e.preventDefault();

	if (e.keyCode === leftArrowKey) {
		leftKeyHeld = true;
	}
	if (e.keyCode === rightArrowKey) {
		rightKeyHeld = true;
	}
	if (e.keyCode === upArrowKey) {
		gasKeyHeld = true;
	}
	if (e.keyCode === downArrowKey) {
		reverseKeyHeld = true;
	}
}

function keyReleased(e) {
	e.preventDefault();

	if (e.keyCode === leftArrowKey) {
		leftKeyHeld = false;
	}
	if (e.keyCode === rightArrowKey) {
		rightKeyHeld = false;
	}
	if (e.keyCode === upArrowKey) {
		gasKeyHeld = false;
	}
	if (e.keyCode === downArrowKey) {
		reverseKeyHeld = false;
	}
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
	// loop through all rows and columns and if the index we're currently at has a 2, we place
	// the car there, then change that index to a 0 after (to make it normal road)
	for (var eachRow = 0; eachRow < trackRows; eachRow++) {
		for (var eachColumn = 0; eachColumn < trackColums; eachColumn++) {
			var arrayIndex = rowColToArrayIndex(eachColumn, eachRow);
			if (trackGrid[arrayIndex] === playerStart) {
				trackGrid[arrayIndex] = trackRoad;
				// now we center the car within the bloack of road where the 2 was and point it facing north
				carAngle = -Math.PI/2
				carX = eachColumn * trackWidth + trackWidth / 2;
				carY = eachRow * trackHeight + trackHeight / 2;
			}
		}
	}
}

function updateAll() {
	moveAll();
	drawAll();
}

function carMove() {

	// here we degrade the speed a little bit each frame to mimic deceleration
	// if someone lets off the gas without hittin the break (lose (1.00 - x)% of speed per frame)
	carSpeed *= decelerationMultiple;

	if (gasKeyHeld) {
		carSpeed += drivePower;
	}
	if (reverseKeyHeld) {
		carSpeed -= reversePower;
	}
	if (leftKeyHeld) {
		carAngle -= turnRate;
	}
	if (rightKeyHeld) {
		carAngle += turnRate;
	}
	// sine and cosine decompose diagonal vector into it's horizontal and vertical components 
	carX += Math.cos(carAngle) * carSpeed;
	carY += Math.sin(carAngle) * carSpeed;
}

function isWallAtColRow(col, row) {
	if(col >= 0 && col < trackColums &&
		row >= 0 && row < trackRows) {
		 var trackIndexUnderCoord = rowColToArrayIndex(col, row);
		 return trackGrid[trackIndexUnderCoord] === trackWall;
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
		if(isWallAtColRow( carTrackCol,carTrackRow )) {

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

function moveAll() {
	carMove();
	carTrackHandling();
}

function drawAll() {
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	// colorCircle(carX, carY, 10, 'white');
	if(carPicLoaded) {
		drawBitmapCenteredWithRotation(carPic, carX, carY, carAngle);
	}
	drawTrack();
}

function drawBitmapCenteredWithRotation(useBitmap, atX, atY, withAng) {

	canvasContext.save();
	canvasContext.translate(atX, atY);
	canvasContext.rotate(withAng);
	canvasContext.drawImage(useBitmap, -useBitmap.width/2, -useBitmap.height/2);
	canvasContext.restore();

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

			if (trackGrid[arrayIndex] === trackWall) {
				colorRect(trackWidth * eachColumn, trackHeight * eachRow, trackWidth - trackGap, trackHeight - trackGap, 'blue');
			}
		}
	}
}











