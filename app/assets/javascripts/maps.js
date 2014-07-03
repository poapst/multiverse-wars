// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
//= require misc
//= require modelGenerators/planet
//= require modelGenerators/unit
//= require map

var moveState = undefined;

function changeMoveStateFromUnit(unit) {
    if(!unit.planetEnd) {   //unit is on a planet
        changeMoveState(unit.planetStart);
    }
}

function reDraw(mapSelector, players) {
    calculateAllCoords(players[0].units);
    calculateAllCoords(players[1].units);
    console.log(players);
    mapData(mapSelector, "unitsP1", function(canvas, xScale, yScale) {
        drawUnits(canvas, xScale, yScale, players[0].color, players[0].units, function(d) {changeMoveStateFromUnit(d);});
    });
    mapData(mapSelector, "unitsP2", function(canvas, xScale, yScale) {
        drawUnits(canvas, xScale, yScale, players[1].color, players[1].units, function(d) {changeMoveStateFromUnit(d);});
    });
}

function getTurnValue() {
    return $("#maps-index .turn .value");
}
function getPlayerValue() {
    return $("#maps-index .player .value");
}

function getScoreValue(playerNumber) {
    if(playerNumber == 0) {
        return $("#maps-index .score .p1Value");
    }
    return $("#maps-index .score .p2Value");
}

function setScoreValue(value, playerNumber) {
    if(playerNumber == 0) {
        $("#maps-index .score .p1Value").text(value);
    } else {
        $("#maps-index .score .p2Value").text(value);
    }
}

function setMoveMessage(message) {
    $("#maps-index .move .msg").text(message);
}

function capturePlanet(players, unit) {
    console.log(unit);
    if(!unit.planetEnd.unit || unit.planetEnd.unit.number <= 0) { //undefined or invalid pointer => colonized new planet
        var newUnit = createUnit(unit.player, unit.planetEnd, 0);
        transferUnits(unit, newUnit, unit.number);
        players[unit.player].units.push(newUnit);
        console.log("Colonized new planet");
    } else if(unit.planetEnd.unit.player == unit.player) { //add reinforcements
        transferUnits(unit, unit.planetEnd.unit, unit.number);
        console.log("Add reinforcements");
    } else {    //try conquering planet
        if(unit.number <= unit.planetEnd.unit.number) {    //failed to conquer
            unit.planetEnd.unit.number -= unit.number;
            unit.number = 0;
            console.log("Failed to conquer planet");
        } else {    //successful conquer
            unit.number -= unit.planetEnd.unit.number;
            unit.planetEnd.unit.number = 0;
            var newUnit = createUnit(unit.player, unit.planetEnd, 0);
            transferUnits(unit, newUnit, unit.number);
            players[unit.player].units.push(newUnit);
            console.log("Successfully conquered planet");
        }
    }
}

function updateScore(players) {
    $.each(players, function(i, player) {
        var score = Number(getScoreValue(i).text());
        $.each(player.units, function(j, unit) {
           score += unit.number;
        });
        setScoreValue(score, i);
    });
}

function calculateTurn(mapSelector, planets, players) {
    console.log("Turn " + getTurnValue().text());
    updateScore(players);
    $.each(planets, function(i, planet) {
        if(planet.unit && planet.unit.number > 0) {
            planet.unit.number++;
        }
    });
    updateMovingUnits(players[0].units, function(unit) {capturePlanet(players, unit);});
    updateMovingUnits(players[1].units, function(unit) {capturePlanet(players, unit);});
    clearDeadUnits(players[0].units);
    clearDeadUnits(players[1].units);
    reDraw(mapSelector, players);

    if(!players[0].units.length || !players[1].units.length) {  //end of game
        $("#maps-index .next").attr("disabled",  true);
        $("#maps-index .move button").attr("disabled", true);
        var message = "";
        if(players[0].units.length) {
            message = "Game Over! Congradulations... Player 1 wins!";
        } else if(players[1].units.length) {
            message = "Game Over! Congradulations... Player 2 wins!";
        } else {
            message = "Game Over! Stalemate... both players have been wiped out!";
        }
        setMoveMessage(message);
    }
}

function changeMoveState(planet) {
    if(moveState) { //second click
        moveState.planetEnd = planet;
        setMoveMessage("Planets chosen! Choose number of units to move and complete move.");
    } else if(planet.unit && planet.unit.player == Number(getPlayerValue().text()) - 1) {    //first click
        moveState = {planetStart: planet};
        setMoveMessage("Click on planet to move units to...");
    }
}

ready(function() {
    var mapSelector = "#maps-index .map";
    var seed = new Date().getTime();
    var threshold = 0.02;
    var speed = 3;
    console.log(seed);
    var data = createPlanets(seed, threshold, [], -20, -20, 40, 40);

    //create players
    var players = [];
    players.push({color: "red"});
    players.push({color: "blue"});

    //set initial units
    players[0].units = [createUnit(0, data[0], 2)];
    players[1].units = [createUnit(1, data[data.length - 1], 2)];

    mapData(mapSelector, "planets", function(canvas, xScale, yScale) {
        drawPlanets(canvas, xScale, yScale, data, function(d) {changeMoveState(d);});
    }, -21, -21, 41, 41, 800, 800);
    reDraw(mapSelector, players);

    $("#maps-index .next").click(function() {
        var playerValue = getPlayerValue();
        if(playerValue.text() == 1) {
            playerValue.text(2);
        } else {
            playerValue.text(1);
            var turnValue = getTurnValue();
            turnValue.text(Number(turnValue.text()) + 1);
            calculateTurn(mapSelector, data, players);
        }
    });

    $("#maps-index .move button").click(function() {
       if(moveState && moveState.planetEnd) {
           var playerNumber = Number(getPlayerValue().text()) - 1;
           var numTroops = Number($("#maps-index .move input").val());
           if(numTroops >= moveState.planetStart.unit.number) {
               numTroops = moveState.planetStart.unit.number - 1;
           }
           if(numTroops > 0) {
               var newUnit = createUnit(playerNumber, moveState.planetStart, 0, true);
               transferUnits(moveState.planetStart.unit, newUnit, numTroops);
               addDestination(newUnit, moveState.planetEnd, speed);
               players[playerNumber].units.push(newUnit);
               reDraw(mapSelector, players);
           }
           setMoveMessage("Click on planet to move units from...");
           moveState = undefined;
       }
    });
});