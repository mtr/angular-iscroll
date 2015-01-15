'use strict';

var angular = require('angular');

/* @ngInject */
function currentVersion($log, version, buildTimestamp) {
    function _link(scope, element, attrs) {
        $log.debug('directiveDefinition.name', directiveDefinition.name);
        $log.debug('attrs[directiveDefinition.name]', attrs[directiveDefinition.name]);

        var text;
        if (attrs[directiveDefinition.name] === 'full') {
            text = version + ' (' + buildTimestamp + ')';
        } else {
            text = version;
        }
        element.text(text);
    }

    var directiveDefinition = {
        link: _link
    };

    return directiveDefinition;
}

module.exports = angular.module('myApp.version.directive', [])
    .directive('currentVersion', currentVersion);
