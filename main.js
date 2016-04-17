function plotData(xy_data, x_prop, y_prop, initialize) {	
  var margin = {top: 20, right: 20, bottom: 40, left: 50},
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // setup x
  var xValue = function(d) { return d[0];}, // data -> value
      xMin = d3.min(xy_data, xValue),
      xMax = d3.max(xy_data, xValue),
      xRange = xMax - xMin,
      xScale = d3.scale.linear().domain([xMin - xRange * 0.05, xMax + xRange * 0.05]).range([0, width]), // value -> display
      xMap = function(d) { return xScale(xValue(d)) + margin.left;}, // data -> display
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y
  var yValue = function(d) { return d[1];}, // data -> value
      yMin = d3.min(xy_data, yValue),
      yMax = d3.max(xy_data, yValue),
      yRange = yMax - yMin,
      yScale = d3.scale.linear().domain([yMin - yRange * 0.05, yMax + yRange * 0.05]).range([height, 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d)) + margin.top;}, // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("left");

  if (initialize) {
    // add the graph canvas to the body of the webpage
    var svg = d3.select("#plot")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
    // x-axis
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(x_prop);

    // y-axis
    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(y_prop);

    // add the tooltip area to the webpage
    d3.select("#hovered").append("div").attr("class", "tooltip").style("opacity", 0);
  } else {
    var svg = d3.select("#plot");
    var tooltip = d3.select("#hovered")

    // modify x-axis
    svg.select(".x-axis").call(xAxis);
    svg.select(".x-axis .label").text(x_prop);

    // modify y-axis
    svg.select(".y-axis").call(yAxis);
    svg.select(".y-axis .label").text(y_prop);

    // draw dots
    svg.selectAll(".dot").remove();
    svg.selectAll(".dot")
       .data(xy_data)
       .enter().append("circle")
       .attr("class", "dot")
       .attr("r", 3.5)
       .attr("cx", xMap)
       .attr("cy", yMap)
       .on("mouseover", function(d) {
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(d[2] + " (" + d[0] + "," + d[1] + ")");
        })
       .on("mouseout", function(d) {
          tooltip.transition().duration(500).style("opacity", 0);
        });
  }
}

function addListeners(data, x_prop, y_prop) {
  $("#update").on('click', function() {
     var xy = [];
     var x_prop = $( "#sel-x option:selected" ).val();
     var y_prop = $( "#sel-y option:selected" ).val();
     var min_val = +$("#mpg-min").val()
     var max_val = +$("#mpg-max").val()
     for (var i in data) {
       if (min_val <= +data[i]['mpg'] && +data[i]['mpg'] <= max_val) {
         xy.push([+data[i][x_prop], +data[i][y_prop], data[i]['name']]);
       }
     }
     plotData(xy, x_prop, y_prop, false);
  });
}

$( document ).ready(function() {
  d3.csv("car.csv", function(data) {
    var numeric_properties = [];
    for (var prop in data[0]) {
      if (!isNaN(data[0][prop])) {
        numeric_properties.push(prop);
      }
    }
    var select = $("#sel-x, #sel-y")
    for (var i in numeric_properties) {
      $('<option></option>')
        .val(numeric_properties[i])
        .text(numeric_properties[i])
        .appendTo(select);
    }
    plotData([], "mpg", "mpg", true);
    addListeners(data);
  });
});
