(function(W, Hooray) {
    "use strict";

    var raf = W.requestAnimationFrame;
    var caf = W.cancelAnimationFrame;

    Hooray.raf = function(callback) {
        return raf(callback);
    };

    Hooray.caf = function(callback) {
        return caf(callback);
    };
})(window, Hooray);