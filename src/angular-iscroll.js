'use strict';

function iscroll($timeout, $log) {
    function _link(scope, element, attrs) {

    }

    return {
        restrict: 'A',
        link: _link
    }
}

angular.module('iscroll', [])
    .directive('iscroll', iscroll);
