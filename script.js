///////////////////////////////////////////
/// CONSTANTS
///////////////////////////////////////////

var epsilon = 50;
var minClusterSize = 5;
var noiseColor = "grey";
var unassignedColor = "black";
var pointSize = {
	unassigned: 2,
	noise: 2,
	border: 3.5,
	core: 5
};

///////////////////////////////////////////
/// GLOBAL VARIABLES
///////////////////////////////////////////

var canvas;
var ctx;
var points = [];
var clusterColors = [];
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
		if(this.type == "noise") {
			ctx.fillStyle = noiseColor;
		}
		else if(this.type == "unassigned") {
			ctx.fillStyle = unassignedColor;
		}
		else {
			ctx.fillStyle = clusterColors[this.cID];
		}
		ctx.beginPath();
		ctx.moveTo(loc[0], loc[1]);
		ctx.arc(loc[0], loc[1], pointSize[this.type], 0, 2*Math.PI, true);
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

	drawLengthMarker();
}

function clear() {
	points = [];
	clearScreen();
}
function run() {
	clearScreen();
	console.log("Running...");
	clearIDs();
	dbscan();
	console.log("Done!");
	drawLengthMarker();
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
	ctx.clearRect(0, 0, 800, 500);
}
function drawLengthMarker() {
	ctx.beginPath();
	ctx.moveTo(10, 10);
	ctx.lineTo(10, 20);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(10+epsilon, 10);
	ctx.lineTo(10+epsilon, 20);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(10, 15);
	ctx.lineTo(10+epsilon, 15);
	ctx.stroke();
}

function clearIDs() {
	for(var i=0; i<points.length; ++i) {
		points[i].cID = -1;
		points[i].type = "unassigned";
	}
	clusterColors = [];
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
	clusterColors.push(null);
	for(var i=1; i<=cID; ++i) {
		clusterColors.push(getRandColor(1));
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

function getRandColor(brightness){
	// From https://stackoverflow.com/questions/1484506/random-color-generator
	// Six levels of brightness from 0 to 5, 0 being the darkest
	var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
	var mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
	var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){ return Math.round(x/2.0)})
	return "rgb(" + mixedrgb.join(",") + ")";
}

///////////////////////////////////////////
/// EXECUTED CODE
///////////////////////////////////////////

setup();