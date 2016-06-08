var sideInfo = {

	intSideInfo: function(index){
		containerId = "#slider";
		$(containerId + " svg").remove()
		//var zipcode = locations[index]["zip"];
        if(!d3.select(containerId).select("p")[0][0]){
            text = d3.select(containerId).append("p");
        }
	    this.displayText(index);
	    this.lineChart(locations[index]["zip"]);
	    this.histogram(index);
	},
// d3.select(containerId).select("p").remove();
	displayText: function(index){
	  var show =  "  "+locations[index]["city"] + ", WA, " + locations[index]["zip"];
	  console.log(show);
		containerId = "#slider";
	  document.getElementById("zip").innerHTML = show;

	    text.text("  The houseing price for this area has:").attr("font-size", "200px");
    this.printLine(text,"month",locations[index]["MoM"]);
    this.printLine(text,"quarter",locations[index]["QoQ"]);
	    this.printLine(text,"year",locations[index]["YoY"]);
        //text.append("p").text("Increased by "+roundToTwo(100 * locations[index]["QoQ"])+"% comparing to last quarter." );
	},

    printLine: function(curText,label,value){
        if (value < 0){
            value = -value;
            curText.append("p").text(" - Decreased by " + roundToTwo(100 * value) + "% compared with last " + label + "." );
        }
        else{
            curText.append("p").text(" - Increased by " + roundToTwo(100 * value) + "% compared with last " + label + "." );
        }
    },

	histogram: function(index) {
	var values = [];
	    for (var i = 0; i < locations.length; i ++){
		values.push(parseFloat(locations[i]["price"]));
	    }
	   // console.log(d3.max(values));
	// A formatter for counts.
	var formatCount = d3.format(",.0f");

	var margin = {top: 30, right: 30, bottom: 60, left: 60},
    width = 400- margin.left - margin.right,
    height = 280 - margin.top - margin.bottom;
	    var xmin = d3.min(values);
	    var xmax = d3.max(values)+10;
	var x = d3.scale.linear()
    	    .domain([xmin,xmax])
		.range([0, width]);

	// Generate a histogram using twenty uniformly-spaced bins.
	var data = d3.layout.histogram()
   		.bins(x.ticks(30))
    	(values);

	var y = d3.scale.linear()
 		.domain([0, d3.max(data, function(d) { return d.y; })])
    	.range([height, 0]);

	var xAxis = d3.svg.axis()
    	    .scale(x)
	    .ticks(10)
    	.orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
    	    .orient("left");

    var svg = d3.select("#slider").append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
  	.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");



	var bar = svg.selectAll(".bar")
    	    .data(data);

	 bar.enter().append("g")
    	.attr("class", "bar")
    	.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
	 .append("rect")
		.attr("x", 1)
    		.attr("width", x(data[0].dx+xmin) - 1)
    	.attr("height", function(d) { return height - y(d.y); })	    	 
    	.on("mouseover",function(){
    	d3.select(this).style("fill","red")
    	})
    	.on("mouseout",function(){
    	d3.select(this).style("fill","#ef8a62")
    	})
    		.on("click",function(d){
		    var str = "range " + d.x + "~" + (d.dx+d.x) + "\nThere are " + d.y + " zip code areas have median house price per Sq, Ft  within this range";
    	    alert(str);
    	})
	    bar.exit().remove();
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
		.style("fill","white")
    	.attr("transform", "translate(0," + height + ")")
    		.call(xAxis);
	    
	    svg.append("text")
		.attr("x", 200)
		.attr("y", 225)
   //   .attr("dx", ".71em")
      .style("text-anchor", "end")
      .text("Median Price")
		.style("fill","white")
		.style("stroke","white");
	    	    
	    svg.append("text")
		.attr("x", 300)
		.attr("y", 0)
   //   .attr("dx", ".71em")
      .style("text-anchor", "end")
      .text("Histogram of Median house price per Sq Ft")
		.style("fill","white")
		.style("stroke","white");

	       svg.append("text")
		.attr("x", 325)
		.attr("y", 180)
   //   .attr("dx", ".71em")
      .style("text-anchor", "end")
      .text("/Sq. Ft.")
		.style("fill","white");
	    
	    
	    
    
 	svg.append("g").attr("class","y axis")
    		.attr("transform","translate(," + height + "0)")
		.style("fill", "white")
    	.call(yAxis);

	    svg.append("text")
      .attr("transform", "rotate(-90)")
		.attr("y", -50)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency")
		.style("fill","white")


	    var hline = parseFloat(locations[index]["price"]);
    var line = d3.svg.line()
    	.x(function(d, i) { 
      	return x(hline) })
    	.y(function(d, i) { return height - y(d.y) ; }); 

 	svg.append("path")
      	.datum(data)
      	.attr("class", "line")
      	.attr("d", line);
	},

    lineChart: function(zip){
	var margin = {top: 30, right: 30, bottom: 50, left: 60},
        w = 400 - margin.left - margin.right,
        h =240 - margin.top - margin.bottom,
        x = d3.time.scale().range([0, w]),
    y = d3.scale.linear().range([ h,0]);
        parseDate = d3.time.format("%Y%m").parse;

    var color = d3.scale.category10(); // to generate a different color for each line
    
    // to be used later
    var countries,
        filtered,
        transpose;
    
    // where the line gets its properties, how it will be interpolated
var line = d3.svg.line()
    .interpolate("basis")
    .defined(function(d) { return !isNaN(d.stat); })
	.x(function(d) { return x(d.year); })
	.y(function(d) { return y(d.stat); });
    //    .defined(function(d) {return !isNaN(d.stat);} );
    
/*
var container2= d3.select("#new2").append("svg")
    .attr("width",w)
    .attr("height",h)
    .append("g")
    .attr('transform',"translate("+ 0 +","+ 0+")");
  //  .attr('transform', 'scale(1)');
*/
/*
	var zoom = d3.behavior.zoom()
    .x(x)
    .y(y)
    .on("zoom", zoomed);

function zoomed() {
    console.log(d3.event.translate);
    console.log(d3.event.scale);
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);
    svg.select(".line")
        .attr("class", "line")
        .attr("d",  function(d) {return line(d.values); });

}
*/
var svg =  d3.select("#slider").append("svg")
    .attr("width", w + margin.left + margin.right)
       .attr("height", h + margin.top + margin.bottom)
        .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //.Call(zoom);

	// axis function
	
var make_x_axis = function () {
    return d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(6);
};

var make_y_axis = function () {
    return d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5);
};

/*
svg.append("g")
    .attr("class", "x grid")
    .attr("transform", "translate(0," + h + ")")
    .call(make_x_axis()
    .tickSize(-h, 0, 0)
    .tickFormat(""));

svg.append("g")
    .attr("class", "y grid")
    .call(make_y_axis()
    .tickSize(-w, 0, 0)
    .tickFormat(""));
*/	
    // define the x axis and its class, append it to svg 



var xAxis = d3.svg.axis()
        .scale(x)
	.ticks(8)
.innerTickSize(-h)
    .outerTickSize(10)
    .tickPadding(6)
        .orient("bottom")

	svg.append("svg:g")
            .attr("class", "x.axis");


    // define the y axis and its class, append it to svg
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
	.ticks(8)
	.innerTickSize(-w)
	.outerTickSize(10)
    .tickPadding(8);

	svg.append("svg:g")
            .attr("class", "y axis")
	    .style("fill", "white");

        svg.append("g")
      .attr("class", "y axis")
    .append("text")
      .attr("transform", "rotate(-90)")
	    .attr("y", -50)
	.attr("x", -30)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Median Price.")
	    .style("fill","white")


   svg.append("g")
      .attr("class", "y axis")
    .append("text")
	    .attr("y", 0)
	.attr("x", 50)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("/Sq. Ft")
	    .style("fill","white")
/*
	
        svg.append("g")
	 .attr("class", "x axis")
	 .style("fill","white")
   .append("text")
      .attr("x",380)
     .attr("y",180)
   //   .attr("d7", ".71em")
	    .style("text-anchor", "end")
	    .style("fill","white")
      .text("date")
*/
	  svg.append("g")
	    .attr("class", "x axis")
	    .style("fill","white");
	 svg.append("text")
		.attr("x", 180)
		.attr("y", 200)
   //   .attr("dx", ".71em")
      .style("text-anchor", "end")
      .text("date")
		.style("fill","white")
		.style("stroke","white");

	    svg.append("text")
		.attr("x", 300)
		.attr("y", 0)
   //   .attr("dx", ".71em")
      .style("text-anchor", "end")
      .text("Line chart of housing price from 1996-2016")
		.style("fill","white")
		.style("stroke","white");
      
      
                
// put data from csv into countries variable
//run redraw function that will refresh whenever a new data series is selected 
d3.csv("dat/psqrft.csv", function(csv) {
    data = csv;
        redraw();
    });


// set terms of transition that will take place
// when a new economic indicator is chosen   

function redraw() {
  // console.log('sampleData ', data);
    // create data nests based on economic indicator (series)
    
    
    // get value from menu selection
    // the option values are set in HTML and correspond
    //to the [indicatorCode] value we used to nest the data  
    
    // only retrieve data from the selected series, using the nest we just created
    
    // for object constancy we will need to set "keys", one for each country.
    // the keyring variable contains only the names of the countries





    var keyring = d3.keys(data[0]).filter(function(key) { 
            return (key !== "zip");
        });

//      console.log('keyring', keyring.length);
    // get the year and related statistics, map them to each country separately 
    var transpose = data.map(function(d) {
	var Vs = [];
	for(var i = 0; i<keyring.length;i++){
	    Vs.push({year: parseDate(keyring[i]), stat: parseFloat(d[keyring[i]])});
	}
//	console.log("Vs",Vs);
	return {
              name: d.zip,
            values: Vs
	}
    });
    	transpose = transpose.filter(function(d){
	return d.name ==zip });
//transpose = transpose.filter

//    console.log(!isNaN(transpose[0]["values"][230]["stat"]));
    // set the x and y domains as the max and min
    // of the related year and statistics, respectively
    x.domain([
    d3.min(transpose, function(c) { return d3.min(c.values, function(v) { return v.year; }); }),
    d3.max(transpose, function(c) { return d3.max(c.values, function(v) { return v.year; }); })
  ]);

    y.domain([
	d3.min(transpose, function(c) { return d3.min(c.values, function(v) { return v.stat; }); }),
	d3.max(transpose, function(c) { return d3.max(c.values, function(v) { return v.stat; }); })
    ]);
  //  console.log(d3.min(transpose, function(c) { return d3.min(c.values, function(v) { return v.stat; }); }));
  //  console.log(d3.max(transpose, function(c) { return d3.max(c.values, function(v) { return v.stat; }); }));
    // announce to d3 that we will be using something called
    // "country" that makes use of the transposed data 



    var country = svg.selectAll(".zip")
      .data(transpose);
     

    // create separate groups for each country
    // assign them a class and individual IDs (for styling) 
    var countryEnter = country.enter().append("g")
      .attr("class", "zip")
      .attr("id", function(d) { return d.name; });

//    console.log('sampleData ', sampleData);

    // draw the lines and color them according to their names
    countryEnter.append("path")
      .attr("class", "line")
	.attr("d", function(d) {return line(d.values); })
	.style("stroke","#ef8a62")
	       //function(d) { return color(d.name); })
	.style("stroke-width",4)
      .style("opacity",function(d) {
        //console.log('opac: ', sampleData[d.name].opacity);
        return 1 });



    // create lables for each country
    // set their position to that of the last year and stat
/*
    countryEnter.append("text")
     .attr("class", "names")
     .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
     .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.stat) + ")"; })
     .attr("x", 4)
     .attr("dy", ".35em")
     .text(function(d) { return d.name; })
	.style("font-size","15px")
	.style("fill","white");
*/
    // set variable for updating visualization
    var countryUpdate = d3.transition(country);
    
    // change values of path to those of the new series
    countryUpdate.select("path")
      .attr("d", function(d) { return line(d.values); });
    
    // change position of text alongside the moving path  
    countryUpdate.select("text")
	.attr("transform", function(d) { return "translate(" + x(d.values[d.values.length - 10].year) + "," + y(d.values[d.values.length - 1].stat) + ")"; })
        .style("font-size","15px");
    
  // update the axes, though only the y axis will change    
      d3.transition(svg).select(".y.axis")
          .call(yAxis);   
          
      d3.transition(svg).select(".x.axis")
            .attr("transform", "translate(0," + h+ ")")
        .call(xAxis);

    
// that concludes redraw()
}
    }  
}
