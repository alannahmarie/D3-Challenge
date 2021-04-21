var svgWidth = 1000;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 50,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data

d3.csv("assets/data/data.csv").then(function(censusData) {

    // Parse Data/Cast as numbers

    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.obesity = +data.obesity;
    });

    // Create scale functions

    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.obesity)])
      .range([height, 0]);

    // Create axis functions

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles

    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("class", "stateCircle")

    // Append state abbreviations to circles

    var abbreviations = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .text(d => d.abbr)
    .attr("class", "stateText");

    console.log(censusData.abbr)

    // Create axes labels

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity %");


    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty %)");
  }).catch(error =>
    console.log(error));


      // Initialize tool tip

      var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Poverty %: ${d.poverty}<br>Obesity %: ${d.obesity}`);
      });

    // Create tooltip in the chart

    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip

    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
