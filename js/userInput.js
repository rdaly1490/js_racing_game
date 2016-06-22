var mouseX = 0;
var mouseY = 0;

// Key Codes
var leftArrowKey = 37;
var upArrowKey = 38;
var rightArrowKey = 39; 
var downArrowKey = 40;

var wKey = 87;
var aKey = 68;
var sKey = 83;
var dKey = 65;

function setupInput() {
	canvas.addEventListener('mousemove', updateMousePosition);

	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);

	greenCar.setupInput(upArrowKey, downArrowKey, rightArrowKey, leftArrowKey);
	blueCar.setupInput(wKey, sKey, dKey, aKey);
}

function keySet(keyEvent, whichCar, setTo) {
	// preventDefault stops page itself from scrolling left or right
	keyEvent.preventDefault();

	if (keyEvent.keyCode === whichCar.controlLeft) {
		whichCar.leftKeyHeld = setTo;
	}
	if (keyEvent.keyCode === whichCar.controlRight) {
		whichCar.rightKeyHeld = setTo;
	}
	if (keyEvent.keyCode === whichCar.controlUp) {
		whichCar.gasKeyHeld = setTo;
	}
	if (keyEvent.keyCode === whichCar.controlDown) {
		whichCar.reverseKeyHeld = setTo;
	}
}

function keyPressed(e) {
	keySet(e, blueCar, true);
	keySet(e, greenCar, true);
}

function keyReleased(e) {
	keySet(e, blueCar, false);
	keySet(e, greenCar, false);
}

function updateMousePosition(e) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	// for sanity sake: take mouse X coord and subtract out how far canvas is from left side
	// and how far the user has scolled side to side.  Same for Y.
	mouseX = e.clientX - rect.left - root.scrollLeft;
	mouseY = e.clientY - rect.top - root.scrollTop;
}