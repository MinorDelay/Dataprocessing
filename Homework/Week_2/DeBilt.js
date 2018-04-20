/**
 * DeBilt.js
 * Simon Kemmere 10798250
 * Implementing a javascript that plots a line graph.
 */

// var weer = "weerdebilt2010.txt";
//
// var weerFile = new XMLHttpRequest();
//
// weerFile.onreadystatechange = function() {
//   if (this.readyState === 4 && this.status === 200) {
//     load(this.responseText)
//   }
// }
//
// weerFile.open("GET", weer, true);
// weerFile.send();
//
// function load(data){

let data = document.getElementById("rawdata").innerHTML;

// split data after each line
data = data.split("\n");

// declare variables
let minTemp = 0;
let maxTemp = 0;
let temp = [];
let newDate = [];

// loop over each data element in list
for (var i = 0; i < data.length; i++) {

  // split data after each comma
  var dataSplit = data[i].split(",");

  // slice date to transform it to desired format
  var date = dataSplit[0].slice(0,4) + "-" + dataSplit[0].slice(4,6) + "-" + dataSplit[0].slice(6,8);

  // transform to European Standard Time
  var correctDate = new Date(date);

  // transform to milliseconds since 1970
  var datum = correctDate.getTime();

  // add date in ms to list
  newDate.push(datum);

  // add temperature converted to number to list
  temp.push(Number(dataSplit[1]));

  // determine minTemp and maxTemp
  if (temp[i] > maxTemp) {
    maxTemp = temp[i];
  }

  if (temp[i] < minTemp) {
    minTemp = temp[i];
  }
};

// declare variables to plot graph
let xBeg = 100; // begin of x-axis
let xEnd = 1300; // end of x-axis
let yBeg = 50; // top of y-axis
let yEnd = 450; // bottom of y-axis
let stepY = 25; // tickstep of y-axis
let stepX = 100 // tickstep of x-axis
let Tick = 10; // size of tick
let textDistX = 60; // positioning of x-axis title
let textDistY = 20; // positiioning of y-axis title
let count = 0; // counter for months
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
let xXTitle = 650; // positioning of x-axis title
let yYTitle = 275; // positioning of y-axis title
let yScale = minTemp; // values along y-axis

// create canvas
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

// begin drawing
ctx.beginPath();

// move to and draw x-axis and y-axis
ctx.moveTo(xBeg, yBeg);
ctx.lineTo(xBeg, yEnd);
ctx.moveTo(xBeg,yEnd);
ctx.lineTo(xEnd, yEnd);

// save default format
ctx.save();

// use new font
ctx.font = "bold 26px sans-serif";

// write title graph
ctx.fillText("Gemiddelde temperatuur in de Bilt in 2010", xXTitle, yBeg);

// restore default format
ctx.restore();

// create x-axis title
ctx.fillText("Months", xXTitle, (yEnd + textDistY + textDistY));

// save default format
ctx.save();

// translate canvas to new origin
ctx.translate(xBeg, yBeg);

// rotate canvas
ctx.rotate((Math.PI / 180) * - 90);

// create y-axis title
ctx.fillText("Temperature (0.1 degrees Celsius)", -275, -50); //checken of met variabelen kan

// restore default format
ctx.restore();

// create ticks and according labels on y-axis
for (var y = yEnd; y >= yBeg; y -= stepY) {
  ctx.moveTo(xBeg, y);
  ctx.lineTo(xBeg - Tick, y);
  ctx.fillText(yScale, textDistX, y);
  yScale += stepY;
}

// create ticks and according labels on x-axis
for (var x = xBeg; x <= xEnd; x += stepX) {
  ctx.moveTo(x, yEnd);
  ctx.lineTo(x, yEnd + Tick);
  ctx.fillText(months[count], x, (yEnd + textDistY));
  count++;
  if (count == 12){
    break;
  };
}

// create y-coordinate
var examineY = createTransform([minTemp, minTemp + (yEnd - yBeg)], [yEnd, yBeg]);

// create x-coordinate
var examineX = createTransform([newDate[0], newDate[data.length - 1]], [xBeg, xEnd]);

// create list for y-coordinate
let y1 = [];

// create list for x-coordinate
let x1 = [];

// loop through coordinate lists, plotting every line accordingly
for (let n = 0; n < data.length; n++) {
  y1[n] = examineY(temp[n]);
  x1[n] = examineX(newDate[n]);
  if (n == 0){
    ctx.moveTo(x1[n],y1[n]);
  }
  else {
    ctx.lineTo(x1[n], y1[n]);
  }
}

// draw every line
ctx.stroke();

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
    var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
  }
