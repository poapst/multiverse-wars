
var Map = {
    _xScale: null,
    _yScale: null
};
Map.getMinCoord = function(dimensionSize) {
    return -(dimensionSize / 2);
};
Map.mapData = function(containerSelector, dataGroupName, dataDrawFunction, dataX, dataY, dataWidth, dataHeight, svgWidth, svgHeight) {
    var svg = d3.select(containerSelector + " svg");
    if(svg.empty()) {
        svg = d3.select(containerSelector).append("svg").attr("width", svgWidth).attr("height", svgHeight);
        svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .attr("fill", "black");
    }
    if(dataX !== undefined && dataWidth && svgWidth) {
        Map._xScale = d3.scale.linear().domain([dataX, dataX + dataWidth]).range([0, svgWidth]).clamp(true);
    }
    if(dataY !== undefined && dataHeight && svgHeight) {
        Map._yScale = d3.scale.linear().domain([dataY, dataY + dataHeight]).range([svgHeight, 0]).clamp(true);
    }
    var canvas = svg.select("." + dataGroupName);
    if(canvas.empty()) {
        canvas = svg.append("g").attr("class", dataGroupName);
    }
    dataDrawFunction(canvas, Map._xScale, Map._yScale);
};

