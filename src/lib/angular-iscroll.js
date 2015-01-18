'use strict';

var IScroll = require('iscroll');

function iscroll($timeout, $log) {
    var _defaultOptions = {
        snap: true,
        momentum: true,
        hScrollbar: false,
        mouseWheel: true,
        on: []
    };

    function _link(scope, element, attrs) {
        $log.debug('angular-iscroll.js:5:iscroll._link._link:');


        //var iScroll = new IScroll(element[0], _defaultOptions);
        var iScroll = new IScroll(element[0]);

        $log.debug('iScroll', iScroll);
        $log.debug('element', element);
    }

    return {
        restrict: 'A',
        link: _link
    }
}

var angularIscroll = angular.module('angular-iscroll', [])
    .directive('iscroll', iscroll);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = angularIscroll;
} else {
    window.angularIscroll = angularIscroll;
}
