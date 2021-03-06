function drawStats(data, chartSettings) {
    chartSettings = chartSettings || {
        container: '#my_dataviz',
        margin: { top: 30, right: 30, bottom: 70, left: 60 },
        width: 460,
        height: 400,
        barColor: "#69b3a2",
        xValueSelector: d => d.quantityOfSentences,
        yValueSelector: d => d.percent,
    };

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

function getTextAreaSentences(textarea, isSpam) {
    var text = $(textarea).val();
    var sentences = text
        .split("\n")
        .map(s => new Sentence(s.trim(), isSpam));
    return sentences;
}

function showMessageIsSpamResult(output, sentence) {
    output = $(output);

    output.addClass(sentence.isSpam ? 'text-warning' : 'text-success');
    output.removeClass(!sentence.isSpam ? 'text-warning' : 'text-success');
    var prefix = sentence.isSpam ? '(SPAM) ' : '';
    output.text(prefix + sentence.string);
}

function showProcessedMessages(processedSentences, outputTextArea) {
    var text = processedSentences
        .map(s => (s.isSpam ? '(SPAM) ' : '') + s.string)
        .join('\n');
    outputTextArea.val(text);
}