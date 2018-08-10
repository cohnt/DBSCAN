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
	this.cID = -1;

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
	clearScreen();
	console.log("Running...");
	clearIDs();
	dbscan();
	for(var i=0; i<points.length; ++i) {
		points[i].draw();
	}
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

function clearIDs() {
	for(var i=0; i<points.length; ++i) {
		points[i].cID = -1;
		points[i].type = "unassigned";
	}
}
function dbscan() {
	var cID = 0;
	for(var i=0; i<points.length; ++i) {
		if(points[i].type != "unassigned") {
			continue;
		}

		var neighbors = findNeighbors(points, points[i]);
		if(neighbors.length < minClusterSize) {
			points[i].type = "noise";
			continue;
		}

		++cID;
		points[i].cID = cID;
		points[i].type = "core";

		for(var j=0; j<neighbors.length; ++j) {
			if(points[neighbors[j]].type == "noise") {
				points[neighbors[j]].type = "border";
				points[neighbors[j]].cID = cID;
			}
			else if(points[neighbors[j]].type != "unassigned") {
				continue;
			}
			else {
				points[neighbors[j]].cID = cID;
				var newNeighbors = findNeighbors(points, points[neighbors[j]]);
				if(newNeighbors.length > minClusterSize) {
					points[neighbors[j]].type = "core";
					for(var k=0; k<newNeighbors.length; ++k) {
						if(!neighbors.includes(newNeighbors[k])) {
							neighbors.push(newNeighbors[k]);
						}
					}
				}
				else {
					points[neighbors[j]].type = "border";
				}
			}
		}
	}
}
function findNeighbors(points, point) {
	var out = [];
	for(var i=0; i<points.length; ++i) {
		if(dist(points[i].loc, point.loc) < epsilon) {
			out.push(i);
		}
	}
	return out;
}

function dist(a, b) {
	return Math.sqrt(Math.pow(a[0]-b[0], 2) + Math.pow(a[1]-b[1], 2));
}

///////////////////////////////////////////
/// EXECUTED CODE
///////////////////////////////////////////

setup();