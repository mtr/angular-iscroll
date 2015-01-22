'use strict';

var angular = require('angular');

module.exports = angular
    .module('MyApp.coreLayout', [
        require('./core-layout.service.js').name
    ]);

