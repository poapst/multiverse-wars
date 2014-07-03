/**
 * Created by Andi on 2014-05-11.
 *
 * This library will include all random functions needed to do procedural generation
 */
//= require misc

var seed = 1;
var splits = 10000; //number of splits in redistribution

function setSeed(value) {
    seed = value;
}

function getSeedFromCurrentTime() {
    return (new Date()).getTime();
}

function getTempSeededRandom(seedValue) {
    seedValue = Math.sin(seedValue) * 10000;
    return seedValue - Math.floor(seedValue);
}

function getNewSeed(rndNumber) {
    return Math.pow(2, 48) * rndNumber;
}

function getSeededRandom() {
    var ret = getTempSeededRandom(seed);
    seed = getNewSeed(ret);
    return ret;
}

function getNthSeededRandom(seedValue, n) {
    var ret = seedValue;
    for(var i = 0; i < n; i++) {
        ret = getTempSeededRandom(seedValue);
        seedValue = getNewSeed(ret);
    }
    return ret;
}

function getRandomWithOffset(seedValue, offset, n) {
    return getNthSeededRandom(seedValue + offset, n);
}

function getRandomDistribution(arrRndNumbers) {
    var sum = getArrSum(arrRndNumbers, function(value) {return value;});
    var totalNums = arrRndNumbers.length;

    //use area of sum point under triangle to re-evenly distribute the value
    var area = 0;
    var squareArea = getSquareArea(totalNums/2, totalNums/2);
    if(sum <= totalNums / 2) {
        area = getTriangleArea(sum, sum) / squareArea;
    } else {
        area = (squareArea - getTriangleArea(totalNums - sum, totalNums - sum)) / squareArea;
    }
    return area;

    //re distribute total so that it goes the whole span regardless
    //var remainder = area / (totalNums * splits);
    //var total = Math.floor(area * splits * splits);
    //return (splits * (total % totalNums) + (total % splits)) / (totalNums * splits) + remainder;
}

function getRandomFromCoordinates(seedValue, coordinates) {
    var randomArr = []
    $.each(coordinates, function(i, coord) {
        randomArr.push(getRandomWithOffset(seedValue, coord, i));
    });
    var distribution = getRandomDistribution(randomArr);
    var newSeed = getNewSeed(distribution);
    return getTempSeededRandom(newSeed);
}

function getRandomFrom2DCoordinate(seedValue, x, y) {
    return getRandomFromCoordinates(seedValue, [x,y]);
}

function getRandomFrom3DCoordinate(seedValue, x, y, z) {
    return getRandomFromCoordinates(seedValue, [x,y,z]);
}


