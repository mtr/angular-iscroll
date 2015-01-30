/**
 * @license angular-iscroll v0.5.1, 2015-01-30T10:24:08+0100
 * (c) 2015 Martin Thorsen Ranang <mtr@ranang.org>
 * License: MIT
 */
(function (root, factory) {
    // Using the Universal Module Definition pattern from
    // https://github.com/umdjs/umd/blob/master/returnExports.js
    if (typeof define === 'function' && define.amd) {
        define(['iscroll'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('iscroll'));
    } else {
        // Browser globals (root is window)
        root.angularIscroll = factory(root.IScroll);
    }
}(this, function (IScroll) {
    'use strict';

    var signals = {
        disabled: 'iscroll:disabled',
        enabled: 'iscroll:enabled',
        refresh: 'iscroll:refresh'
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

        function _refresh(name) {
            // The name parameter is not really used for now.
            $rootScope.$emit(iScrollSignals.refresh, name);
        }

        //$rootScope.$on(iScrollSignals.disabled, function _disabledIScroll() {
        //    $log.debug('on(iScrollSignals.disabled)', iScrollSignals.disabled);
        //});
        //
        //$rootScope.$on(iScrollSignals.enabled, function _enabledIScroll() {
        //    $log.debug('on(iScrollSignals.enabled)', iScrollSignals.enabled);
        //});

        return {
            state: _state,
            enable: _enable,
            disable: _disable,
            toggle: _toggle,
            refresh: _refresh
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

        function asyncRefresh(instance, options) {
            $timeout(function _refreshAfterInitialRender() {
                instance.refresh();
            }, options.directive.asyncRefreshDelay);
        }

        function _createInstance(scope, element, attrs, options) {
            var instance = new IScroll(element[0], options.iScroll);

            element.removeClass(classes.off).addClass(classes.on);

            if (angular.isDefined(attrs.iscrollInstance)) {
                scope.iscrollInstance = instance;
            }

            if (options.directive.asyncRefreshDelay !== false) {
                asyncRefresh(instance, options);
            }

            function _destroyInstance() {
                if (angular.isDefined(scope.iscrollInstance)) {
                    delete scope.iscrollInstance;
                }
                instance.destroy();

                element.removeClass(classes.on).addClass(classes.off);
                // Remove element's CSS transition values:
                element.children('.iscroll-scroller').attr('style', null);

                angular.forEach(deregistrators, _call);
                //$log.debug('angular-iscroll: destroyInstance');
            }

            function _refreshInstance() {
                asyncRefresh(instance, options);
            }

            var deregistrators = [
                $rootScope.$on(iScrollSignals.disabled, _destroyInstance),
                $rootScope.$on(iScrollSignals.refresh, _refreshInstance),
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

    return angularIscroll;
}));

