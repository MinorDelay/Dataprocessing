/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Dataprocessing
* Assignment: week 4, draw a scatterplot using d3 and if needed/wanted other libraries
*/

// loads functions when webpage loads
window.onload = function() {

  loadingPage();

};

function loadingPage() {

  // store api's in variables
  var totMobileSource = "https://stats.oecd.org/SDMX-JSON/data/AIR_EMISSIONS/AUS+BEL+DNK+FIN+FRA+DEU+ITA+NLD+NOR+PRT+ESP+GBR.CO.MOB_TOT/all?startTime=2011&endTime=2012&dimensionAtObservation=allDimensions"
  var totHumanEmission = "https://stats.oecd.org/SDMX-JSON/data/AIR_EMISSIONS/AUS+BEL+DNK+FIN+FRA+DEU+ITA+NLD+NOR+PRT+ESP+GBR.CO.TOT/all?startTime=2011&endTime=2012&dimensionAtObservation=allDimensions"

  // load each variable
  d3.queue()
    .defer(d3.request, totMobileSource)
    .defer(d3.request, totHumanEmission)
    .awaitAll(transformAPI);

  function transformAPI(error, response) {
    if (error) throw error;

  // use response
  totMobileSource = JSON.parse(response[0].responseText)
  totHumanEmission = JSON.parse(response[1].responseText)

  // extract countries and years from data
  var countries = totMobileSource.structure.dimensions.observation[0].values
  var years = totMobileSource.structure.dimensions.observation[3].values

    // make lists and variables to store future data
  var showYear = years
  var extractMobile = []
  var extractEmission = []
  var arrayDict = []
  var count = 0
  var maxEM = []
  var maxEE = []
  var countryList = []


  // loop over number of countries
  for (var i = 0; i < countries.length; i++){
    var yearlyEM = []
    var yearlyEE = []

    // push data per country per year to list
    for (var j = 0; j < years.length; j++){
      yearlyEM.push(totMobileSource.dataSets[0].observations[i + ":0:0:" + j][0]);
      yearlyEE.push(totHumanEmission.dataSets[0].observations[i + ":0:0:" + j][0]);
    };

    // push each list to a new list
    extractMobile.push(yearlyEM)
    extractEmission.push(yearlyEE)

    // keep track of number of years
    if (count == 2){
      count == 0;
    }

    // store names of countries
    countryList.push(countries[i]["name"])

    // put relevant info in a dictionary
    var infoDict = {
      "Country": countries[i]["name"],
      "2011Mob": extractMobile[count][0],
      "2011Em": extractEmission[count][0],
      "2012Mob": extractMobile[count][1],
      "2012Em": extractEmission[count][1],
      "2013Mob": extractMobile[count][2],
      "2013Em": extractEmission[count][2],
      "2014Mob": extractMobile[count][3],
      "2014Em": extractEmission[count][3],
      "2015Mob": extractMobile[count][4],
      "2015Em": extractEmission[count][4]
    }

    //update counter
    count++

    // push dict to list
    arrayDict.push(infoDict)

    // determine max values per year and push to list
    maxEM.push(Math.max.apply(Math,yearlyEM))
    maxEE.push(Math.max.apply(Math,yearlyEE))
  };

  // set scatter.html to 2011
  var selected = "2011"

  // make space for source reference
  var data = d3.select("body")
               .append("p")
               .attr("class", "link")
               .html("<a href='http://stats.oecd.org/index.aspx?r=528977#'>Source</a>");

  // make title of graph variable
  var title = d3.select("body")
                .append("h1")
                .attr("class", "title")
                .text(function(d,i){
                  if (selected == showYear[i]["name"]){
                    title = "The relation between the total mobile emission and total human emission in " + showYear[i]["name"] + "or 2012"
                  }
                    return title
                });

  // create svg canvas specifications
  var height = 700;
  var width = 1200;

  // create padding
  var margin = {"width" : 100, "height" : 100};

  // determine maxima
  var maxMobile = Math.max.apply(Math,maxEM)
  var maxEmission = Math.max.apply(Math,maxEE)

  // create svg canvas element containing width and height + margins
  var svg = d3.select("body")
              .append("svg")
              .attr("class", "graph")
              .attr("width", 1.5 * width)
              .attr("height", height + (2 * margin.height))
              .append("g")
              .attr("transform", "translate("+ margin.width + "," +  margin.height + ")");

  // create linear scale for y-axis
  var yScale = d3.scale.linear()
                       .domain([maxMobile, 0])
                       .range([0, height]);

  // create linear scale for x-axis
  var xScale = d3.scale.linear()
                       .domain([0, maxEmission])
                       .range([0, width]);

 // create y-axis function
 var yAxis = d3.svg.axis()
                   .scale(yScale)
                   .orient("left")
                   .ticks(20);

  // create x-axis function
  var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(15);

  // append y-axis
  svg.append("g")
     .attr("class", "axis")
     .call(yAxis);

  // append x-axis
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0," + (height) + ")")
     .call(xAxis)

  // create colorscheme via colorbrewer
  var color = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c",
  "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"]

 // create dot for every datapoint in the dataset
 svg.selectAll("circle")
    .data(arrayDict)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", function(d) {
      return xScale(d[selected + "Em"]);
    })
    .attr("cy", function(d) {
      return yScale(d[selected + "Mob"]);
    })
    .attr("r", 5)
    .style("fill", function(d,i){
      return color[i]
    });

  // append x-axis label
  svg.append("text")
     .attr("x", (width / 2) + margin.width)
     .attr("y", height + margin.height)
     .style("text-anchor", "middle")
     .text("Total human emission of CO in tonnes");

  // append y-axis label
  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", - (height / 2))
     .attr("y", -(margin.height))
     .attr("dy", "1em")
     .style("text-anchor", "middle")
     .text("Total mobile emission of CO in tonnes");

// add personal info
 d3.select("body")
   .append("p")
   .attr("class", "info")
   .text("Simon Kemmere - 10798250")

 // add info over graph
 d3.select("body")
   .append("p")
   .attr("class", "info")
   .text("This scatterplot shows the relation between the total human emission \
          of CO2 and the total mobile emission of CO.")

  // create legend
  var legend = svg.selectAll("legend")
                  .data(countryList)
                  .enter()
                  .append("g")
                  .attr("class", "legend")
                  .attr("transform", function(d,i) {
                    return "translate(" + width + "," + i * 20 + ")";
                  });

  // create color for legend
  legend.append("rect")
     .attr("x", 0)
     .attr("y", 0)
     .attr("width", 10)
     .attr("height", 10)
     .style("fill", function(d,i){
       return color[i]
     })

 // apply text in legend
 legend.append("text")
    .attr("x", (0.2 * margin.width))
    .attr("y", 0.1 * margin.height)
    .style("text-anchor", "begin")
    .style("font-size", "18px")
    .text(function(d){
      return d
    });

  // determine text for dropdown
  var selectYear = [ { "text" : "2011" },
                       { "text" : "2012" },
                   ]

  // Select year
  var span = d3.select("body")
               .append("span")
               .text('Select Year: ')

  // create variable that helps to change to next year
  var year2011 = d3.select("body")
              .append("select")
              .attr("id","year")
              .on("change",yearChange2012)
              .selectAll("option")
              .data(selectYear)
              .enter()
              .append("option")
              .text(function (d) { return d.text });

  // change to next years
  // title change doesn't work
  function yearChange2012() {
    var value = this.value
    d3.select("title")
      .text(function(d){
        title = "The relation between the total mobile emission and total human emission in 2012"
        return d.title
      })

    d3.selectAll('circle')
      .attr("cy",function (d) {
        return yScale(d["2012Mob"])
      })
      .attr("cx", function (d){
        return xScale(d["2012Em"])
      })
    };

  };
};
