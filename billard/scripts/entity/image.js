"use strict";

Hooray.Namespace('Billard', 'Billard');

Billard.Image = Hooray.Class({
    init: function(id, x, y, path) {
        this.id             = id;
        this.x              = x;
        this.y              = y;
        this.path           = path;
        this.image          = new Image();
        this.imageLoaded    = false;
        this.image.src      = path;
        this.rotationAngle  = 0;

        var that = this;
        this.image.onload   = function() {
            that.imageLoaded = true;
            console.log(path + ' loaded!');
        };
    },
    draw: function(context) {
        if (this.imageLoaded) {
            this.rotationAngle += 0.01;
            var rotationAngle = this.rotationAngle,
                width = 100;

            context.save();
            context.translate(width/2, width/2);
            context.rotate(rotationAngle);
            context.drawImage(this.image, 0, 0, 1024, 1024, -(width/2), -(width/2), width, width);
            context.restore();


            /*var width = 100 * 2,
                height= width,
                x, dx, poleX = width/2,
                y, dy, poleY = height/2,
                radius = width - poleX,
                x2, y2, i2,
                dist;*/

            /*console.log('poleX', poleX);
            console.log('poleY', poleY);
            console.log('width', width);
            console.log('height', height);
            console.log('radius', radius);*/

            /*var imageData = context.getImageData(0, 0, width, height),
                pixels = imageData.data;

            var source;
            try {
                source = new Uint8ClampedArray(imageData.data);
            } catch(e) {
                source = new Uint8Array(imageData.data);
            }*/

            //context.putImageData(imageData, width, height);

            /*for (var offset = 0, len = pixels.length; offset < len; offset += 4) {
                x = (offset/4) % width;
                y = Math.floor(offset/4 / width);


                dx = poleX - x;
                dy = poleY - y;
                dist = Math.sqrt(dx * dx + dy * dy);

                i2 = offset;
                if (dist <= radius) {
                    x2 = Math.round( poleX - dx * Math.sin(dist/radius * Math.PI/2) );
                    y2 = Math.round( poleY - dy * Math.sin(dist/radius * Math.PI/2) );
                    i2 = (y2 * width + x2) * 4;
                }

                pixels[offset  ] = source[i2];
                pixels[offset+1] = source[i2+1];
                pixels[offset+2] = source[i2+2];
                pixels[offset+3] = source[i2+3];
            }*/

            //context.putImageData(imageData, 0, 0);
        }
    }
});