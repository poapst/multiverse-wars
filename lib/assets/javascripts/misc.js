/**
 * Created by Andi on 2014-05-11.
 * This library will hold any misc functions needed for this project
 */

//This ready function will make sure your javascript runs on page reload and on turbolinks reload!
function ready(func) {
    $(document).ready(func);
    $(document).on('page:load', func);
}

function getArrSum(arr, valueFunc) {
    var sum = 0;
    $.each(arr, function(i, value) {
        sum += valueFunc(value);
    });
    return sum;
}

function getTriangleArea(base, height) {
    return (base * height) / 2;
}

function getSquareArea(base, height) {
    return base * height;
}