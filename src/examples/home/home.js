'use strict';

var angular = require('angular');

/* @ngInject */
function HomeController($scope, $log, iScrollService) {
    $scope.iScrollState = iScrollService.state;
}

/* @ngInject */
function config($stateProvider) {
    $stateProvider.state('home', {
        url: '/home',
        views: {
            contents: {
                templateUrl: 'home/home.html',
                controller: 'HomeController'
            }
        }
    });
}

module.exports = angular.module('myApp.home', [])
    .config(config)
    .controller('HomeController', HomeController);

