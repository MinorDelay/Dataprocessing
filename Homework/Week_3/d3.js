d3.json("Average_salary.json", function (error, salData) {
  if (error) throw error;

  var height = 500;
  var width = 1200;
  var margin = {"width" : 100, "height" : 100}
  var bars = salData.length;
  var barPadding = 2;
  var max = d3.max(salData, function(d) { return d.Average_salary; });
  var barsList = ["ATL", "CHI", "CLB", "COL", "DAL", "DC", "HOU", "KC", "LA", "LAFC", "MNUFC", "MTL", "NE", "NYCFC", "NYRB", "ORL", "PHI", "POR", "RSL", "SEA", "SJ", "TOR", "VAN", "NOCLUB", "TOTAL"];
  var xScale = d3.scale.ordinal()
                       .domain(barsList)
                       .rangeRoundBands([margin.width, width + margin.width]);


  var yScale = d3.scale.linear()
                       .domain([0, max])
                       .range([0, height]);

  var axisScale = d3.scale.linear()
                          .domain([0, max])
                          .range([height, 0]);

  var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(bars)
                    .tickFormat(function(d, i){
                      return (d.Club)
                    });

  var yAxis = d3.svg.axis()
                    .scale(axisScale)
                    .orient("left")
                    .ticks(7)

  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-20, 0])
    .html(function(d,i) {
      return "<strong>" + d.Club + ": </strong><span style='color:blue'>" + "$" + d.Average_salary + "</span>";
    })

  var svg = d3.select("body")
              .append("svg")
              .attr("width", width + (2 * margin.width))
              .attr("height", height + (2 * margin.height));

  svg.call(tip)

  svg.selectAll("rect")
     .data(salData)
     .enter()
     .append("rect")
     .attr("class", "bar")
     .attr("x", function(d, i) {
       return (i * (width / bars)) + margin.width;
     })
     .attr("width", width / bars - barPadding)
     .attr("y", function(d) {
       return (height + margin.height - yScale(d.Average_salary));
     })
     .attr("height", function(d) {
       return yScale(d.Average_salary);
     })
     .attr("fill", "red")
     .on("mouseover", tip.show)
     .on('mouseout', tip.hide)

     svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height + margin.height) + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end");

   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + margin.width + "," + margin.height + ")")
      .call(yAxis)

   svg.append("text")
      .attr("x", (width / 2) + margin.width)
      .attr("y", margin.height + height + (0.75 * margin.height))
      .style("text-anchor", "middle")
      .text("Soccer club");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", - (height / 2) - margin.height)
      .attr("y", 0)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Average salary per soccer club");
});

let title = d3.select("body")
              .append("h3")
              .text("Average salary per soccer club in the MLS in 2017")

let tabTitle = d3.select("head").append("title")
              .text("Simon's bar chart");

let descrWidth = 0.30 * window.innerWidth;

let description = d3.select("body").append("div")
                    .style("width", descrWidth + "px")
                    .text("This is a bar chart overview containing the average \
                            salary per soccer club in the MLS in 2017. The data \
                            contained two players who were without a club. They \
                            are incorperated under the clubless label. Also \
                            there was club, LAFC, which contained only two players \
                            thus making it a somewhat unreliable average.");

let persInfo = d3.select("body")
                 .append("h3")
                 .text("Simon Kemmere - 17098250");
            
