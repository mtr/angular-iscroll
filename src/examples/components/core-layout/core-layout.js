'use strict';

var angular = require('angular');

module.exports = angular
    .module('coreLayout', [
        require('./core-layout.controller.js').name,
        require('./core-layout.modal.js').name,
        require('./core-layout.service.js').name,
        require('./core-layout.directive.js').name
    ]);
