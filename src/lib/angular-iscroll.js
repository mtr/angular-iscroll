'use strict';

function iscroll($timeout, $log) {
    function _link(scope, element, attrs) {
        $log.debug('angular-iscroll.js:5:iscroll._link._link:');
    }

    return {
        restrict: 'A',
        link: _link
    }
}

var angularIscroll = angular.module('angular-iscroll', [])
    .directive('iscroll', iscroll);

if ( typeof module !== 'undefined' && module.exports ) {
	module.exports = angularIscroll;
} else {
	window.angularIscroll = angularIscroll;
}
