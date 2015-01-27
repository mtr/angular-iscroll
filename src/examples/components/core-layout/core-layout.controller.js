'use strict';

var angular = require('angular');

/* @ngInject */
function CoreLayoutController($scope, $log, coreLayoutService) {
    $log.debug('core-layout.controller.js:7:CoreLayoutController.CoreLayoutController: ');
}

module.exports = angular
    .module('coreLayout.controller', [])
    .controller('CoreLayoutController', CoreLayoutController);
