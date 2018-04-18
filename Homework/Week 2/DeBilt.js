let data = document.getElementById("rawdata").innerHTML;
data = data.split("\n");
for (var i = 0; i < data.length; i++) {
  let dataSplit = data[i].split(",");
  let correctDate = dataSplit[0].slice(0,4) + "-" + dataSplit[0].slice(4,6) + "-" + dataSplit[0].slice(6,8);
  let date = new Date(correctDate);
  let temp = Number(dataSplit[1]);
};

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var xBeg = 100;
var xEnd = 1150;
var yBeg = 50;
var yEnd = 450;
var stepY = 25;
var stepX = 100
var Tick = 10;
var yLowBound = -100;
var yUpBound = 300;
var textDistX = 60;
var textDistY = 20
var count = 11;
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var xXTitle = 650;
var yYTitle = 275;

ctx.beginPath();
ctx.moveTo(xBeg, yBeg);
ctx.lineTo(xBeg, yEnd);
ctx.moveTo(xBeg,yEnd);
ctx.lineTo(xEnd, yEnd);
ctx.fillText("Months", xXTitle, (yEnd + textDistX + textDistX));
ctx.fillText("Temperature (0.1 degrees Celsius)", (xEnd + textDistY), yYTitle);

for (var y = yEnd; y >= yBeg; y -= stepY) {
  ctx.moveTo(xBeg, y);
  ctx.lineTo(xBeg - Tick, y);
  ctx.fillText(yLowBound, textDistY, y);
  yLowBound += stepY;
}

for (var x = xEnd; x >= xBeg; x -= stepX) {
  ctx.moveTo(x, yEnd);
  ctx.lineTo(x, yEnd + Tick);
  ctx.fillText(months[count], x, (yEnd + textDistY));
  console.log(months[count])
  count = count - 1;
}
ctx.stroke();

// function createTransform(domain, range){
// // domain is a two-element array of the data bounds [domain_min, domain_max]
// // range is a two-element array of the screen bounds [range_min, range_max]
// // this gives you two equations to solve:
// // range_min = alpha * domain_min + beta
// // range_max = alpha * domain_max + beta
// 		// a solution would be:
//
//   var domain_min = domain[0]
//   var domain_max = domain[1]
//   var range_min = range[0]
//   var range_max = range[1]
//
//   // formulas to calculate the alpha and the beta
//  	var alpha = (range_max - range_min) / (domain_max - domain_min)
//   var beta = range_max - alpha * domain_max
//
//   // returns the function for the linear transformation (y= a * x + b)
//   return function(x){
//     return alpha * x + beta;
//   }
// }
