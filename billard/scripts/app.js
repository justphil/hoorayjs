"use strict";

$(function() {
    var canvas      = $('canvas')[0],
        hh          = new Hooray.HipHip(canvas),
        game        = new Billard.Game(hh.getPubSub(), hh.getCanvasWidth(), hh.getCanvasHeight()),
        mainLoop    = new Billard.MainLoop(hh.getPubSub());

    hh
    .oversampleCanvas()
    .setDrawables(game.getBalls())
    .setLoopFunction(mainLoop)
    .start();

    /*setTimeout(function() {
        hh.stop();
        game.proceed();
        mainLoop.execute();
    }, 200);*/
});