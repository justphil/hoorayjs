(function(W, Hooray, $) {
    "use strict";

    Hooray.HipHip = Hooray.Class({
        init: function(canvas) {
            this.canvas         = canvas;
            this.canvasWidth    = canvas.width;
            this.canvasHeight   = canvas.height;
            this.context        = canvas.getContext('2d');
            this.pubSub         = new Hooray.PubSub();
            this.drawables      = {};
        },

        setLoopFunction: function(loopFunction) {
            this.loopFunction = loopFunction;
            return this;
        },

        oversampleCanvas: function(factor) {
            var jqCanvas        = $(this.canvas),
                canvasWidth     = this.canvasWidth,
                canvasHeight    = this.canvasHeight;

            factor = factor || 2;

            jqCanvas.attr('width', canvasWidth * factor);
            jqCanvas.attr('height', canvasHeight * factor);
            jqCanvas.css('width', canvasWidth + 'px');
            jqCanvas.css('height', canvasHeight + 'px');
            this.context.scale(factor, factor);

            return this;
        },

        start: function() {
            var that        = this,
                canvas      = this.canvas,
                canvasWidth = this.canvasWidth,
                canvasHeight= this.canvasHeight,
                context     = this.context,
                pubSub      = this.pubSub,
                drawables   = this.drawables;

            function loop(timestamp) {
                // request every subsequent frame
                that.requestId = Hooray.raf(loop);

                // clear canvas
                context.clearRect(0, 0, canvasWidth, canvasHeight);

                // execute loop function
                that.loopFunction.execute(context, drawables, pubSub, canvasWidth, canvasHeight, timestamp);

                // draw drawables
                that.draw();
            }

            // request first frame
            that.requestId = Hooray.raf(loop);

            return this;
        },

        stop: function() {
            Hooray.caf(this.requestId);
            return this;
        },

        setDrawables: function(drawables) {
            this.drawables = drawables;
            return this;
        },

        getPubSub: function() {
            return this.pubSub;
        },

        getCanvasWidth: function() {
            return this.canvasWidth;
        },

        getCanvasHeight: function() {
            return this.canvasHeight;
        },

        draw: function() {
            var drawables   = this.drawables,
                context     = this.context;

            for (var prop in drawables) {
                if (drawables.hasOwnProperty(prop)) {
                    drawables[prop].draw(context);
                }
            }
        }
    });
})(window, Hooray, jQuery);