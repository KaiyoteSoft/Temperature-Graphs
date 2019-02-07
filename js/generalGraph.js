	// Bottom temperature graph of Naples
function createMargins(){
	var margin = { left:80, right:20, top:80, bottom:100 };

	var width = 900 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;

	var g = d3.select("#allChart")
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
	// y.domain([0, d3.max(data, function(d){ return d.Temp; })])
	y.domain([10, 23])

	var dataFill = d3.scaleLinear()
		.range(["#fef0d9", "#fc8d59", "#b30000"]);
		// .range(["blue", "green"])

	var xAxisGroup = g.append("g")
			.attr("class", "x axis-label")
			.attr("transform", "translate(0,"+height+")")


	var yAxisGroup = g.append("g")
			.attr("class", "y axis-label")

	var yAxisCall = d3.axisLeft(y)
		// .ticks(5)
		.tickFormat(10,12,14,16,18,20,22)
		.tickFormat(function(d){
			return d + "°C"
		});

	//X axis label for month
	var xAxisTitle = g.append("text")
		.attr("class", "x axis-label")
		.attr("x", width/2)
		.attr("y", height+40)
		.attr("text-anchor", "middle")
		.attr("font-size", "20px")
		// .text("Years");

	//Y axis label for the temperature
	var yAxisTitle = g.append("text")
		.attr("class", "y axis-label")
		.attr("transform", "rotate(-90)")
		.attr("text-anchor", "middle")
		.attr("x", -(height/2))
		.attr("y", -50)
		.attr("font-size", "20px")
		// .text("Temperature (°C)");

	//Title of the graph
	var title = g.append("text")
		.attr("class", "x axis-label")
		.attr("x", width/2)
		.attr("y", -30)
		.attr("text-anchor", "middle")
		.attr("font-size", "40px")
		.text("Loading... Please wait")


	loadData(title, yAxisGroup, yAxisCall, xAxisGroup, dataFill, y, x, x2, g, width, height, xAxisTitle, yAxisTitle)

};

function loadData(title, yAxisGroup, yAxisCall, xAxisGroup, dataFill, y, x, x2, g, width, height, xAxisTitle, yAxisTitle) {
	// LOADING THE DATA
	d3.csv("NAPL_bottomTemperature/2018/NAPL_2010_2018.csv").then(function(data){
	    data.forEach(function(i){
	        i.Temp = +i.Temp        
	        i.Time = parseInt(i.Time)
	    })
	    const formattedData = data.filter(function(d) {
	    	return d.Time == 2011;
	    })
	    const reducedData = formattedData.filter(function(d){
	    	return d.Month == 1;
	    })

		updateData(data, title, yAxisGroup, yAxisCall, xAxisGroup, dataFill, y, x, x2, g, width, height, xAxisTitle, yAxisTitle);
	})

	function updateData(data, title, yAxisGroup, yAxisCall, xAxisGroup, dataFill, y, x, x2, g, width, height, xAxisTitle, yAxisTitle){
	//Updating the domains for the different axis
		dataFill.domain([0, d3.max(data, function(d){ return d.Temp; })])
		x2.domain(data.map(function(d){
			return d.generalDay;
		}))
		x.domain(data.map(function(d){
			return d.Time;
		}))
		xAxisTitle.text("Years")
		yAxisTitle.text("Temperature (°C)")
		title.text("Naples Bottom Temperature: All Years");

		var xAxisCall = d3.axisBottom(x);

	// //Calling the axis 
		yAxisGroup.call(yAxisCall)
		xAxisGroup.call(xAxisCall)

		var rects = g.selectAll("rect")
			.data(data, function(d){
				return d.generalDay;
			});

		rects.enter()
			.append("rect")
				.attr("fill", function(d){
					return dataFill(d.Temp);
				})
				.attr("y", y(0))
				.attr("height", 0)
				.attr("width", x2.bandwidth)
				.attr("x", function(d){ return x2(d.generalDay); })
				.merge(rects)
					.attr("y", function(d){ return y(d.Temp); })
		// Note that the x position of the rectangle makes use of x2 (the data axis)
					.attr("x", function(d, i){ return x2(d.generalDay); })
					.attr("width", x2.bandwidth)
					.attr("height", function(d){ return  height - y(d.Temp); });
	}
}