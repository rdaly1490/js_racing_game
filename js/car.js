var decelerationMultiple = 0.97;
var drivePower = 0.5;
var reversePower = 0.2;
var turnRate = 0.06;

// use to make it so car can't spin in place
var minSpeedToTurn = 0.5;

function carClass() {

	this.x = 75;
	this.y = 75;
	//this.angle is in radians
	this.angle = 0;
	this.speed = 0;

	this.reset = function() {
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

		if (gasKeyHeld) {
			this.speed += drivePower;
		}
		if (reverseKeyHeld) {
			this.speed -= reversePower;
		}
		// stop car from spinning in circles when not accelerating or reversing
		if (Math.abs(this.speed) > minSpeedToTurn) {
			if (leftKeyHeld) {
				this.angle -= turnRate;
			}
			if (rightKeyHeld) {
				this.angle += turnRate;
			}
		}
		// sine and cosine decompose diagonal vector into it's horizontal and vertical components 
		this.x += Math.cos(this.angle) * this.speed;
		this.y += Math.sin(this.angle) * this.speed;

		carTrackHandling(this);
	}

	this.draw = function() {
		drawBitmapCenteredWithRotation(carPic, this.x, this.y, this.angle);
	}
}
