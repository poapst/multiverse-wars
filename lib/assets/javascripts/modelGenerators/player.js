/**
 * Created by Poapst on 5/14/2015.
 */

var Player = {};
Player.create = function(color) {
    return {
        units: [],
        color: color
    };
};

var Players = {};
Players.getFirstPlayerWithUnits = function(players) {
    var playerNumber = null;
    $.each(players, function(i, player) {
        if(player.units.length > 0) {
            playerNumber = i;
            return false;
        }
    });
    return playerNumber;
};