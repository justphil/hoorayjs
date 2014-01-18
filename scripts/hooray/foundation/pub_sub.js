(function(W, Hooray, $) {
    "use strict";

    Hooray.PubSub = Hooray.Class({
        init: function() {
            this.topics = $({});
        },
        subscribe: function() {
            this.topics.on.apply(this.topics, arguments);
        },
        unsubscribe: function() {
            this.topics.off.apply(this.topics, arguments);
        },
        publish: function() {
            this.topics.trigger.apply(this.topics, arguments);
        }
    });
})(window, Hooray, jQuery);