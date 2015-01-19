'use strict';

var angular = require('angular');

/* @ngIncject */
function foo() {

}

module.exports = angular.module('myApp.demos', [
    require('./static-list/static-list.js').name,
    require('./ng-repeat-list/ng-repeat-list.js').name,
    require('./multi-column-dynamic/multi-column-dynamic.js').name
]);
