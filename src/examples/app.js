'use strict';

var angular = require('angular');

require('bootstrap');

/* @ngInject */
function config($urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/staticList');
}

function MyAppController($scope, $window, $interval, $log) {
    var promise = $interval(function _checkBrowserSync() {
        $scope.browserSync = !!$window.___browserSync___;
    }, 250);

    $scope.$on('$destroy', function _cleanUp() {
        $interval.cancel(promise);
    });

    //$scope.$watch(function _checkBrowserSync() {
    //    return $window.___browserSync___;
    //}, function browserSyncChanged(current, previous) {
    //    $log.debug('current, previous', current, previous);
    //});
    //$scope.browserSync = !!window.___browserSync___;

    $log.debug('app.js:14:myAppController.myAppController: ');
}

angular
    .module('myApp', [
        require('ui.router').name,
        require('angular-iscroll').name,
        require('./demos/demos.js').name,
        require('./components/version/version.js').name
    ])
    .config(config)
    .controller('MyAppController', MyAppController);

module.exports = angular.module('myApp');
