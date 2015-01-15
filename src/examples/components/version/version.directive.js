'use strict';

var angular = require('angular');

/* @ngInject */
function currentVersion($log, version, buildTimestamp) {
    function _link(scope, element, attrs) {
        $log.debug('directiveDefinition.name', directiveDefinition.name);
        $log.debug('attrs[directiveDefinition.name]', attrs[directiveDefinition.name]);

        element.text(attrs[directiveDefinition.name] === 'full' ?
        version + ' (' + buildTimestamp + ')' : version);
    }

    var directiveDefinition = {
        link: _link
    };

    return directiveDefinition;
}

module.exports = angular.module('myApp.version.directive', [])
    .directive('currentVersion', currentVersion);
