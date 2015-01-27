'use strict';

var angular = require('angular');

/* @ngInject */
function StaticListController($scope, $log) {
    $scope.registration = {
        email: null,
        password: null,
        remember: null
    };
}

/* @ngInject */
function config($stateProvider) {
    $stateProvider.state('demos.staticList', {
        url: '/staticList',
        views: {
            'main-contents@': {
                templateUrl: 'demos/static-list/static-list.html',
                controller: 'StaticListController'
            }
        }
    });
}

module.exports = angular.module('myApp.demos.staticList', [])
    .config(config)
    .controller('StaticListController', StaticListController);
