(function () {
    "use strict";

    jsPlumb.ready(function () {

        //Do jsplumb init stuff here
        jsPlumb.setContainer("container");
        jsPlumb.importDefaults({
            ConnectionsDetachable: false
        });

        /**
         * Adss a new draggable rectangle intstance
         */
        function addRectangle() {
            var $newRect = $("<div class='common rectCommon newPosition'>Rect</div>");
            $("#container").append($newRect);
            jsPlumb.draggable($newRect, {containment: true});
        }

        /**
         * Adds a new draggable circle instance
         */
        function addCircle() {
            var $newCircle = $("<div class='common circleCommon newPosition'>Circle</div>");
            $("#container").append($newCircle);
            jsPlumb.draggable($newCircle, {containment: true});
        }

        /**
         * Exports html and svg to an image by using the canvas#toDataURL method
         */
        function exportAsImage() {
            var el = $('#container').get(0);
            html2canvas(el, {
                onrendered: function (canvas) {
                    var ctx = canvas.getContext('2d');
                    var $flows = $('> svg', el);
                    $flows.each(function () {
                        var $svg = $(this);
                        var offset = $svg.position();
                        var svgStr = this.innerHTML;
                        ctx.drawSvg(svgStr, 800, 800,100,100);
                    });
                    var downloadWindow = window.open("Image", "Image from JSPlumb");
                    downloadWindow.location = canvas.toDataURL();
                }
            });
        }

        /**
         * Inits the rectangles
         */
        function initRectangles() {
            var rectLeftId = "rectLeft";
            var rectRightId = "rectRight";
            var commonConnectStyle = {
                anchors: ["Right", "Left"],
                type: "Straight"
            };

            jsPlumb.draggable([rectLeftId, rectRightId], {containment: true});

            jsPlumb.connect({
                source: rectLeftId,
                target: rectRightId,
                deleteEndpointsOnDetach: false,
                connector: ["Straight"],
                endpointStyle: {fill: "black"},
                endpoints: ["Blank", "Blank"],
                paintStyle: {stroke: "black", strokeWidth: 1},
                overlays: [["Label", {
                    label: "Label",
                    cssClass: "connectionLabel"
                }]]
            }, commonConnectStyle);
        }

        /**
         * Inits circles
         */
        function initCircles() {
            var circleLeftId = "circleLeft";
            var circleRightId = "circleRight";
            var commonConnectStyle = {
                anchors: ["Right", "Left"]
            };

            jsPlumb.draggable([circleLeftId, circleRightId], {
                containment: true
            });

            jsPlumb.connect({
                source: circleLeftId,
                target: circleRightId,
                deleteEndpointsOnDetach: false,
                connector: ["Straight"],
                endpoints: ["Blank", "Blank"],
                paintStyle: {stroke: "black", strokeWidth: 1, dashstyle: "4 2"}
            }, commonConnectStyle);
        }

        /**
         * Main Method
         */
        function main() {
            initRectangles();
            initCircles();
            $("#addRectBtn").click(addRectangle);
            $("#addCircleBtn").click(addCircle);
            $("#exportBtn").click(exportAsImage);
        }

        main();
    });

})();
