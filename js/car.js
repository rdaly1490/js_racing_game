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

function carImageLoad() {
	carPic.onload = function() {
		carPicLoaded = true;
	}
	carPic.src = 'player1car.png';
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

function carDraw() {
	if(carPicLoaded) {
		drawBitmapCenteredWithRotation(carPic, carX, carY, carAngle);
	}
}