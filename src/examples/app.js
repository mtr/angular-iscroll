'use strict';

var angular = require('angular');

/* @ngInject */
function config() {
    // NOP.
}

angular.module('myApp', [
    require('ui.router').name,
    require('angular-iscroll').name,
    require('./components/version/version.js').name
]).config(config);

module.exports = angular.module('myApp');
