/**
 * Created by Andi on 2014-05-22.
 */
//= require random

function createStar(seed, threshold, x, y) {
    var coordValue = getRandomFrom2DCoordinate(seed, x, y);
    if(coordValue < threshold) {
        var radius = getNthSeededRandom(getNewSeed(coordValue), 1) * 5;
        return {x: x, y: y, r: radius};
    }
    return false;
}

function createStars(seed, threshold, curData, minX, minY, width, height) {
    for(var x = minX; x < width + minX; x++) {
        for(var y = minY; y < height + minY; y++) {
            var potentialStar = createStar(seed, threshold, x, y);
            if(potentialStar) {
                curData.push(potentialStar);
            }
        }
    }
    return curData;
}
