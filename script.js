///////////////////////////////////////////
/// CONSTANTS
///////////////////////////////////////////

var epsilon = 10;
var minClusterSize = 5;
var colorRule = { unassigned: "black" };

///////////////////////////////////////////
/// GLOBAL VARIABLES
///////////////////////////////////////////

var canvas;
var ctx;
var points = [];
var mouseInCanvas = false;
var mouseLoc = [];

///////////////////////////////////////////
/// CLASSES
///////////////////////////////////////////

function Point(loc) {
	this.loc = loc.slice();
	this.type = "unassigned";
	this.clusterID = null;

	this.draw = function() {
		ctx.fillStyle = colorRule.unassigned;
		ctx.beginPath();
		ctx.moveTo(loc[0], loc[1]);
		ctx.arc(loc[0], loc[1], 1, 0, 2*Math.PI, true);
		ctx.closePath();
		ctx.fill();
	}
}

///////////////////////////////////////////
/// FUNCTIONS
///////////////////////////////////////////

function setup() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	document.getElementById("clear").addEventListener("click", clear);
	document.getElementById("run").addEventListener("click", run);

	canvas.addEventListener("mousemove", function(event) { mouseMoveCanvas(event); });
	canvas.addEventListener("click", mouseClickCanvas);
}

function clear() {
	//
}
function run() {
	//
}

function mouseMoveCanvas(event) {
	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
	mouseLoc = [x, y];
}
function mouseClickCanvas() {
	points.push(new Point(mouseLoc));
	points[points.length-1].draw();
}

function clearScreen() {
	//
	ctx.clearRect(0, 0, 500, 500);
}

///////////////////////////////////////////
/// EXECUTED CODE
///////////////////////////////////////////

setup();