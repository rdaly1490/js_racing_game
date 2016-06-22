var decelerationMultiple = 0.97;
var drivePower = 0.5;
var reversePower = 0.2;
var turnRate = 0.06;

function carClass() {

	this.x = 75;
	this.y = 75;
	this.angle = 0; // measured in radians
	this.speed = 0;
	this.myCarPic; // which pic to use
	this.name = 'Untitled Car'; // name used when declaring winner

	// help stop stacking keydown/up events, act more like a game controller button
	// instead of keyboard input by telling if buttons are held down
	this.gasKeyHeld = false;
	this.reverseKeyHeld = false;
	this.leftKeyHeld = false;
	this.rightKeyHeld = false;

	// use to make it so car can't spin in place
	this.minSpeedToTurn = 0.5;

	this.controlUp;
	this.controlDown;
	this.controlRight;
	this.controlLeft;

	this.setupInput = function(up, down, right, left) {
		this.controlUp = up;
		this.controlDown = down;
		this.controlRight = right;
		this.controlLeft = left;
	}

	this.reset = function(whichCarImage, carName) {
		this.name = carName;
		this.myCarPic = whichCarImage;
		this.speed = 0;

		// loop through all rows and columns and if the index we're currently at has a 2, we place
		// the car there, then change that index to a 0 after (to make it normal road)
		for (var eachRow = 0; eachRow < trackRows; eachRow++) {
			for (var eachColumn = 0; eachColumn < trackColums; eachColumn++) {
				var arrayIndex = rowColToArrayIndex(eachColumn, eachRow);
				if (trackGrid[arrayIndex] === playerStart) {
					trackGrid[arrayIndex] = trackRoad;
					// now we center the car within the bloack of road where the 2 was and point it facing north
					this.angle = -Math.PI/2
					this.x = eachColumn * trackWidth + trackWidth / 2;
					this.y = eachRow * trackHeight + trackHeight / 2;

					// if we find the 2 we're looking for bail out of function
					return;
				}
			}
		}
	}

	this.move = function() {

		// here we degrade the speed a little bit each frame to mimic deceleration
		// if someone lets off the gas without hittin the break (lose (1.00 - x)% of speed per frame)
		this.speed *= decelerationMultiple;

		if (this.gasKeyHeld) {
			this.speed += drivePower;
		}
		if (this.reverseKeyHeld) {
			this.speed -= reversePower;
		}
		// stop car from spinning in circles when not accelerating or reversing
		if (Math.abs(this.speed) > this.minSpeedToTurn) {
			if (this.leftKeyHeld) {
				this.angle -= turnRate;
			}
			if (this.rightKeyHeld) {
				this.angle += turnRate;
			}
		}
		// sine and cosine decompose diagonal vector into it's horizontal and vertical components 
		this.x += Math.cos(this.angle) * this.speed;
		this.y += Math.sin(this.angle) * this.speed;

		carTrackHandling(this);
	}

	this.draw = function() {
		drawBitmapCenteredWithRotation(this.myCarPic, this.x, this.y, this.angle);
	}
}
