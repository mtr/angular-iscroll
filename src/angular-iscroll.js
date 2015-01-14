'use strict';

function iscroll($timeout, $log) {
    function _link(scope, element, attrs) {
        $log.debug('angular-iscroll.js:5:iscroll._link._link: ');
    }

    return {
        restrict: 'A',
        link: _link
    }
}

angular.module('angular-iscroll', [])
    .directive('iscroll', iscroll);
