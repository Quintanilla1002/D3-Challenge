var svgWidth = 900;
var svgHeight = 650;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
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

//Import Data
d3.csv("assets/data/data.csv").then(function(stateData) {
    //Parse Data
    stateData.forEach(function(data){
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    })
    console.log(stateData);

    //Scale functions
    var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(stateData, d => d.poverty)+2])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([3, d3.max(stateData, d => d.healthcare)+1])
    .range([height, 0]);

    //Axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append Axes to chart
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    //Create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("opacity", "1");


    //State abbrev
    var stateAbbrev= chartGroup.selectAll("text")
    .data(stateData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d => d.abbr);
    

    //Tooltip
    //Initialize
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([25, -30])
    .html(function(d) {
      return (`${d.state}<br>In Poverty: ${d.poverty}%<br> Lacks Healthcare ${d.healthcare}%`);
    });

    //Create
    chartGroup.call(toolTip);

    //Event Listener
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

    // Create axes labels
      chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");
  
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
    }).catch(function(error) {
      console.log(error);
    
});



