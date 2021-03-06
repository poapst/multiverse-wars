/**
 * Created by Poapst on 4/21/2015.
 */

//= require modelGenerators/planet
//= require modelGenerators/unit
//= require modelGenerators/player
//= require modelGenerators/moveState
//= require map

var Game = {
    _moveState: null,
    _isEnd: false
};
Game.setScoreValue = function(scoreElement, value) {
    scoreElement.text(value);
};
Game.setMoveMessage = function(messageElement, message) {
    messageElement.text(message);
};
Game.getSettings = function(mapSelector) {
    return {
        mapSelector: mapSelector,
        seed: new Date().getTime(),
        threshold: 0.02,
        radius: 10,
        speed: 3,
        numberOfPlayers: 2,    //Note: Cannot currently be more than 2(due to unitialization of players higher than 2)
        mapWidth: 40,
        mapHeight: 40
    };
};
Game.reinitializeMoveState = function(messageElement) {
    Game.setMoveMessage(messageElement, "Click on planet to move units from...");
    if(Game._moveState) {
        if(Game._moveState.planetEnd) {
            d3.select(Game._moveState.planetEnd.domElement).attr("stroke-width", 0);
        }
        if(Game._moveState.planetStart) {
            d3.select(Game._moveState.planetStart.domElement).attr("stroke-width", 0);
        }
    }
    Game._moveState = null;
};
Game.changeMoveState = function(playerElement, messageElement, planet) {
    if(Game._isEnd) return;
    if(Game._moveState && planet != Game._moveState.planetStart) {  //second click
        if(Game._moveState.planetEnd) { //switching end planet, remove previously selected
            d3.select(Game._moveState.planetEnd.domElement).attr("stroke-width", 0);
        }
        Game._moveState.planetEnd = planet;
        Game.setMoveMessage(messageElement, "Planets chosen! Choose number of units to move and complete move.");
        d3.select(planet.domElement).attr("stroke", "blue").attr("stroke-width", 2);
    } else if(Game._moveState) {    //cancel first click
        Game.reinitializeMoveState(messageElement);
    } else if(planet.unit && planet.unit.playerNumber === Number(playerElement.text()) - 1) {   //first click
        Game._moveState = {planetStart: planet};
        Game.setMoveMessage(messageElement, "Click on planet to move units to...");
        d3.select(planet.domElement).attr("stroke", "blue").attr("stroke-width", 2);
    }
};
Game.cancelUnitOrder = function(mapSelector, playerElement, messageElement, players, unit) {
    Unit.transfer(unit, unit.planetStart.unit, unit.number);
    Units.clearDead(players[unit.playerNumber].units);
    Game.reDraw(mapSelector, playerElement, messageElement, players);
};
Game.changeMoveStateFromUnit = function(mapSelector, playerElement, messageElement, players, unit) {
    if(!unit.planetEnd) {   //unit is on a planet
        Game.changeMoveState(playerElement, messageElement, unit.planetStart);
    } else if(unit.turn < 1 && unit.playerNumber === Number(playerElement.text()) - 1) {  //cancel order
        Game.cancelUnitOrder(mapSelector, playerElement, messageElement, players, unit);
    }
};
Game.onPlanetMouseOver = function(mapSelector, playerElement, planet, speed) {
    if(Game._isEnd) return;
    var element = d3.select(planet.domElement).attr("stroke-width", 2);
    if(Game._moveState) {   //during second click state
        if(planet === Game._moveState.planetStart) {    //first clicked planet
            element.attr("stroke", "red");
        } else {
            element.attr("stroke", "green");
        }
        if(Game._moveState.planetEnd && planet !== Game._moveState.planetEnd && planet !== Game._moveState.planetStart) {  //then show 2 trajectories
            Game.drawPlanetTrajectories(mapSelector, [Game._moveState, MoveState.create(Game._moveState.planetStart, planet)], speed)
        } else if(planet !== Game._moveState.planetStart) {    //show single trajectory
            Game.drawPlanetTrajectories(mapSelector, [Game._moveState], speed);
        }
    } else {    //during first click state
        var playerNumber = Number(playerElement.text()) - 1;
        if(planet.unit && planet.unit.playerNumber === playerNumber) {
            element.attr("stroke", "green");
        } else {
            element.attr("stroke", "red");
        }

    }
};
Game.onUnitMouseOver = function(mapSelector, playerElement, unit) {
    if(!unit.planetEnd) {   //unit is on a planet
        Game.onPlanetMouseOver(playerElement, unit.planetStart);
    } else {
        if(unit.turn < 1 && unit.playerNumber === Number(playerElement.text()) - 1) {  //then change unit color to grey to show unit can be cancelled
            d3.select(unit.domElement).attr("fill", "gray");
        }
        Game.drawUnitTrajectories(mapSelector, [unit]);
    }
};
Game.onPlanetMouseOut = function(mapSelector, planet, speed) {
    if(Game._isEnd) return;
    var element = d3.select(planet.domElement);
    if(Game._moveState && (planet === Game._moveState.planetEnd || planet === Game._moveState.planetStart)) {   //if clicked return to click state
        element.attr("stroke", "blue");
    } else {
        element.attr("stroke-width", 0);
    }
    if(Game._moveState.planetEnd) {
        Game.drawPlanetTrajectories(mapSelector, [Game._moveState], speed);
    } else if(Game._moveState) {
        Game.drawPlanetTrajectories(mapSelector, [], speed);
    } else {

    }
};
Game.onUnitMouseOut = function(mapSelector, playerElement, unit, playerColor) {
    if(!unit.planetEnd) {   //unit is on a planet
        Game.onPlanetMouseOut(unit.planetStart);
    } else {
        if(unit.turn < 1 && unit.playerNumber === Number(playerElement.text()) - 1) {  //then change unit back to original color
            d3.select(unit.domElement).attr("fill", playerColor);
        }
        Game.drawUnitTrajectories(mapSelector, []);
    }
};
Game.drawUnitTrajectories = function(mapSelector, units) {   //assumes all units have planetEnd defined
    Map.mapData(mapSelector, "unitTrajectories", function(canvas, xScale, yScale) {
        Units.drawTrajectories(units, canvas, xScale, yScale);
    });
};
Game.drawPlanetTrajectories = function(mapSelector, moveStates, speed) {
    Map.mapData(mapSelector, "planetTrajectories", function(canvas, xScale, yScale) {
        MoveStates.drawTrajectories(moveStates, speed, canvas, xScale, yScale);
    });
};
Game.reDraw = function(mapSelector, playerElement, messageElement, players) {
    $.each(players, function(i, player) {
        Units.calculateCoords(player.units);
    });
    $.each(players, function(i, player) {
        Map.mapData(mapSelector, "unitsP" + (i + 1).toString(), function(canvas, xScale, yScale) {
            Units.draw(player.units, canvas, xScale, yScale, player.color,
                function(d) {Game.changeMoveStateFromUnit(mapSelector, playerElement, messageElement, players, d);},
                function(d) {Game.onUnitMouseOver(mapSelector, playerElement, d);},
                function(d) {Game.onUnitMouseOut(mapSelector, playerElement, d, player.color);}
            );
        });
    });
};
Game.capturePlanet = function(players, unit) {  //assumes unit is situated at planet end
    var contestedPlanet = unit.planetEnd;
    var defendingUnit = contestedPlanet.unit;
    if(!defendingUnit || defendingUnit.number <= 0) {   //undefined or invalid pointer => colonize new planet
        var newUnit = Unit.create(unit.playerNumber, contestedPlanet, 0);
        contestedPlanet.unit = newUnit;
        Unit.transfer(unit, newUnit, unit.number);
        players[unit.playerNumber].units.push(newUnit);
    } else if(defendingUnit.playerNumber === unit.playerNumber) {   //add reinforcements
        Unit.transfer(unit, defendingUnit, unit.number);
    } else {    //try conquering planet
        if(unit.number <= defendingUnit.number) {   //failed to conquer
            Unit.conquer(defendingUnit, unit);
        } else {    //successful conquer
            Unit.conquer(unit, defendingUnit);
            var newUnit = Unit.create(unit.playerNumber, contestedPlanet, 0);
            contestedPlanet.unit = newUnit;
            Unit.transfer(unit, newUnit, unit.number);
            players[unit.playerNumber].units.push(newUnit);
        }
    }
};
Game.updateScore = function(players, getScoreElement) {
    $.each(players, function(i, player) {
        var score = Number(getScoreElement(i).text());
        score += Units.getTotalNumber(player.units);
        Game.setScoreValue(getScoreElement(i), score);
    });
};
Game.isEndOfGame = function(players) {
    var numberOfPlayersRemaining = 0;
    $.each(players, function(i, player) {
        if(player.units.length > 0) {
            numberOfPlayersRemaining++;
        }
    });
    return numberOfPlayersRemaining <= 1 ? true : false;
};
Game.addUnitsForTurn = function(planets) {
    $.each(planets, function(i, planet) {   //add 1 unit to all units(1 or more) which are occupying planets
        if(planet.unit && planet.unit.number > 0) {
            Unit.addOne(planet.unit);
        }
    });
};
Game.processEndOfGame = function(nextElement, moveElement, messageElement, players) {
    Game._isEnd = true;
    nextElement.attr("disabled",  true);
    moveElement.attr("disabled", true);
    var message = "";
    var winningPlayerNumber = Players.getFirstPlayerWithUnits(players);
    if(winningPlayerNumber === null) {
        message = "Game Over! No winner... all players have been wiped out!";
    } else {
        message = "Game Over! Congratulations... Player " + (winningPlayerNumber + 1).toString() + " wins!";
    }
    Game.setMoveMessage(messageElement, message);
};
Game.calculateTurn = function(mapSelector, playerElement, messageElement, nextElement, moveElement, planets, players, getScoreElement) {
    Game.updateScore(players, getScoreElement);
    Game.addUnitsForTurn(planets);

    $.each(players, function(i, player) {  //update all moving units
        Units.updateMoving(player.units, function(unit) {Game.capturePlanet(players, unit);});
    });

    $.each(players, function(i, player) {   //clear all dead units(those with <= 0)
        Units.clearDead(player.units);
    });

    Game.reDraw(mapSelector, playerElement, messageElement, players);

    if(Game.isEndOfGame(players)) {
        Game.processEndOfGame(nextElement, moveElement, messageElement, players);
    }
};
Game.createPlanets = function(settings) {
    var minX = Map.getMinCoord(settings.mapWidth);
    var minY = Map.getMinCoord(settings.mapHeight);
    return Planets.addManyInArea([], settings.seed, settings.threshold, minX, minY, settings.mapWidth, settings.mapHeight, settings.radius);
};
Game.createPlayers = function(numberOfPlayers) {
    //Note: number of players not currently used to create players, due to not figuring out color scheme and homeworld associations yet.
    var players = [];
    players.push(Player.create("red"));
    players.push(Player.create("blue"));
    return players;
};
Game.setHomeWorlds = function(planets, players) {
    players[0].units.push(Unit.create(0, planets[0], 2));
    players[1].units.push(Unit.create(1, planets[planets.length - 1], 2));
    planets[0].unit = players[0].units[0];
    planets[planets.length - 1].unit = players[1].units[0];
};
Game.createMap = function(playerElement, messageElement, settings, planets) {
    var dataX = Map.getMinCoord(settings.mapWidth) - 1;
    var dataY = Map.getMinCoord(settings.mapHeight) - 1;
    var dataWidth = settings.mapWidth + 1;
    var dataHeight = settings.mapHeight + 1;
    var svgWidth = settings.mapWidth * settings.radius * 2;
    var svgHeight = settings.mapHeight * settings.radius * 2;
    Map.mapData(settings.mapSelector, "planets", function(canvas, xScale, yScale) {
        Planets.draw(planets, canvas, xScale, yScale,
            function(d) {Game.changeMoveState(playerElement, messageElement, d);},
            function(d) {Game.onPlanetMouseOver(playerElement, d);},
            function(d) {Game.onPlanetMouseOut(d);}
        );
    }, dataX, dataY, dataWidth, dataHeight, svgWidth, svgHeight);
};
Game.create = function(mapSelector, gameDomElements) {
    var settings = Game.getSettings(mapSelector);
    var planets = Game.createPlanets(settings);
    var players = Game.createPlayers(settings.numberOfPlayers);
    var game = {
        domElements: gameDomElements,
        settings: settings,
        planets: planets,
        players: players
    };
    Game.setHomeWorlds(game);
    Game.createMap(game);
    Game.reDraw(game);

    return game;
};
Game.nextTurn = function(mapSelector, turnElement, playerElement, messageElement, nextElement, moveElement, planets, players, getScoreElement) {
    Game.reinitializeMoveState(messageElement);
    var playerValue = Number(playerElement.text());
    if(playerValue < players.length) {
        playerElement.text(playerValue + 1);
    } else {
        playerElement.text(1);
        turnElement.text(Number(turnElement.text()) + 1);
        Game.calculateTurn(mapSelector, playerElement, messageElement, nextElement, moveElement, planets, players, getScoreElement);
    }
};
Game.move = function(mapSelector, playerElement, messageElement, moveInputElement, players, speed) {
    if(Game._moveState && Game._moveState.planetEnd) {
        var playerNumber = Number(playerElement.text()) - 1;
        var numTroops = Number(moveInputElement.val());
        if(numTroops >= Game._moveState.planetStart.unit.number) {
            numTroops = Game._moveState.planetStart.unit.number - 1;
        }
        if(numTroops > 0) {
            var newUnit = Unit.create(playerNumber, Game._moveState.planetStart, 0);
            Unit.transfer(Game._moveState.planetStart.unit, newUnit, numTroops);
            Unit.addDestination(newUnit, Game._moveState.planetEnd, speed);
            players[playerNumber].units.push(newUnit);
            Game.reDraw(mapSelector, playerElement, messageElement, players);
        }
        Game.reinitializeMoveState(messageElement);
    }
};
