"use strict";

Hooray.Namespace('Billard', 'Billard');

Billard.MainLoop = Hooray.Class({
    init: function(pubSub) {
        this.pubSub = pubSub;

        this.frictionCoefficientBillard = 0.2;
        this.gravitationalConstant = 9.81;
    },

    execute: function(context, drawables, pubSub, canvasWidth, canvasHeight, timestamp) {
        //pubSub.publish('foo', {one: 1, two: 2, three: 3});

        var testBall = drawables['testBall'];

        var generalFrictionFactor = 0.99;

        var currentVelocitySquared  = testBall.getSquaredVelocity();
        var currentVelocity         = testBall.getVelocity(currentVelocitySquared);
        var vAngle                  = testBall.getVelocityAngle();

        // check condition for perfect ball rotation/rolling
        if (testBall.isPerfectlyRotating(currentVelocity)) {
            generalFrictionFactor = 0.99;

            // apply perfect ball rotation/rolling
            testBall.applyRotation(currentVelocitySquared, currentVelocity, vAngle);
        }
        else {

            generalFrictionFactor = 1;

            // apply sliding friction
            //var frictionForce = this.frictionCoefficientBillard * testBall.mass * this.gravitationalConstant;
            var friction = 0.1;
            testBall.applyAbsoluteFriction(friction, currentVelocity, vAngle);


            // due to sliding friction we need to apply the corresponding torque
            // apply torque (Drehmoment) and resulting angular acceleration
            testBall.applyTorque(friction);

            testBall.applyRotation(currentVelocitySquared, currentVelocity, vAngle, testBall.vAngular);

        }

        // apply general friction
        testBall.applyFrictionAsPercentage(generalFrictionFactor, 0.022);


        testBall.applyTranslation();

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

    }
});
