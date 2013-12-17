"use strict";

var Hooray = Hooray || {};

(function(H, undefined) {

    H.Actor = H.Class({
        init: function(id, x, y) {},
        proto: function() {}
    });
    
    H.Person = function(name) {
        this.name = name;
    };

    H.Person.prototype.getName = function() {
        return this.name;
    };

    H.Student = function(name, id) {
        H.Person.call(this, name);
        this.id = id;
    };

    H.Student.prototype = Object.create(H.Person.prototype);

    H.Student.prototype.getId = function() {
        return this.id;
    };
})(Hooray);