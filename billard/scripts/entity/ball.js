"use strict";

Hooray.Namespace('Billard', 'Billard');

Billard.Ball = Hooray.Class({
    init: function(id, x, y, radius, color) {
        this.i = 0;

        this.id             = id;
        this.x              = x;
        this.y              = y;
        this.vX             = 0;
        this.vY             = 10;
        this.radius         = radius;
        this.circleRadius   = radius * 0.4;
        this.color          = color;
        this.mass           = 3;
        this.angularAccelerationDenominator = (2/5) * this.mass * (this.radius * this.radius);

        this.vAngular       = 0;
        this.theta          = 0;
        this.phi            = 0;

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
                cosPhiAlpha = Math.cos(phiAlpha);

            this.phi = alpha + Math.atan2(
                sinTheta * sinPhiAlpha,
                sinTheta * cosPhiAlpha * cosDelta + cosTheta * sinDelta
            );

            this.theta = Math.acos(
                -sinTheta * cosPhiAlpha * sinDelta + cosTheta * cosDelta
            );
        }
    },

    handleCushionCollisions: function(left, right, top, bottom) {
        // collision with left/right wall
        if (this.x + this.radius >= right) {
            this.x = right - this.radius;
            this.vX *= -1;
        }
        else if (this.x - this.radius <= left) {
            this.x = this.radius;
            this.vX *= -1;
        }

        // collision with upper/lower wall
        if (this.y + this.radius >= bottom) {
            this.y = bottom - this.radius;
            this.vY *= -1;
        }
        else if (this.y - this.radius <= top) {
            this.y = this.radius;
            this.vY *= -1;
        }
    },

    drawMainCircle: function(context) {
        context.beginPath();
        context.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
    },

    drawFaceCircle: function(context, theta) {
        var d = this.radius * Math.sin(theta);
        var cosTheta = Math.cos(theta);
        //var s = this.circleRadius * cosTheta;

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

        // Due to the maths behind phi it may appear that its value is a multiple of its real value.
        // Therefore we kind of normalize phi by this statement in order to prevent 180° flipping effects
        // of the number texture.
        var rotate = this.phi % Math.PI;

        context.rotate(rotate);

        context.scale(cosTheta, 1);
        // Draw the white circle
        /*context.beginPath();
         context.arc(0, 0, this.circleRadius, 0, 2 * Math.PI, false);
         context.fillStyle = '#FFFFFF';
         context.fill();*/

        context.drawImage(
            this.image, 0, 0, 256, 256,
            -this.circleRadius, -this.circleRadius, this.circleRadius*2, this.circleRadius*2
        );
    },

    drawFaceCircles: function(context, theta) {
        if (!this.imageLoaded) {
            return;
        }

        if (theta < Math.PI / 2) {
            this.drawFaceCircle(context, theta);
        }
        else {
            this.drawFaceCircle(context, theta - Math.PI);
        }
    },

    draw: function(context) {
        context.save();
        context.translate(this.x, this.y);

        this.drawMainCircle(context);

        /*if (this.i % 30 === 0 && (Math.abs(this.vX) > 0 || Math.abs(this.vY) > 0)) {
            console.log('['+this.i+'] t -> ', this.theta * (180/Math.PI), this.theta);
            console.log('['+this.i+'] p -> ', this.phi * (180/Math.PI), this.phi);
        }*/

        // small white circle
        this.drawFaceCircles(context, this.theta);

        context.restore();

        this.i++;
    }
});