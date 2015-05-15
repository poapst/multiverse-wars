/**
 * Created by Andi on 2014-06-01.
 */
//= require random

var Planet = {};
Planet.create = function(seed, threshold, x, y, radius) {
    var coordValue = RandomLibrary.getRandomFrom2DCoordinate(seed, x, y);
    if(coordValue < threshold) {
        return {
            x: x,
            y: y,
            r: radius,
            unit: null
        };
    }
    return false;
};
Planet.addUnit = function(planet, unit) {
    planet.unit = unit;
};

var Planets = {};
Planets.add = function(planets, seed, threshold, x, y, radius) {
    var potentialPlanet = Planet.create(seed, threshold, x, y, radius);
    if(potentialPlanet) {
        planets.push(potentialPlanet);
    }
};
Planets.addManyInArea = function(planets, seed, threshold, minX, minY, width, height, radius) {
    for(var x = minX; x < width + minX; x++) {
        for(var y = minY; y < height + minY; y++) {
            Planets.add(planets, seed, threshold, x, y, radius);
        }
    }
    return planets;
};
Planets.draw = function(planets, canvas, xScale, yScale, clickFunction) {
    var addedPlanetElements = canvas.selectAll("circle").data(planets).enter();
    addedPlanetElements.append("circle")
        .attr("cx", function(d) {return xScale(d.x);})
        .attr("cy", function(d) {return yScale(d.y);})
        .attr("r", function(d) {return d.r;})
        .attr("fill", "white")
        .on("click", function(d) {clickFunction(d);});
};
