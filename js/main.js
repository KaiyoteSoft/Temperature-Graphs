// Bottom temperature graph of Naples
var margin = { left:80, right:20, top:50, bottom:100 };

var width = 900 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var g = d3.select("#chart-area")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Scale for label axis, only includes months
var x = d3.scaleBand()
	.range([0,width])
	.paddingInner(0.2);

// Scale for data axis. Includes every day
var x2 = d3.scaleBand()
	.range([0,width])
	.paddingInner(0.1);

var y = d3.scaleLinear()
	.range([height, 0]);

var xAxisGroup = g.append("g")
		.attr("class", "x axis-label")
		.attr("transform", "translate(0,"+height+")")


var yAxisGroup = g.append("g")
		.attr("class", "y axis-label")

//X axis label for month
g.append("text")
	.attr("class", "x axis-label")
	.attr("x", width/2)
	.attr("y", height+40)
	.attr("text-anchor", "middle")
	.attr("font-size", "20px")
	.text("Month");

//Y axis label for the temperature
g.append("text")
	.attr("class", "y axis-label")
	.attr("transform", "rotate(-90)")
	.attr("text-anchor", "middle")
	.attr("x", -(height/2))
	.attr("y", -50)
	.attr("font-size", "20px")
	.text("Temperature (°C)");

//Title of the graph
var title = g.append("text")
	.attr("class", "x axis-label")
	.attr("x", width/2)
	.attr("y", 0)
	.attr("text-anchor", "middle")
	.attr("font-size", "40px")

var year = 2010;
var t = d3.transition().duration(3000)

// LOADING THE DATA
d3.csv("NAPL_bottomTemperature/2018/NAPL_2010_2018.csv").then(function(data){
    data.forEach(function(i){
        i.Temp = +i.Temp        
        i.Time = parseInt(i.Time)
    })
    const formattedData = data.filter(function(d) {
    	return d.Time == year;
    })
    console.log(formattedData)

	d3.interval(function(){
		// year = (year<2015) ? year+8 : year-8
		 if (year < 2018) {
		 	year = year + 8;
			console.log(year)
		 }	
		 else {
		 	year = 2010
		 	console.log(year)
		 }
	    const formattedData = data.filter(function(d) {
	    	return d.Time == year;
	    })
	    	console.log(formattedData)


		update(formattedData)
	}, 5000)

	update(formattedData);
})

function update(data){
//Updating the domains for the different axis
    console.log(data)
	x2.domain(data.map(function(d){
		return d.generalDay;
	}))
	y.domain([0, d3.max(data, function(d){ return d.Temp; })])
	x.domain(data.map(function(d){
		return d.Month;
	}))
	title.text("Naples Bottom Temperature "+data[0].Time);

	var xAxisCall = d3.axisBottom(x);
	var yAxisCall = d3.axisLeft(y)
		.ticks(5)
		.tickFormat(function(d){
			return d + "°C"
		});
//Calling the axis 
	yAxisGroup.transition(t).call(yAxisCall)
	xAxisGroup.transition(t).call(xAxisCall)

	var rects = g.selectAll("rect")
		.data(data, function(d){
			return d.generalDay;
		});

    // EXIT old elements not present in new data.
    rects.exit()
        // .attr("fill", "red")
    .transition(t)
        .attr("y", y(0))
        .attr("height", 0)
        .remove();

	rects.enter()
		.append("rect")
			.attr("fill", "blue")
			.attr("y", y(0))
			.attr("height", 0)
			.attr("width", x2.bandwidth)
			.attr("x", function(d){ return x2(d.generalDay); })
			.merge(rects)
			.transition(t)
				.attr("y", function(d){ return y(d.Temp); })
	// Note that the x position of the rectangle makes use of x2 (the data axis)
				.attr("x", function(d, i){ return x2(d.generalDay); })
				.attr("width", x2.bandwidth)
				.attr("height", function(d){ return  height - y(d.Temp); });
}