// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
//= require misc
//= require game

var MapsPage = {};
MapsPage.getTurnElement = function() {
    return $("#maps-index .turn .value");
};
MapsPage.getPlayerElement = function() {
    return $("#maps-index .player .value");
};
MapsPage.getScoreElement = function(playerNumber) {
    return $("#maps-index .score .p" + (playerNumber + 1).toString() + "Value");
};
MapsPage.getMessageElement = function() {
    return $("#maps-index .move .msg");
};
MapsPage.getMoveInputElement = function() {
    return $("#maps-index .move input");
};
MapsPage.getNextButtonElement = function() {
    return $("#maps-index .next");
};
MapsPage.getMoveButtonElement = function() {
    return $("#maps-index .move button");
};

ExtendedLibrary.ready(function() {
    var game = Game.create("#maps-index .map", MapsPage.getPlayerElement(), MapsPage.getMessageElement());

    //Add events
    MapsPage.getNextButtonElement().click(function() {
        Game.nextTurn(
            game.settings.mapSelector,
            MapsPage.getTurnElement(),
            MapsPage.getPlayerElement(),
            MapsPage.getMessageElement(),
            MapsPage.getNextButtonElement(),
            MapsPage.getMoveButtonElement(),
            game.planets,
            game.players,
            function(playerNumber) {
                return MapsPage.getScoreElement(playerNumber);
            }
        );
    });

    MapsPage.getMoveButtonElement().click(function() {
        Game.move(
            game.settings.mapSelector,
            MapsPage.getPlayerElement(),
            MapsPage.getMessageElement(),
            MapsPage.getMoveInputElement(),
            game.players,
            game.settings.speed
        );
    });
});