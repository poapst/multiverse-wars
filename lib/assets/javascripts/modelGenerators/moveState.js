/**
 * Created by Poapst on 5/19/2015.
 */
//= require misc

var MoveState = {};
MoveState.create = function(planetStart, planetEnd) {
    if(planetEnd) {
        return {
            planetStart: planetStart,
            planetEnd: planetEnd
        };
    } else if(planetStart) {
        return {
            planetStart: planetStart,
            planetEnd: null
        };
    } else {
        return {
            planetStart: null,
            planetEnd: null
        };
    }
};
MoveState.reinitialize = function(moveState) {
    moveState.planetStart = null;
    moveState.planetEnd = null;
};
var MoveStates = {};
MoveStates.drawTrajectories = function(moveStates, speed, canvas, xScale, yScale) {
    GraphicsLibrary.drawDistanceLine(canvas, xScale, yScale, moveStates, "planetStart", "planetEnd", function(moveState) {
        return Math.sqrt(Math.pow(moveState.planetEnd.x - moveState.planetStart.x, 2) + Math.pow(moveState.planetEnd.y - moveState.planetStart.y, 2)) / speed;
    });
};