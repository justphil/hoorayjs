"use strict";

Hooray.Namespace('Billard', 'Billard');

Billard.Game = Hooray.Class({
    init: function(pubSub, canvasWidth, canvasHeight) {
        console.log('Billard.Game', canvasWidth, canvasHeight);

        var breaker = Math.round(Math.random());
        this.state  = new Billard.Game.State.Breaking(breaker);
        this.pubSub = pubSub;
        this.balls  = {};

        var radius    = (canvasWidth * 0.0244) / 2,
            ballIdTpl = 'ball#',
            ballId, x, y;

        function id(number) {
            return ballIdTpl.replace('#', number);
        }

        var rackPositions = [
            [id(1), id(9), id(11), id(3), id(14)],
            [id(10), id(8), id(13), id(6)],
            [id(2), id(7), id(5)],
            [id(15), id(12)],
            [id(4)]
        ];

        var rackRotation = 30 * (Math.PI / 180);

        var offsetX = canvasWidth - 260, offsetY = canvasHeight / 2, rackOffsetX = 0, rackOffsetY = 0;

        for (var i = 0; i < rackPositions.length; i++) {
            rackOffsetX = i * Math.cos(-1 * rackRotation) * radius * 2;
            rackOffsetY = i * Math.sin(-1 * rackRotation) * radius * 2;

            for (var j = 0; j < rackPositions[i].length; j++) {
                if (!i && !j) {
                    //this.balls[id(0)] = new Billard.Ball(id(0), offsetX - 500, offsetY, radius, '#FF0000');
                }

                ballId = rackPositions[i][j];
                x = offsetX + rackOffsetX + Math.cos(rackRotation) * radius * 2 * j;
                y = offsetY + rackOffsetY + Math.sin(rackRotation) * radius * 2 * j;
                //this.balls[ballId] = new Billard.Ball(ballId, x, y, radius, '#FF0000');
            }
        }

        this.balls['testBall'] = new Billard.Ball('testBall', 500, 30, radius, '#0000FF');

        /*for (var i = 0; i <= 15; i++) {
            ballId = ballIdTpl.replace('#', i);
            this.balls[ballId] = new Billard.Ball(ballId, i * 40 - 10, 10, radius, '#FF0000');
        }*/

        // image test
        //this.balls['image0'] = new Billard.Image('image0', 0, 0, 'billard/images/ball15.png');

        this.pubSub.subscribe('foo', function(e, data) {
            console.log('foo', data);
        });
    },

    proceed: function() {
        this.state.proceed();
    },

    getBalls: function() {
        console.log('balls', this.balls);
        return this.balls;
    }
});