/**
 * Created by Andi on 2014-05-11.
 * This library will hold any misc functions needed for this project
 */

var ExtendedLibrary = {
    //This ready function will make sure your javascript runs on page reload and on turbolinks reload!
    ready: function(func) {
        $(document).ready(func);
        $(document).on('page:load', func);
    }
};

var ArrayLibrary = {
    getArrSum: function(arr, valueFunc) {
        var sum = 0;
        $.each(arr, function(i, value) {
            sum += valueFunc(value);
        });
        return sum;
    }
};

var MathExtendedLibrary = {
    getTriangleArea: function(base, height) {
        return (base * height) / 2;
    },
    getSquareArea: function(base, height) {
        return base * height;
    }
};