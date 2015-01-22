'use strict';

var angular = require('angular');

/* @ngInject */
function CoreLayoutService() {
    var _layout = {
        showHeader: true,
        showFooter: true
    };

    return {
        layout: _layout
    };
}

module.exports = angular
    .module('MyApp.coreLayout.service', [])
    .factory('coreLayoutService', CoreLayoutService);
