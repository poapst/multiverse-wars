/**
 * Created by Andi on 2014-06-01.
 */

//= require misc

var Unit = {};
Unit.create = function(playerNumber, planet, amount) {
    if(amount === undefined) {
        amount = 1;
    }

    return {
        x: planet.x,
        y: planet.y,
        playerNumber: playerNumber,
        number: amount,
        planetStart: planet,
        planetEnd: null,
        totalTurns: null,
        turn: null,
        domElement: null
    };
};
Unit.addOne = function(unit) {
    unit.number++;
};
Unit.addAmount = function(unit, amountToAdd) {
    unit.number += amountToAdd;
};
Unit.addDestination = function(unit, planet, speed) {
    unit.planetEnd = planet;
    unit.totalTurns = Math.sqrt(Math.pow(unit.planetEnd.x - unit.planetStart.x, 2) + Math.pow(unit.planetEnd.y - unit.planetStart.y, 2)) / speed;
    unit.turn = 0;
};
Unit.updateMoving = function(unit, atDestination) {
    if(unit.planetEnd) {
        unit.turn++;
        if(unit.turn >= unit.totalTurns) {
            atDestination(unit);
        }
    }
};
Unit.getUnitOffset = function(unit) {   //function assumes unit.planetEnd is valid object
    if(unit.totalTurns <= 1) {  //then offset is half way
        return unit.totalTurns / 2.0;
    } else if(unit.totalTurns <= 1.5) {
        if(unit.turn <= 0.5) {  //then on turn 0, make the offset 1/3rd of the way
            return unit.totalTurns / 3.0;
        } else {    //then on turn 1, make the offset 2/3rd of the way
            return unit.totalTurns / 3.0 * 2;
        }
    } else if(unit.turn <= 0.5) {
        return 0.5;
    } else if(unit.turn > unit.totalTurns - 0.5) {
        return unit.totalTurns - 0.5;
    }
    return unit.turn;
};
Unit.calculateCoords = function(unit) {
    if(unit.planetEnd) {
        var unitOffset = Unit.getUnitOffset(unit);
        unit.x = (unit.planetEnd.x - unit.planetStart.x) * (unitOffset / unit.totalTurns) + unit.planetStart.x;
        unit.y = (unit.planetEnd.y - unit.planetStart.y) * (unitOffset / unit.totalTurns) + unit.planetStart.y;
    } else {
        unit.x = unit.planetStart.x;
        unit.y = unit.planetStart.y;
    }
};
Unit.transfer = function(unitFrom, unitTo, amount) {
    Unit.addAmount(unitTo, amount);
    Unit.addAmount(unitFrom, -amount);
};

Unit.conquer = function(unitAlive, unitDead) {
    Unit.addAmount(unitAlive, -unitDead.number);
    Unit.addAmount(unitDead, -unitDead.number);
};

var Units = {};
Units.updateMoving = function(units, atDestination) {
    $.each(units, function(i, unit) {
        Unit.updateMoving(unit, atDestination);
    });
};
Units.clearDead = function(units) {
    for(var i = 0; i < units.length; i++) {
        if(units[i].number <= 0) {
            units.splice(i, 1);
            i--;
        }
    }
};
Units.calculateCoords = function(units) {
    $.each(units, function(i, unit) {
        Unit.calculateCoords(unit);
    });
};
Units.draw = function(units, canvas, xScale, yScale, color, clickFunction, mouseOverFunction, mouseOutFunction) {
    var unitElements = canvas.selectAll("text").data(units);
    unitElements.enter().append("text")
        .each(function(d) {d.domElement = this;})
        .attr("fill", color)
        .on("click", function(d) {clickFunction(d);})
        .on("mouseover", function(d) {mouseOverFunction(d);})
        .on("mouseout", function(d) {mouseOutFunction(d);});
    unitElements.exit().remove();
    canvas.selectAll("text")
        .attr("x", function(d) {return xScale(d.x) - 5;})
        .attr("y", function(d) {return yScale(d.y) + 5;})
        .text(function(d) {return d.number;});
};
Units.drawTrajectories = function(units, canvas, xScale, yScale) {  //assumes all units have planetEnd defined
    GraphicsLibrary.drawDistanceLine(canvas, xScale, yScale, units, "planetEnd", "", function(unit) {
        return unit.totalTurns - unit.turn;
    });
};
Units.getTotalNumber = function(units) {
    var totalNumber = 0;
    $.each(units, function(i, unit) {
        totalNumber += unit.number;
    });
    return totalNumber;
};







