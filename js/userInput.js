var mouseX = 0;
var mouseY = 0;

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

function setupInput() {
	canvas.addEventListener('mousemove', updateMousePosition)

	document.addEventListener('keydown', keyPressed)
	document.addEventListener('keyup', keyReleased)
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