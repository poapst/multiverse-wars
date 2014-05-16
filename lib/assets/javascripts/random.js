/**
 * Created by Andi on 2014-05-11.
 *
 * This library will include all random functions needed to do procedural generation
 */

var seed = 1;
var splits = 10000; //number of splits in redistribution

function setSeed(value) {
    seed = value;
}

function getSeedFromCurrentTime() {
    return (new Date()).getTime();
}

function getTempSeededRandom(seedValue) {
    seedValue = Math.sin(seed) * 10000;
    return seedValue - Math.floor(seedValue);
}

function getNewSeed(rndNumber) {
    return Math.pow(2, 64) * rndNumber;
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
        area = (squareArea - getTriangleArea(squareArea - sum, squareArea - sum)) / squareArea;
    }

    //re distribute total so that it goes the whole span regardless
    var remainder = area * ( 1 / totalNums);
    var total = Math.floor(area * splits * totalNums);
    return (total % totalNums) * (1 / totalNums) + remainder;
}

function getRandomFrom2DCoordinate(seedValue, x, y) {
    var randomArr = [];
    randomArr[0] = getRandomWithOffset(seedValue, x, 1);
    randomArr[1] = getRandomWithOffset(seedValue, y, 2);
    return getRandomDistribution(randomArr);
}

function getRandomFrom3DCoordinate(seedValue, x, y, z) {
    var randomArr = [];
    randomArr[0] = getRandomWithOffset(seedValue, x, 1);
    randomArr[1] = getRandomWithOffset(seedValue, y, 2);
    randomArr[2] = getRandomWithOffset(seedValue, z, 3);
    return getRandomDistribution(randomArr);
}


