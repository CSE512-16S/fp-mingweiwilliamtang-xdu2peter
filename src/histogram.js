function histogram(index){
var values = d3.range(1000).map(d3.random.bates(10));

// A formatter for counts.
var formatCount = d3.format(",.0f");

var margin = {top: 50, right: 30, bottom: 30, left: 30},
    width = 300- margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0,1])
	.range([0, width]);

// Generate a histogram using twenty uniformly-spaced bins.
var data = d3.layout.histogram()
    .bins(x.ticks(20))
    (values);

var y = d3.scale.linear()
 .domain([0, d3.max(data, function(d) { return d.y; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");


var yAxis = d3.svg.axis()
		.scale(y)
    .orient("left")

    var svg = d3.select("#new").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



var selection  = svg.selectAll(".bar")
    .data(data)
    .enter()
    var bar = selection.append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

bar.append("rect")
    .attr("x", 1)
    .attr("width", x(data[0].dx) - 1)
    .attr("height", function(d) { return height - y(d.y); })	    	 
    .on("mouseover",function(){
    d3.select(this).style("fill","red")
    })
    .on("mouseout",function(){
    d3.select(this).style("fill","steelblue")
    })
    .on("click",function(d){
    alert(d.y)
    })
/*    
bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", x(data[0].dx) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.y); });
*/

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
    
 svg.append("g").attr("class","y axis")
    .attr("transform","translate(," + height + "0)")
    .call(yAxis);

    var hline = locations[index]["QoQ"]*10;
    console.log(hline);
    var line = d3.svg.line()
     .x(function(d, i) {
	 
      return x(hline) })
    .y(function(d, i) { return height - y(d.y) ; }); 

 svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
selection.exit().remove();
}
