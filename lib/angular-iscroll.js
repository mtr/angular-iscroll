/**
 * @license angular-iscroll v0.5.1, 2015-01-22T21:46:11+0100
 * (c) 2015 Martin Thorsen Ranang <mtr@ranang.org>
 * License: MIT
 */
;(function (window) {
'use strict';

var IScroll = require('iscroll');

var signals = {
    disabled: 'iscroll:disabled',
    enabled: 'iscroll:enabled'
};

var classes = {
    on: 'iscroll-on',
    off: 'iscroll-off'
};

/* @ngInject */
function iScrollService($rootScope, $log, iScrollSignals) {
    var _state = {
        useIScroll: true
    };

    function _disable(signalOnly) {
        if (!signalOnly) {
            _state.useIScroll = false;
        }
        //$log.debug('emit(iScrollSignals.disabled)', iScrollSignals.disabled);
        $rootScope.$emit(iScrollSignals.disabled);
    }

    function _enable(signalOnly) {
        if (!signalOnly) {
            _state.useIScroll = true;
        }
        //$log.debug('emit(iScrollSignals.enabled)', iScrollSignals.enabled);
        $rootScope.$emit(iScrollSignals.enabled);
    }

    function _toggle(signalOnly) {
        (_state.useIScroll ^ signalOnly) ?  // XOR
            _disable(signalOnly) : _enable(signalOnly);
    }

    $rootScope.$on(iScrollSignals.disabled, function _disabledIScroll() {
        //$log.debug('on(iScrollSignals.disabled)', iScrollSignals.disabled);
    });

    $rootScope.$on(iScrollSignals.enabled, function _enabledIScroll() {
        //$log.debug('on(iScrollSignals.enabled)', iScrollSignals.enabled);
    });

    return {
        state: _state,
        enable: _enable,
        disable: _disable,
        toggle: _toggle
    };
}
iScrollService.$inject = ["$rootScope", "$log", "iScrollSignals"];

function _call(functor) {
    functor();
}

/* @ngInject */
function iscroll($rootScope, $timeout, $log, iScrollSignals, iScrollService) {
    /* The different options for iScroll are explained in detail at
     http://iscrolljs.com/#configuring */
    var defaults = {
        iScroll: {
            momentum: true,
            mouseWheel: true
        },
        directive: {
            /* Delay, in ms, before we asynchronously perform an
               iScroll.refresh().  If false, then no async refresh is
               performed. */
            asyncRefreshDelay: 0
        }
    };

    function _createInstance(scope, element, attrs, options) {
        var instance = new IScroll(element[0], options.iScroll);

        element.removeClass(classes.off).addClass(classes.on);

        if (angular.isDefined(attrs.iscrollInstance)) {
            scope.iscrollInstance = instance;
        }

        if (options.directive.asyncRefreshDelay !== false) {
            $timeout(function _refreshAfterInitialRender() {
                instance.refresh();
            }, options.directive.asyncRefreshDelay);
        }

        function _destroyInstance() {
            if (angular.isDefined(scope.iscrollInstance)) {
                delete scope.iscrollInstance;
            }
            instance.destroy();

            element.removeClass(classes.on).addClass(classes.off);
            // Remove element's CSS transition values:
            element.children('.iscroll-scroller').attr('style', null);

            angular.forEach(signalListeners, _call);
            //$log.debug('angular-iscroll: destroyInstance');
        }

        var signalListeners = [
            $rootScope.$on(iScrollSignals.disabled, _destroyInstance),
            scope.$on('$destroy', _destroyInstance)
        ];

        return instance;
    }

    function _link(scope, element, attrs) {
        var options = {
            iScroll: angular.extend({}, scope.iscroll || {}, defaults.iScroll),
            directive: {}
        };

        angular.forEach(options.iScroll, function _extractOptions(value, key) {
                if (defaults.directive.hasOwnProperty(key)) {
                    options.directive[key] = value;
                    delete options.iScroll[key];
                }
            }
        );

        function _init() {
            if (!element.hasClass(classes.on)) {
                _createInstance(scope, element, attrs, options);
            }
        }

        var enableHandlers = [$rootScope.$on(iScrollSignals.enabled, _init)];

        function _removeEnableHandlers() {
            angular.forEach(enableHandlers, _call);
            //$log.debug('angular-iscroll: removeEnableHandlers');
        }

        if (iScrollService.state.useIScroll) {
            _init();
        } else {
            element.removeClass(classes.on).addClass(classes.off);
        }

        scope.$on('$destroy', _removeEnableHandlers);
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
iscroll.$inject = ["$rootScope", "$timeout", "$log", "iScrollSignals", "iScrollService"];

var angularIscroll = angular.module('angular-iscroll', [])
    .directive('iscroll', iscroll)
    .factory('iScrollService', iScrollService)
    .constant('iScrollSignals', signals);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = angularIscroll;
} else {
    window.angularIscroll = angularIscroll;
}
})(window);
