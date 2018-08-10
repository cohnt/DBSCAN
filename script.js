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
	document.getElementById("reset").addEventListener("click", reset);
}

function clear() {
	//
}
function run() {
	//
}
function reset() {
	//
}

///////////////////////////////////////////
/// EXECUTED CODE
///////////////////////////////////////////

setup();