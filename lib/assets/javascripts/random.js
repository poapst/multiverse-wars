/**
 * Created by Andi on 2014-05-11.
 *
 * This library will include all random functions needed to do procedural generation
 */
//= require misc

var RandomLibrary = {
    _seed: 1,
    _splits: 10000 //number of splits in redistribution
};

RandomLibrary.setSeed = function(value) {
        RandomLibrary._seed = value;
};

RandomLibrary.getSeedFromCurrentTime = function() {
        return (new Date()).getTime();
};

RandomLibrary.getTempSeededRandom = function(seedValue) {
        seedValue = Math.sin(seedValue) * 10000;
        return seedValue - Math.floor(seedValue);
};

RandomLibrary.getNewSeed = function(rndNumber) {
        return Math.pow(2, 48) * rndNumber;
};

RandomLibrary.getSeededRandom = function() {
        var ret = RandomLibrary.getTempSeededRandom(RandomLibrary._seed);
        RandomLibrary._seed = RandomLibrary.getNewSeed(ret);
        return ret;
};

RandomLibrary.getNthSeededRandom = function(seedValue, n) {
        var ret = seedValue;
        for (var i = 0; i < n; i++) {
            ret = RandomLibrary.getTempSeededRandom(seedValue);
            seedValue = RandomLibrary.getNewSeed(ret);
        }
        return ret;
};

RandomLibrary.getRandomWithOffset = function(seedValue, offset, n) {
        return RandomLibrary.getNthSeededRandom(seedValue + offset, n);
};

RandomLibrary.getRandomDistribution = function(arrRndNumbers) {
        var sum = ArrayLibrary.getArrSum(arrRndNumbers, function (value) {
            return value;
        });
        var totalNums = arrRndNumbers.length;

        //use area of sum point under triangle to re-evenly distribute the value
        var area = 0;
        var squareArea = MathExtendedLibrary.getSquareArea(totalNums / 2, totalNums / 2);
        if (sum <= totalNums / 2) {
            area = MathExtendedLibrary.getTriangleArea(sum, sum) / squareArea;
        } else {
            area = (squareArea - MathExtendedLibrary.getTriangleArea(totalNums - sum, totalNums - sum)) / squareArea;
        }
        return area;

        //re distribute total so that it goes the whole span regardless
        //var remainder = area / (totalNums * splits);
        //var total = Math.floor(area * splits * splits);
        //return (splits * (total % totalNums) + (total % splits)) / (totalNums * splits) + remainder;
};

RandomLibrary.getRandomFromCoordinates = function(seedValue, coordinates) {
        var randomArr = [];
        $.each(coordinates, function (i, coord) {
            randomArr.push(RandomLibrary.getRandomWithOffset(seedValue, coord, i));
        });
        var distribution = RandomLibrary.getRandomDistribution(randomArr);
        var newSeed = RandomLibrary.getNewSeed(distribution);
        return RandomLibrary.getTempSeededRandom(newSeed);
};

RandomLibrary.getRandomFrom2DCoordinate = function(seedValue, x, y) {
        return RandomLibrary.getRandomFromCoordinates(seedValue, [x, y]);
};

RandomLibrary.getRandomFrom3DCoordinate = function(seedValue, x, y, z) {
        return RandomLibrary.getRandomFromCoordinates(seedValue, [x, y, z]);
};

