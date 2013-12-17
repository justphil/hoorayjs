"use strict";

$(function() {
    console.log('READY!');

    var canvas  = $('#stage'),
        context = canvas.get(0).getContext("2d");

    // oversampling
    canvas.attr("width", $(window).get(0).innerWidth * 2);
    canvas.attr("height", $(window).get(0).innerHeight * 2);
    canvas.css('width', $(window).get(0).innerWidth + 'px');
    canvas.css('height', $(window).get(0).innerHeight + 'px');
    context.scale(2,2);

    context.fillRect(0, 0, 100, 100);


    /*context.beginPath(); // Start the path
    context.moveTo(40, 40); // Set the path origin
    context.lineTo(340, 40); // Set the path destination
    context.closePath(); // Close the path
    context.stroke(); // Outline the path

    context.beginPath(); // Start the path
    context.arc(230, 90, 50, 0, Math.PI*2, false); // Draw a circle
    context.closePath(); // Close the path
    context.fill(); // Fill the path*/
});
