'use strict';

var angular = require('angular');

/* @ngInject */
function config($stateProvider) {
    $stateProvider.state('demos', {
        url: '/demos',
        abstract: true,
        views: {
            'header@': {
                templateUrl: 'components/header/header.html',
                controller: 'HeaderController'
            },
            'footer@': {
                templateUrl: 'components/footer/footer.html'
            }
        }
    });
}

module.exports = angular.module('myApp.demos', [
    require('./static-list/static-list.js').name,
    require('./ng-repeat-list/ng-repeat-list.js').name,
    require('./multi-column-dynamic/multi-column-dynamic.js').name
])
    .config(config);
