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
                'main-header@': {
                    templateUrl: 'components/header/header.html',
                    controller: 'HeaderController'
                },
                'main-contents@': {
                    templateUrl: 'home/home.html',
                    controller: 'HomeController'
                },
                'main-footer@': {
                    templateUrl: 'home/login-or-register.footer.html'
                }
            }
        })
        .state('home.modal.signIn', {
            url: '/signIn',
            views: {
                'modal-contents@': {
                    templateUrl: 'home/login.html'
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
