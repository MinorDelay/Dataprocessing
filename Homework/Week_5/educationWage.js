/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Dataprocessing
* Assignment: week 5, draw a linked graphs using d3 and if needed/wanted other libraries
*/

window.onload = function() {

  // queue for loading data
  d3.queue()
    .defer(d3.json, "avgWage16.json")
    .defer(d3.json, "adultEdu16new.json")
    .defer(d3.json, "map.topojson")
    .await(createMap);

  // margins, height, width and padding
  var margin = {height: 75, width: 75}
  var h = 450
  var w = 450
  var barPadding = 5;

  // function to make the world map
  function createMap(error, avgWage16, adultEdu16, map) {
    if (error) throw error;

    // dictionaries and list for tooltip map
    var maxWage = [];
    var myCountries = [];
    var avgWage = {};

    // select wages from countries for seperate list
    avgWage16.forEach(function (d) {
      maxWage.push(d.Value)
    });

    // select countries for seperate list
    avgWage16.forEach(function (d) {
      myCountries.push(d["LOCATION"])
    })

    // link country and wage to dictionary
    avgWage16.forEach(function(d) {
      avgWage[d.LOCATION] = +d.Value;
    });

    // get all countries from worldmap
    var countries = topojson.feature(map, map.objects.countries1).features

    // svg for map
    var svg = d3.select("#map")
                .append("svg")
                .attr("id", "chart")
                .attr("height", h + 2 * margin.height)
                .attr("width", w + 2* margin.width)
                .append("g")
                .attr("transform", "translate(" + margin.width + "," + margin.height + ")")

    // projection for map
    var projection = d3.geoMercator()
                       .center([8,58])
                       .translate([w / 2, h / 2])
                       .scale([w])

    // determine path for map
    var path = d3.geoPath()
                 .projection(projection)

   // create tooltip that returns a label for selected country
   var mapTip = d3.tip()
               .attr("class", "map-tip")
               .offset([-20, 0])
               .html(function(d) {
                 var location = function (d){ if (myCountries.includes(d.properties.name)){
                                var a = myCountries.indexOf(d.properties.name)
                                return myCountries[a];
                              }}
                 var wage = function (d){ if (myCountries.includes(d.properties.name)){
                                var a = myCountries.indexOf(d.properties.name)
                                return maxWage[a];
                              }}
                              return "The average wage in " + location(d) + " is: $" + wage(d);
               });

  // call tip function
  svg.call(mapTip);

   // color settings for countries and legend
   var color = d3.scaleThreshold()
                 .domain([21711,
                          27711,
                          33711,
                          39711,
                          45711,
                          51711,
                          57711,
                          62636])
                .range(["#005832", "#006932", "#008232", "#009A32", "#00B332",
                        "#00CB32", "#00E432", "#00FF32"])

    // drawing countries and select tooltip
    svg.selectAll(".countries")
       .data(countries)
       .enter()
       .append("path")
       .attr("class", "countries")
       .attr("d", path)
       .style("fill", function(d) {
         if (myCountries.includes(d.properties.name)){
           var a = myCountries.indexOf(d.properties.name)
           return "rgba(0," + ((maxWage[a] / d3.max(maxWage)) * 255)+ ", 50, 0.6)"
         }
         else {
           return "lightgrey";
         }
       })
       .on("mouseover", mapTip.show)
       .on("mouseout", mapTip.hide)
       .on("click", swapData)

    // svg for barchart
    var barChart = d3.select("#bar")
                     .append("svg")
                     .attr("id", "bar")
                     .attr("width", w + (2 * margin.width))
                     .attr("height", h + (2 * margin.height))
                     .append("g")
                     .attr("transform", "translate(" + margin.width + "," + margin.height + ")");

   // create tip for barchart
   var barTip = d3.tip()
               .attr("class", "bar-tip")
               .attr("opacity", 0.5)
               .offset([-20, 0])
               .html(function(d) {
                 return (d) + "% of 25-64 year-olds for this gender has completed a tertiary education";
               });

    // call tip for bar
    barChart.call(barTip)

    // x scale for bar chart
    var xScale = d3.scaleBand()
                   .domain(["Total", "Men", "Women"])
                   .rangeRound([0, w]);

    // y scale for bar chart
    var yScale = d3.scaleLinear()
                   .range([h, 0])
                   .domain([0, 50.80])

    // add the x Axis
    barChart.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + h + ")")
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("x", w/2)
            .attr("dy", "3em")
            .style("tex-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "black")
            .text("Tertiary education per gender");

    // add the y Axis
    barChart.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(yScale))
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", - (0.5 * margin.width))
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .style("font-size", "14px")
            .style("fill", "black")
            .text("25-64 year-olds who have completed a tertiary education (%)");

    // drawing bars of bar chart
    barChart.selectAll(".bars")
            .data(adultEdu16[0]["Austria"])
            .enter()
            .append("rect")
            .attr("class", "bars")
            .attr("width", xScale.bandwidth() - barPadding)
            .attr("height", function(d) {return h - yScale(d)})
            .attr("x", function(d, i) {
              return i * (xScale.bandwidth()) + barPadding;
            })
            .attr("y", function(d) {return yScale(d)})
            .style("fill", "blue")
            .on("mouseover", barTip.show)
            .on("mouseout", barTip.hide)


    // change data in bar chart, changes when clicked on country
    function swapData(d) {
      barChart.selectAll(".bars")
              .remove()
      barChart.selectAll(".bars")
              .data(adultEdu16[0][d.properties.name])
              .enter()
              .append("rect")
              .attr("class", "bars")
              .attr("width", xScale.bandwidth() - barPadding)
              .attr("height", function(d) {return h -yScale(d)})
              .attr("x", function(d, i) {
                return i * (xScale.bandwidth()) + barPadding;
              })
              .attr("y", function(d) {return yScale(d)})
              .style("fill", "blue")
              .on("mouseover", barTip.show)
              .on("mouseout", barTip.hide)
    }

    // legend function
    function Legend() {

      // drawing svg for legend
      var legendSvg = d3.select("#legend")
                        .append("svg")
                        .attr("id", "legend-svg")
                        .attr("height", margin.height)
                        .attr("width", 1.5 * w)
                        .append("g")
                        .attr("transform", "translate(" + 0.5 * margin.width + ",0)")
                        .attr("id", "legend-id")

      // x scale for legend
      var xScaleLegend = d3.scaleLinear()
                      .domain([d3.min(maxWage), d3.max(maxWage)])
                      .range([1, w + 2 * margin.width])

      // call x-axis legend
      var xAxisLegend = d3.axisBottom(xScaleLegend)
                          .tickSize(7)
                          .tickValues(color.domain())

      var legend = d3.select("#legend-id")
                     .call(xAxisLegend)

      // drawing of the mini bars of the legend
      legend.selectAll("rect")
               .data(color.range().map(function(d) {
                 var a = color.invertExtent(d)
                 if (a[0] == null) a[0] = xScaleLegend.domain()[0];
                 if (a[1] == null) a[1] = xScaleLegend.domain()[1];
                 return a;
               }))
               .enter()
               .insert("rect", "tick")
               .attr("height", 8)
               .attr("width", function(d) { return xScaleLegend(d[1]) - xScaleLegend(d[0]); })
               .attr("x", function(d) { return xScaleLegend(d[0]); })
               .attr("fill", function(d) { return color(d[0]); })

        // text of legend
        legend.append("text")
                  .attr("id", "legend-text")
                  .attr("text-anchor", "end")
                  .attr("font-size", "14px")
                  .attr("fill", "black")
                  .attr("x", 150)
                  .attr("y", 35)
                  .text("Height of average wage")
    }

    // call legend
    Legend();
  }
}
