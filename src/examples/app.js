'use strict';

var angular = require('angular');

require('bootstrap');

/* @ngInject */
function config($urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/');
}

function MyAppController(iScrollService, coreLayoutService) {
    var vm = this;  // Use 'controller as' syntax.

    vm.iScrollState = iScrollService.state;
    vm.layout = coreLayoutService.state;
}

angular
    .module('myApp', [
        require('ui.router').name,
        require('angular-iscroll').name,
        require('angular-messages').name,
        require('./components/core-layout/core-layout.js').name,
        require('./components/header/header.js').name,
        require('./components/version/version.js').name,
        require('./demos/demos.js').name,
        require('./home/home.js').name
    ])
    .config(config)
    .controller('MyAppController', MyAppController);

module.exports = angular.module('myApp');
