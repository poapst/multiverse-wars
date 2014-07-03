/**
 * Created by Andi on 2014-06-01.
 */
//= require random

function createPlanet(seed, threshold, x, y) {
    var coordValue = getRandomFrom2DCoordinate(seed, x, y);
    if(coordValue < threshold) {
        var radius = 10;
        return {x: x, y: y, r: radius};
    }
    return false;
}

function createPlanets(seed, threshold, curData, minX, minY, width, height) {
    for(var x = minX; x < width + minX; x++) {
        for(var y = minY; y < height + minY; y++) {
            var potentialStar = createPlanet(seed, threshold, x, y);
            if(potentialStar) {
                curData.push(potentialStar);
            }
        }
    }
    return curData;
}

function drawPlanets(canvas, xScale, yScale, planetData, clickFunction) {
    var addedPlanetElements = canvas.selectAll("circle").data(planetData).enter();
    addedPlanetElements.append("circle")
        .attr("cx", function(d) {return xScale(d.x);})
        .attr("cy", function(d) {return yScale(d.y);})
        .attr("r", function(d) {return d.r;})
        .attr("fill", "white")
        .on("click", function(d) {clickFunction(d);});
}
