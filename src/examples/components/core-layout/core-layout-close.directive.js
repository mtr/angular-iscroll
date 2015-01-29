'use strict';

var angular = require('angular');
//_ = require('lodash');

/* @ngInject */
function coreLayoutClose($state, $log, coreLayoutService) {
    function _link(scope, element, attrs) {
        element.on('click', function _close() {
            $state.go(coreLayoutService.state[scope.name].closeTargetState);
        });
    }

    return {
        link: _link,
        scope: {
            name: '@coreLayoutClose'
        }
    };
}

module.exports = angular
    .module('coreLayoutClose.directive', ['ui.router'])
    .directive('coreLayoutClose', coreLayoutClose);
