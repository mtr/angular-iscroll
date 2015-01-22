'use strict';

var angular = require('angular');

/* @ngInject */
function HomeController($scope, $log, iScrollService) {
    $scope.iScrollState = iScrollService.state;
}

/* @ngInject */
function HomeHeaderController($log) {}

/* @ngInject */
function config($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            views: {
                'header@': {
                    templateUrl: 'home/header.html'
                    //controller: 'HomeHeaderController'
                },
                'contents@': {
                    templateUrl: 'home/home.html',
                    controller: 'HomeController'
                },
                'footer@': {
                    templateUrl: 'home/footer.html'
                    //controller: 'HomeHeaderController'
                    //FIXME: controller: HideFooterController?
                    //FIXME: onEnter: showFooter?
                    //FIXME: onExit: hideFooter?
                }
            }
        });
}

module.exports = angular.module('myApp.home', [])
    .config(config)
    .controller('HomeController', HomeController)
    .controller('HomeHeaderController', HomeHeaderController);

