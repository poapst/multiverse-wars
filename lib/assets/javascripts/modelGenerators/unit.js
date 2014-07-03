/**
 * Created by Andi on 2014-06-01.
 */

function createUnit(playerNumber, planet, amount, notPlanetUnits) {
    if(amount === undefined) {
        amount = 1;
    }
    var unit = {x: planet.x, y: planet.y, player: playerNumber, planetStart: planet, number: amount}
    if(!notPlanetUnits) {
        planet.unit = unit;
    }
    return unit;
}

function addUnit(unit) {
    unit.number++;
}

function addUnits(unit, amountToAdd) {
    unit.number += amountToAdd;
}

function transferUnits(unitFrom, unitTo, amount) {
    addUnits(unitTo, amount);
    addUnits(unitFrom, -amount);
}

function addDestination(unit, planet, speed) {
    unit.planetEnd = planet;
    unit.totalTurns = Math.sqrt(Math.pow(unit.planetEnd.x - unit.planetStart.x, 2) + Math.pow(unit.planetEnd.y - unit.planetStart.y, 2)) / speed;
    unit.turn = 0;
}

function updateMovingUnit(unit, atDestination) {
    if(unit.planetEnd) {
        unit.turn++;
        if(unit.turn >= unit.totalTurns) {
            atDestination(unit);
        }
    }
}

function updateMovingUnits(units, atDestination) {
    $.each(units, function(i, unit) {
       updateMovingUnit(unit, atDestination);
    });
}

function clearDeadUnits(units) {
    for(var i = 0; i < units.length; i++) {
        if(units[i].number <= 0) {
            units.splice(i, 1);
            i--;
        }
    }
}

function calculateCoords(unit) {
    if(unit.planetEnd) {
        var unitOffset = unit.turn <= 0 ? 0.5 : unit.turn;
        unit.x = (unit.planetEnd.x - unit.planetStart.x) * (unitOffset / unit.totalTurns) + unit.planetStart.x;
        unit.y = (unit.planetEnd.y - unit.planetStart.y) * (unitOffset / unit.totalTurns) + unit.planetStart.y;
    } else {
        unit.x = unit.planetStart.x;
        unit.y = unit.planetStart.y;
    }
}

function calculateAllCoords(units) {
    $.each(units, function(i, unit) {
       calculateCoords(unit);
    });
}

function drawUnits(canvas, xScale, yScale, color, unitData, clickFunction) {
    var unitElements = canvas.selectAll("text").data(unitData);
    unitElements.enter().append("text")
        .attr("fill", color)
        .on("click", function(d) {clickFunction(d);});
    unitElements.exit().remove();
    canvas.selectAll("text")
        .attr("x", function(d) {return xScale(d.x) - 5;})
        .attr("y", function(d) {return yScale(d.y) + 5;})
        .text(function(d) {return d.number;});
}