'use strict';

var angular = require('angular');

require('bootstrap');

/* @ngInject */
function config($urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/');
}

function MyAppController($scope, $window, $interval, $log, iScrollService) {
    $scope.iScrollState = iScrollService.state;
    $scope.toggleIScroll = iScrollService.toggle;

    $scope.demos = [
        {
            state: 'demos.staticList',
            name: 'Static List'
        },
        {
            state: 'demos.ngRepeatList',
            name: 'ngRepeat List'
        },
        {
            state: 'demos.multiColumnDynamic',
            name: 'Multi-column'
        }
    ];

    var promise = $interval(function _checkBrowserSync() {
        $scope.browserSync = !!$window.___browserSync___;
    }, 250);

    $scope.$on('$destroy', function _cleanUp() {
        $interval.cancel(promise);
    });
}

angular
    .module('myApp', [
        require('ui.router').name,
        require('angular-iscroll').name,
        require('angular-messages').name,
        require('./components/version/version.js').name,
        require('./demos/demos.js').name,
        require('./home/home.js').name
    ])
    .config(config)
    .controller('MyAppController', MyAppController);

module.exports = angular.module('myApp');
