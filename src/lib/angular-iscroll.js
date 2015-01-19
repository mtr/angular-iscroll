'use strict';

var IScroll = require('iscroll');

function iscroll($timeout, $log) {
    /* The different options for iScroll are explained in detail at
       http://iscrolljs.com/#configuring */
    var defaultIScrollOptions = {
        momentum: true,
        mouseWheel: true
    };

    var defaultDirectiveOptions = {
        /* Delay, in ms, before we asynchronously perform an iScroll.refresh().
           If false, then no async refresh is performed. */
        asyncRefreshDelay: 0
    };

    function _link(scope, element, attrs) {
        var options = angular.extend({}, scope.iscroll || {}, defaultIScrollOptions),
            directiveOptions = {};

        angular.forEach(options, function _extractDirectiveOptions(value, key) {
            if (defaultDirectiveOptions.hasOwnProperty(key)) {
                directiveOptions[key] = value;
                delete options[key];
            }
        });

        var instance = new IScroll(element[0], options);

        if (angular.isDefined(attrs.iscrollInstance)) {
            scope.iscrollInstance = instance;
        }

        if (directiveOptions.asyncRefreshDelay !== false) {
            $timeout(function _refreshAfterInitialRender() {
                instance.refresh();
            }, directiveOptions.asyncRefreshDelay);
        }

        scope.$on('$destroy', function _destroyScope() {
            instance.destroy();
        });
    }

    return {
        restrict: 'A',
        link: _link,
        scope: {
            iscroll: '=',
            iscrollInstance: '='
        }
    }
}

var angularIscroll = angular.module('angular-iscroll', [])
    .directive('iscroll', iscroll);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = angularIscroll;
} else {
    window.angularIscroll = angularIscroll;
}
