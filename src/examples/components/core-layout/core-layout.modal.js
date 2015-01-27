'use strict';

var angular = require('angular');

/* @ngInject */
function config($stateProvider) {
    console.log('core-layout.modal.js:7:config.config: ');
    $stateProvider.state('home.modal', {
        url: 'modal',
        abstract: true,
        views: {
            'modal-header@': {
                templateUrl: 'components/core-layout/core-layout.modal.header.html'
            },
            'modal-footer@': {
                templateUrl: 'components/core-layout/core-layout.modal.footer.html'
            }

        }
    });
}

module.exports = angular.module('coreLayout.modal', [])
    .config(config);
