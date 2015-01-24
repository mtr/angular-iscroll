'use strict';

var angular = require('angular'),
    _ = require('lodash');

/* @ngInject */
function coreLayout($log, coreLayoutService) {
    var defaults = {
        show: true,
        showHeader: true,
        showFooter: true
    };

    function _link(scope, element, attrs) {
        var options = _.defaults({}, scope.options, defaults),
            name = options.name;

        delete options.name;

        coreLayoutService.state[name] = options;

        scope.state = options;

        element.addClass('core-layout');
        //if (! options.show) {
        //    element.addClass('ng-hide');
        //}

        scope.coreLayout = coreLayoutService.state;
    }
    
    return {
        link: _link,
        scope: {
            options: '=coreLayout'
        },
        templateUrl: 'components/core-layout/core-layout.html'
    };
}

module.exports = angular
    .module('coreLayout.directive', ['ui.router'])
    .directive('coreLayout', coreLayout);
