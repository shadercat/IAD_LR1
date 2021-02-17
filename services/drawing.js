function drawStats(data, chartSettings) {
    var margin = chartSettings.margin;
    var axisWidth = chartSettings.width - margin.left - margin.right;
    var axisHeight = chartSettings.height - margin.top - margin.bottom;
    var xValueSelector = chartSettings.xValueSelector;
    var yValueSelector = chartSettings.yValueSelector;

    var svg = d3.select(chartSettings.container)
        .append("svg")
        .attr("width", chartSettings.width)
        .attr("height", chartSettings.height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .range([0, axisWidth])
        .domain(data.map(xValueSelector))
        .padding(0.2);

    svg.append("g")
        .attr("transform", "translate(0," + axisHeight + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([axisHeight, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(xValueSelector(d)))
        .attr("y", d => y(yValueSelector(d)))
        .attr("width", x.bandwidth())
        .attr("height", d => axisHeight - y(yValueSelector(d)))
        .attr("fill", chartSettings.barColor)
}