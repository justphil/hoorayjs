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

        var testBall                = drawables['testBall'],
            currentVelocitySquared  = testBall.getSquaredVelocity(),
            currentVelocity         = testBall.getVelocity(currentVelocitySquared),
            vAngle                  = testBall.getVelocityAngle(),
            generalFrictionFactor;

        // check condition for perfect ball rotation/rolling
        if (testBall.isPerfectlyRotating(currentVelocity)) {
            generalFrictionFactor = 0.992;

            // apply perfect ball rotation/rolling
            // = angular velocity perfectly corresponds to distance travelled
            testBall.applyRotation(currentVelocitySquared, currentVelocity, vAngle);
        }
        else {
            // here the ball is still sliding and due to sliding friction it progressively starts to rotate
            generalFrictionFactor = 1;

            // apply sliding friction
            //var frictionForce = this.frictionCoefficientBillard * testBall.mass * this.gravitationalConstant;
            var friction = 0.055;
            testBall.applyAbsoluteFriction(friction, currentVelocity, vAngle);


            // due to sliding friction we need to apply the corresponding torque
            // apply torque (Drehmoment) and resulting angular acceleration
            testBall.applyTorque(friction);

            testBall.applyRotation(currentVelocitySquared, currentVelocity, vAngle, testBall.vAngular);

        }

        // apply general friction
        testBall.applyFrictionAsPercentage(generalFrictionFactor, 0.047);


        testBall.applyTranslation();

        testBall.handleCushionCollisions(0, canvasWidth, 0, canvasHeight);

    }
});
