/**
 * Created by Andi on 2014-05-11.
 * This library will hold any misc functions needed for this project
 */

var ExtendedLibrary = {
    //This ready function will make sure your javascript runs on page reload and on turbolinks reload!
    ready: function(func) {
        $(document).ready(func);
        $(document).on('page:load', func);
    },
    getProperty: function(object, propertyNames) {
        var returnValue = object;
        $.each(propertyNames, function(i, propertyName) {
            if (propertyName) {  //non false value
                returnValue = returnValue[propertyName];
            }
        });
        return returnValue;
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

var GraphicsLibrary = {
    drawDistanceLine: function(canvas, xScale, yScale, objects, p1PropertyName, p2PropertyName, getEtaValue) {
        var trajectoryElements = canvas.selectAll("g").data(objects);
        var enteringTrajectoryElements = trajectoryElements.enter().append("g");
        enteringTrajectoryElements.append("line")
            .attr("stroke-dasharray", "0, 10, 3, 3, 5")
            .attr("x1", function(d) {return xScale(ExtendedLibrary.getProperty(d, [p1PropertyName, "x"]));})
            .attr("y1", function(d) {return yScale(ExtendedLibrary.getProperty(d, [p1PropertyName, "y"]));})
            .attr("x2", function(d) {return xScale(ExtendedLibrary.getProperty(d, [p2PropertyName, "x"]));})
            .attr("y2", function(d) {return yScale(ExtendedLibrary.getProperty(d, [p2PropertyName, "y"]));})
            .style("stroke", "gray")
            .style("stroke-width", 2);
        enteringTrajectoryElements.append("text")
            .attr("fill", "gray")
            .attr("x", function(d) {
                return xScale((ExtendedLibrary.getProperty(d, [p1PropertyName, "x"]) + ExtendedLibrary.getProperty(d, [p2PropertyName, "x"])) / 2);
            }).attr("y", function(d) {
                return yScale((ExtendedLibrary.getProperty(d, [p1PropertyName, "y"]) + ExtendedLibrary.getProperty(d, [p2PropertyName, "y"])) / 2);
            }).text(function(d) {
                var eta = Math.ceil(getEtaValue(d));
                return eta > 1 ? eta : "";
            });
        trajectoryElements.exit().remove();
    }
};