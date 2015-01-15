'use strict';

var angular = require('angular');

require('bootstrap');

/* @ngInject */
function config($urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/staticList');
}

angular.module('myApp', [
    require('ui.router').name,
    require('angular-iscroll').name,
    require('./demos/demos.js').name,
    require('./components/version/version.js').name
]).config(config);

module.exports = angular.module('myApp');
