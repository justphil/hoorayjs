"use strict";

Hooray.Namespace('Billard', 'Billard');

Billard.Ball = Hooray.Class({
    init: function(id, x, y, radius, color) {
        this.i              = 0;

        this.id             = id;
        this.x              = x;
        this.y              = y;
        this.vX             = 1;
        this.vY             = 0;
        this.radius         = radius;
        this.circleRadius   = radius * 0.4;
        this.color          = color;
        this.theta          = 0;
        this.phi            = 0;
        this.rotation       = 0;
        this.collision      = false;

        this.image          = new Image();
        this.imageLoaded    = false;
        this.image.src      = 'billard/images/ball15_03.png';
        var that = this;
        this.image.onload   = function() {
            that.imageLoaded = true;
            console.log('[Ball] ball circle image loaded!');
        };
    },
    draw: function(context) {
        context.save();
        context.translate(this.x, this.y);

        // main ball
        context.beginPath();
        context.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();

        /*if (this.i % 15 === 0) {
            console.log('['+this.i+'] t -> ', this.theta * (180/Math.PI), this.theta);
            console.log('['+this.i+'] p -> ', this.phi * (180/Math.PI), this.phi);
            console.log('['+this.i+'] r -> ', this.rotation);
        }*/

        // small white circle
        if (this.theta < Math.PI / 2 && this.imageLoaded) {
            // Draw the white circle if it is visible
            var d = this.radius * Math.sin(this.theta);
            var cosTheta = Math.cos(this.theta);
            var s = this.circleRadius * cosTheta;

            //console.log('d, s', d, s);

            if (d - s < this.radius) { // this if statement is probably unnecessary
                //console.log(this.theta * (180/Math.PI));
                var cosPhi = Math.cos(this.phi);
                var sinPhi = Math.sin(this.phi);
                // Clip to the ball's circle - do not want to draw parts of the white circle that fall outside the ball borders
                context.clip();
                // Move the coordinates to the center of the white circle
                var translateX = d * cosPhi;
                var translateY = d * sinPhi;
                context.translate(translateX, translateY);
                // Compress the coordinates by cosTheta in the direction between the center of the white circle and the center of the ball

                var rotate = this.phi + this.rotation * Math.PI;
                if (this.collision) {
                    rotate += Math.PI;
                }

                context.rotate(rotate);

                context.scale(cosTheta, 1);
                // Draw the white circle
                /*context.beginPath();
                context.arc(0, 0, this.circleRadius, 0, 2 * Math.PI, false);
                context.fillStyle = '#FFFFFF';
                context.fill();*/

                context.drawImage(this.image, 0, 0, 256, 256, -this.circleRadius, -this.circleRadius, this.circleRadius*2, this.circleRadius*2);
            }
            else {
                console.log('JuuHuu!');
            }
        }

        context.restore();

        this.i++;
    }
});