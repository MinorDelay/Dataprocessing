/*
*
* Name: Simon Kemmere
* Student number: 10798250
* Homework assignment week 3
* Interactive bar chart in Javascript
*/


// retrieve data from JSON file so it can be manipulated by D3
d3.json("Average_salary.json", function (error, salData) {

  // if error show error in console log
  if (error) throw error;

  // create list for names of clubs
  var club = []
  for (var i = 0; i < salData.length; i++) {
    club.push(salData[i]["Club"])
  }

  // create svg canvas specifications
  var height = 500;
  var width = 1200;

  // create padding
  var margin = {"width" : 100, "height" : 100};

  // determine number of bars and space between bars
  var bars = salData.length;
  var barPadding = 2;

  // determine max range of salaries
  var max = d3.max(salData, function(d) { return d.Average_salary; });

  // create linear scale for x-axis
  var xScale = d3.scale.ordinal()
                       .domain(club)
                       .rangeRoundBands([margin.width, width + margin.width]);


  // create linear scale for y-axis
  var yScale = d3.scale.linear()
                       .domain([0, max])
                       .range([0, height]);

  // create linear scale of axes
  var axisScale = d3.scale.linear()
                          .domain([0, max])
                          .range([height, 0]);

  // create x-axis function
  var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .outerTickSize(0);

  // create y-axis function
  var yAxis = d3.svg.axis()
                    .scale(axisScale)
                    .orient("left")
                    .ticks(7);

  // create tooltip that returns a label for every bar
  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-20, 0])
    .html(function(d,i) {
      return "<strong>" + d.Club + ": </strong><span style='color:blue'>" + "$" + d.Average_salary + "</span>";
    });

  // create svg canvas element containing with and height + margins
  var svg = d3.select("body")
              .append("svg")
              .attr("width", width + (2 * margin.width))
              .attr("height", height + (2 * margin.height));

  // call tip function
  svg.call(tip);

  // create bar/rect for every datapoint in the dataset
  svg.selectAll("rect")
     .data(salData)
     .enter()
     .append("rect")
     .attr("class", "bar")

     // calculate x-coordinate of rect
     .attr("x", function(d, i) {
       return (i * (width / bars)) + margin.width;
     })

     // determine width of every bar
     .attr("width", width / bars - barPadding)

     // calculate y-coordinate of rect
     .attr("y", function(d) {
       return (height + margin.height - yScale(d.Average_salary));
     })

     // return height of every bar
     .attr("height", function(d) {
       return yScale(d.Average_salary);
     })
     .attr("fill", "red")
     .on("mouseover", tip.show)
     .on('mouseout', tip.hide);

     // append x-axis
     svg.append("g")
      .attr("class", "axis")

      // calculate position of x-axis
      .attr("transform", "translate(0," + (height + margin.height) + ")")
      .call(xAxis)

      // rotate labels under ticks
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(40)")
      .style("text-anchor", "start");

   // append y-axis
   svg.append("g")
      .attr("class", "axis")

      // calculate postion of y-axis
      .attr("transform", "translate(" + margin.width + "," + margin.height + ")")
      .call(yAxis);

   // append x-axis label
   svg.append("text")
      .attr("x", (width / 2) + margin.width)
      .attr("y", margin.height + height + (0.75 * margin.height))
      .style("text-anchor", "middle")
      .text("Soccer club");

   // append y-axis label
   svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", - (height / 2) - margin.height)
      .attr("y", 0)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Average salary per soccer club");
});

// create title of document
var title = d3.select("body")
              .append("h3")
              .text("Average salary per soccer club in the MLS in 2017");

// create title for tab
var tabTitle = d3.select("head").append("title")
              .text("Simon's bar chart");

// determine max outline of description
var descrWidth = 0.30 * window.innerWidth;

// create description of graph
var description = d3.select("body").append("div")
                    .style("width", descrWidth + "px")
                    .text("This is a bar chart overview containing the average \
                            salary per soccer club in the MLS in 2017. The data \
                            contained two players who were without a club. They \
                            are incorperated under the clubless label. Also \
                            there was club, LAFC, which contained only two players \
                            thus making it a somewhat unreliable average.");

var persInfo = d3.select("body")
                 .append("h3")
                 .text("Simon Kemmere - 17098250");
