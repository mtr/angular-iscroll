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
                    templateUrl: 'home/open-modal.footer.html'
                }
            }
        })
        .state('home.modal', {
            url: 'modal',
            abstract: true,
            views: {
                'modal-header@': {
                    templateUrl: 'components/core-layout/core-layout.modal.header.html'
                },
                'modal-footer@': {
                    templateUrl: 'components/core-layout/core-layout.modal.footer.html'
                }
            },
            onEnter: /* @ngInject */ function _openModal(coreLayoutService) {
                console.log('modal.onEnter');
                coreLayoutService.openModal({
                    header: {visible: {all: true}},
                    footer: {visible: {all: true}},
                    closeTargetState: 'home'
                });
            },
            onExit: /* @ngInject */ function _closeModal(coreLayoutService) {
                console.log('modal.onExit');
                coreLayoutService.closeModal({
                    closeTargetState: null
                });
            }
        })
        .state('home.modal.first', {
            url: '/first',
            views: {
                'modal-contents@': {
                    templateUrl: 'home/first.modal.html',
                    controller: 'HomeController'
                },
                'modal-footer@': {
                    templateUrl: 'home/first.modal.footer.html'
                }
            }
        })
        .state('home.modal.second', {
            url: '/second',
            views: {
                'modal-contents@': {
                    templateUrl: 'home/second.modal.html'
                }
            },
            onEnter: /* @ngInject */ function _openModal(coreLayoutService) {
                coreLayoutService.updateModal({
                    header: {visible: {all: false, xs: true}}
                });
            },
            onExit: /* @ngInject */ function _closeModal(coreLayoutService) {
                coreLayoutService.updateModal({
                    //header: {visible: {all: true, xs: false}}
                });
            }
        }
    );
}

module.exports = angular.module('myApp.home', [])
    .config(config)
    .controller('HomeController', HomeController);
