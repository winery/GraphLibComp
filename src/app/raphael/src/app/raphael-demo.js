(function () {
    "use strict";
    //Libraries
    var paper = Raphael("canvas");
    var watch = WatchJS.watch;

    /**
     * Creates an arrow
     * @param source The target element
     * @param destination The source element
     */
    Raphael.fn.arrow = function (source, destination) {
        var x1 = source.attr("x") || source.attr("cx");
        var y1 = source.attr("y") || source.attr("cy");
        var x2 = destination.attr("y") || destination.attr("cy");
        var y2 = destination.attr("y") || destination.attr("cy");

        function renderPath() {
            var width = (source.attr("width") / 2) || source.attr("r");
            var sourceElement = source.center();
            var destElement = destination.center();
            return "M" + (sourceElement.x + width) + " " + sourceElement.y + "L" + (destElement.x - width) + " " + destElement.y;
        }

        renderPath();

        var object = this.path(renderPath());
        var srcAttr = source.type === "circle" ? ["cx", "cy"] : ["x", "y"];
        var destAttr = destination.type === "circle" ? ["cx", "cy"] : ["x", "y"];

        watch(source.attrs, srcAttr, function () {
            object.attr("path", renderPath());
            object.attr({
                "arrow-end": "block-wide-long",
                "arrow-start": "block-wide-long"
            });
        });

        watch(destination.attrs, destAttr, function () {
            object.attr("path", renderPath());
            object.attr({
                "arrow-end": "block-wide-long",
                "arrow-start": "block-wide-long"
            });
        });

        return object;
    };

    /**
     * Center function
     * @returns {*}
     */
    Raphael.el.center = function () {
        var element = this;
        if (element) {
            var bbox = element.getBBox();

            if (element.type === "circle") {
                return {
                    x: bbox.cx,
                    y: bbox.cy
                };
            } else if (element.type === "rect") {
                return {
                    x: (bbox.x2 - (bbox.width / 2)),
                    y: (bbox.y2 - (bbox.height / 2))
                };
            } else if (element.type === "path") {
                return {
                    x: (bbox.x + bbox.x2) / 2,
                    y: (bbox.y + bbox.y2) / 2
                };
            }
        }
    };

    /**
     * Adds text to the element
     * @param text
     */
    Raphael.el.setText = function (text) {
        var element = this;
        var center = element.center();
        var textElement = paper.text(center.x, center.y, text);

        watch(element.attrs, ["cx", "cy", "x", "y", "path"], function () {
            var center = element.center();
            textElement.attr({x: center.x, y: center.y});
        })
    };

    /**
     * Makes an element draggable
     */
    Raphael.el.makeDraggable = function (xBorder, yBorder, minX, minY) {
        var element = this;
        var x, y;
        this.drag(function (dx, dy) {
            if (element.type === "rect") {
                element.attr({
                    x: Math.min(Math.max(x + dx, xBorder), minX),
                    y: Math.min(Math.max(y + dy, yBorder), minY)
                });
            } else if (element.type === "circle") {
                element.attr({
                    cx: Math.min(Math.max(x + dx, xBorder), minX),
                    cy: Math.min(Math.max(y + dy, yBorder), minY)
                });
            }
        }, function () {
            if (element.type === "rect") {
                x = element.attr("x");
                y = element.attr("y");
            } else if (element.type === "circle") {
                console.log("Drag %o", element);
                x = element.attr("cx");
                y = element.attr("cy");
            }
        })
    };

    /**
     * Sets the html color
     * @param htmlColor The html color
     */
    Raphael.el.setColor = function (htmlColor) {
        this.attr({
            "fill": htmlColor
        });
    };

    /**
     * Sets the stroke color
     * @param strokeColor The stroke color
     */
    Raphael.el.setStrokeColor = function (strokeColor) {
        this.attr({
            "stroke": strokeColor
        });
    };

    /**
     * Sets the stroke style
     * @param strokeStyle The stroke style
     */
    Raphael.el.setStrokeStyle = function (strokeStyle) {
        this.attr({
            "stroke-dasharray": strokeStyle
        });
    };


    /**
     * Adds a Rectangle
     */
    function addRectangle() {
        var color = '#' + Math.random().toString(16).substr(-6);

        var rect = paper.rect(10, 10, 80, 80);
        rect.setColor(color);

        rect.makeDraggable(0, 10, 380, 380);
        rect.setText("Rect");

        rect.dblclick(function () {
            var bbox = rect.getBBox();
            var xOffset = bbox.x2 + 10;
            var yOffset = bbox.y;
        });

    }

    /**
     * Inits the rectangles
     */
    function initRectangles() {
        var rectLeft = paper.rect(10, 10, 80, 80);
        var rectRight = paper.rect(380, 10, 80, 80);
        rectLeft.setColor("#999999");
        rectLeft.setStrokeColor("#000");
        rectLeft.makeDraggable(0, 10, 380, 380);
        rectLeft.setText("Rect");

        rectRight.setColor("#999999");
        rectRight.setStrokeColor("#000");
        rectRight.makeDraggable(0, 10, 380, 380);
        rectRight.setStrokeStyle("-");
        rectRight.setText("Rect");
        var arrow = paper.arrow(rectLeft, rectRight);

        arrow.text("Label");
        $("#addRectBtn").click(function () {
            addRectangle()
        });
    }

    /**
     * Adds a circle
     */
    function addCircle() {
        var color = '#' + Math.random().toString(16).substr(-6);

        var circle = paper.circle(50, 50, 40);
        circle.setColor(color);
        circle.makeDraggable(50, 50, 420, 420);
        circle.setText("Circle");
    }


    /**
     * Inits the circles
     */
    function initCircles() {
        var circleLeft = paper.circle(50, 420, 40);
        var circleRight = paper.circle(410, 420, 40);
        circleLeft.setColor("#FFF");
        circleLeft.setStrokeColor("#000");
        circleLeft.makeDraggable(50, 50, 420, 420);
        circleLeft.setText("Circle");

        circleRight.setColor("#FFF");
        circleRight.setStrokeColor("#000");
        circleRight.makeDraggable(50, 50, 420, 420);
        circleRight.setText("Circle");

        var arrow = paper.arrow(circleLeft, circleRight);
        arrow.attr("stroke-dasharray", "-");
        $("#addCircleBtn").click(function () {
            addCircle()
        });
    }

    /**
     * Main entry method
     */
    function main() {
        initRectangles();
        initCircles();
    }

    main();

})();

