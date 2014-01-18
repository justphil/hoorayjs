"use strict";

Hooray.Namespace('Billard', 'Billard');

Billard.MainLoop = Hooray.Class({
    init: function(pubSub) {
        this.pubSub = pubSub;
    },
    execute: function(context, drawables, pubSub, canvasWidth, canvasHeight, timestamp) {
        //pubSub.publish('foo', {one: 1, two: 2, three: 3});

        var testBall = drawables['testBall'];



        // collision with left/right wall
        if (testBall.x + testBall.radius >= canvasWidth) {
            testBall.x = canvasWidth - testBall.radius;
            testBall.vX *= -1;
            testBall.collision = !testBall.collision;
        }
        else if (testBall.x - testBall.radius <= 0) {
            testBall.x = testBall.radius;
            testBall.vX *= -1;
            testBall.collision = !testBall.collision;
        }

        // collision with upper/lower wall
        if (testBall.y + testBall.radius >= canvasHeight) {
            testBall.y = canvasHeight - testBall.radius;
            testBall.vY *= -1;
            testBall.collision = !testBall.collision;
        }
        else if (testBall.y - testBall.radius <= 0) {
            testBall.y = testBall.radius;
            testBall.vY *= -1;
            testBall.collision = !testBall.collision;
        }

        // 2d movement
        testBall.x += testBall.vX;
        testBall.y += testBall.vY;

        // ball rotation
        var ds2 = testBall.vX * testBall.vX + testBall.vY * testBall.vY;
        if (ds2 > 0) {
            // Update the ball orientation
            var delta = Math.sqrt(ds2) / testBall.radius;
            var sinDelta = Math.sin(delta);
            var cosDelta = Math.cos(delta);
            var alpha = Math.atan2(testBall.vY, testBall.vX);
            var sinTheta = Math.sin(testBall.theta);
            var cosTheta = Math.cos(testBall.theta);
            var phiAlpha = testBall.phi - alpha;
            var sinPhiAlpha = Math.sin(phiAlpha);
            var cosPhiAlpha = Math.cos(phiAlpha);
            var oldTheta = testBall.theta;
            testBall.phi = alpha + Math.atan2(sinTheta * sinPhiAlpha, sinTheta * cosPhiAlpha * cosDelta + cosTheta * sinDelta);
            testBall.theta = Math.acos(-sinTheta * cosPhiAlpha * sinDelta + cosTheta * cosDelta);

            if (testBall.theta > oldTheta) {
                testBall.rotation = 0;
            }
            else {
                testBall.rotation = 1;
            }
        }
    }
});
