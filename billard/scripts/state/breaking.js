"use strict";

Hooray.Namespace('Billard.Game.State', 'Billard');

Billard.Game.State.Breaking = Hooray.Class({
    init: function(breaker) {
        console.log('Breaking state created. breaker: ' + breaker);
        this.breaker = breaker;
    },
    proceed: function() {
        console.log('Proceeding to next state from Breaking state');
    }
});