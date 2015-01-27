'use strict';

var angular = require('angular');

/* @ngInject */
function NgRepeatListController($scope, $log) {
    var _index = {};

    function _getRows(count) {
        if (! _index.hasOwnProperty(count)) {
            _index[count] = new Array(count);
        }
        return _index[count];
    }

    $scope.getRows = _getRows;
}

/* @ngInject */
function config($stateProvider) {
    $stateProvider.state('demos.ngRepeatList', {
        url: '/ngRepeatList',
        views: {
            'main-contents@': {
                templateUrl: 'demos/ng-repeat-list/ng-repeat-list.html',
                controller: 'NgRepeatListController'
            }
        }
    });
}

module.exports = angular.module('myApp.demos.ngRepeatList', [])
    .config(config)
    .controller('NgRepeatListController', NgRepeatListController);
