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

// LOADING THE DATA
d3.csv("NAPL_bottomTemperature/2018/NAP_1_V2.csv").then(function(data){
    data.forEach(function(i){
        i.Temp = +i.Temp        
    })
    console.log(data);

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
g.append("text")
	.attr("class", "x axis-label")
	.attr("x", width/2)
	.attr("y", 0)
	.attr("text-anchor", "middle")
	.attr("font-size", "40px")
	.text("Naples Bottom Temperature 2018");

// Scale for label axis, only includes months
    var x = d3.scaleBand()
		.domain(data.map(function(d){
			return d.Month;
		}))
    	.range([0,width])
    	.paddingInner(0.2);

// Scale for data axis. Includes every day
    var x2 = d3.scaleBand()
    	.domain(data.map(function(d){
    		return d.generalDay;
    	}))
    	.range([0,width])
    	.paddingInner(0.1);

    var y = d3.scaleLinear()
    	.domain([0, d3.max(data, function(d){ return d.Temp; })])
    	.range([height, 0]);


	var xAxisCall = d3.axisBottom(x)
		// .ticks(5);
		g.append("g")
			.attr("class", "x axis-label")
			.attr("transform", "translate(0,"+height+")")
			.call(xAxisCall)


	var yAxisCall = d3.axisLeft(y)
		.ticks(5)
		.tickFormat(function(d){
			return d + "°C"
		})
		g.append("g")
			.attr("class", "y axis-label")
			.call(yAxisCall);

	var rects = g.selectAll("rect")
		.data(data)
	rects.enter()
		.append("rect")
			.attr("y", function(d){
				return y(d.Temp);
			})
// Note that the x position of the rectangle makes use of x2 (the data axis)
			.attr("x", function(d, i){
				return x2(d.generalDay);
			})
			.attr("width", x2.bandwidth)
			.attr("height", function(d){
				return  height - y(d.Temp);
			})
			.attr("fill", function(d){
				return "blue";
			})

})