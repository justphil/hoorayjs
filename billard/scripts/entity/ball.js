"use strict";

Hooray.Namespace('Billard', 'Billard');

Billard.Ball = Hooray.Class({
    init: function(id, x, y, radius, color) {
        this.i              = 0;

        this.id             = id;
        this.x              = x;
        this.y              = y;
        this.vX             = 10;
        this.vY             = 0;
        this.radius         = radius;
        this.circleRadius   = radius * 0.4;
        this.color          = color;
        this.mass           = 3;
        this.angularAccelerationDenominator = (2/5) * this.mass * (this.radius * this.radius);

        this.vAngular       = 0;
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

    getVelocityAngle: function() {
        return Math.atan2(this.vY, this.vX);
    },

    getSquaredVelocity: function() {
        return this.vX * this.vX + this.vY * this.vY;
    },

    getVelocity: function(squaredVelocity) {
        var sv = (Hooray.isUndefined(squaredVelocity)) ? this.getSquaredVelocity() : squaredVelocity;
        return Math.sqrt(sv);
    },

    isPerfectlyRotating: function(velocity) {
        var v = (Hooray.isUndefined(velocity)) ? this.getVelocity() : velocity;
        return this.vAngular * this.radius >= v;
    },

    applyTranslation: function() {
        this.x += this.vX;
        this.y += this.vY;
    },

    applyAbsoluteFriction: function(absoluteFriction, velocity, velocityAngle) {
        var v       = (Hooray.isUndefined(velocity)) ? this.getVelocity() : velocity;
        var vAngle  = (Hooray.isUndefined(velocityAngle)) ? this.getVelocityAngle() : velocityAngle;

        if (v > absoluteFriction) {
            v -= absoluteFriction;
        }
        else {
            v = 0;
        }

        this.vX = Math.cos(vAngle) * v;
        this.vY = Math.sin(vAngle) * v;
    },

    applyFrictionAsPercentage: function(percentage, stopThreshold) {
        this.vX *= percentage;
        this.vY *= percentage;

        if (Math.abs(this.vX) < stopThreshold) {
            this.vX = 0;
        }

        if (Math.abs(this.vY) < stopThreshold) {
            this.vY = 0;
        }
    },

    applyTorque: function(absoluteFriction) {
        var torque              = absoluteFriction * this.radius;
        this.vAngular          += torque / this.angularAccelerationDenominator;
    },

    applyRotation: function(squaredVelocity, velocity, velocityAngle, rotationDelta) {
        var sv      = (Hooray.isUndefined(squaredVelocity)) ? this.getSquaredVelocity() : squaredVelocity;
        var v       = (Hooray.isUndefined(velocity)) ? this.getVelocity() : velocity;
        var alpha   = (Hooray.isUndefined(velocityAngle)) ? this.getVelocityAngle() : velocityAngle;
        var delta   = (Hooray.isUndefined(rotationDelta)) ? v / this.radius : rotationDelta;

        if (sv > 0) {
            // Update the ball orientation
            var sinDelta    = Math.sin(delta),
                cosDelta    = Math.cos(delta),
                sinTheta    = Math.sin(this.theta),
                cosTheta    = Math.cos(this.theta),
                phiAlpha    = this.phi - alpha,
                sinPhiAlpha = Math.sin(phiAlpha),
                cosPhiAlpha = Math.cos(phiAlpha),
                oldTheta    = this.theta;

            this.phi = alpha + Math.atan2(
                sinTheta * sinPhiAlpha,
                sinTheta * cosPhiAlpha * cosDelta + cosTheta * sinDelta
            );

            this.theta = Math.acos(
                -sinTheta * cosPhiAlpha * sinDelta + cosTheta * cosDelta
            );

            if (this.theta > oldTheta) {
                this.rotation = 0;
            }
            else {
                this.rotation = 1;
            }
        }
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