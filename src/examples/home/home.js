'use strict';

var angular = require('angular');

/* @ngInject */
function HomeController($scope, $log, iScrollService) {
    $scope.iScrollState = iScrollService.state;
    $scope.toggleIScroll = iScrollService.toggle;
}

/* @ngInject */
function config($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            views: {
                'header@': {
                    templateUrl: 'components/header/header.html',
                    controller: 'HeaderController'
                },
                'contents@': {
                    templateUrl: 'home/home.html',
                    controller: 'HomeController'
                },
                'footer@': {
                    templateUrl: 'home/login-or-register.footer.html'
                }
            }
        })
        .state('home.modal.signIn', {
            url: '/signIn',
            views: {
                'header': {
                    templateUrl: 'components/core-layout/core-layout.modal.header.html'
                },
                'contents': {
                    templateUrl: 'home/login.html'
                },
                'footer': {
                    templateUrl: 'components/core-layout/core-layout.modal.footer.html'
                }

            },
            onEnter: /* @ngInject */ function _openModal(coreLayoutService) {
                coreLayoutService.openModal();
            },
            onExit: /* @ngInject */ function _closeModal(coreLayoutService) {
                coreLayoutService.closeModal();
            }
        });
}

module.exports = angular.module('myApp.home', [])
    .config(config)
    .controller('HomeController', HomeController);
