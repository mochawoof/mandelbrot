let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let maxIterations = 80;
let offsetX = 0;
let offsetY = 0;

let canvasMouseDown = false;
canvas.onmousedown = function() {
	canvasMouseDown = true;
}
canvas.onmouseup = function() {
	canvasMouseDown = false;
	plot();
}
canvas.onmousemove = function(e) {
	if (canvasMouseDown) {
		offsetX -= e.movementX / 100;
		offsetY -= e.movementY / 100;
	}
}

document.querySelector("#maxIterationsRange").onchange = function(e) {
	maxIterations = e.target.value;
	plot();
}

document.querySelector("#canvasSizeRange").onchange = function(e) {
	let val = e.target.value / 3;
	canvas.width = 150 * val;
	canvas.height = 100 * val;
	document.querySelector("#canvasSizeLabel").innerText = canvas.width + "x" + canvas.height;
	plot();
}

document.querySelector("#selectedColorSelect").onchange = function(e) {
	selectedColor = e.target.value;
	plot();
}

let colorsFuncs = [
{
	name: "Grayscale",
	func: function(result) {
		let color = Math.floor((result / maxIterations) * 255).toString(16);
		ctx.fillStyle = "#" + color + color + color;
	}
},
{
	name: "Inverted Grayscale",
	func: function(result) {
		let color = (255 - Math.floor((result / maxIterations) * 255)).toString(16);
		ctx.fillStyle = "#" + color + color + color;
	}
},
{
	name: "Checkers",
	func: function(result, x, y) {
		let rawColor = Math.floor((result / maxIterations) * 255);
		let color = rawColor.toString(16);
		ctx.fillStyle = "#" + color + color + color;
		if (rawColor > 200) {
			let interval = canvas.width / 8;
			let xHundred = Math.floor(x / interval);
			let yHundred = Math.floor(y / interval);
			if (yHundred % 2 == 0) {
				if (xHundred % 2 == 0) {
					ctx.fillStyle = "#cccccc";
				}
			} else {
				if (xHundred % 2 != 0) {
					ctx.fillStyle = "#cccccc";
				}
			}
		}
	}
},
{
	name: "Hot and Cold",
	func: function(result) {
		let raw = result / maxIterations;
		if (raw > 0.5) {
			let color = Math.floor((result / maxIterations) * 255).toString(16);
			ctx.fillStyle = "#" + color + "0000";
		} else {
			let color = (255 - Math.floor((result / maxIterations) * 255)).toString(16);
			ctx.fillStyle = "#0000" + color;
		}
	}
}
];
let selectedColor = 0;

for (let [key, value] of Object.entries(colorsFuncs)) {
	let n = document.createElement("option");
	n.value = key;
	n.innerText = value.name;
	document.querySelector("#selectedColorSelect").appendChild(n);
}

let blankComplex = new Complex();
function mandelbrot(c) {
	let z = blankComplex;
	let n = 0;
	while (z.abs() <= 2 && n < maxIterations) {
		z = c.add(z.mul(z));
		n += 1;	
	}
	return n;
}

let lastTimeStarted;
function plot() {
	let timeStarted = Date.now();
	lastTimeStarted = timeStarted;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let x=0; x < canvas.width; x++) {
		setTimeout(function() {
			for (let y=0; y < canvas.height; y++) {
				if (timeStarted == lastTimeStarted) {			
					let c = new Complex(offsetX + (x / canvas.width),
					offsetY + (y / canvas.height));
					let result = mandelbrot(c);
					colorsFuncs[selectedColor].func(result, x, y);
					ctx.fillRect(x, y, 1, 1);
				} else {
					break;
				}
			}
		}, 0);
	}
}

function reset() {
	offsetX = 0;
	offsetY = 0;
	plot();
}

plot();