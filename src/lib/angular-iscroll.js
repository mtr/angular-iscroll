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

    function iScrollServiceProvider() {
        var defaultOptions = {
            iScroll: {
                /**
                 * The different options for iScroll are explained in
                 * detail at http://iscrolljs.com/#configuring
                 **/
                momentum: true,
                mouseWheel: true
            },
            directive: {
                /**
                 * Delay, in ms, before we asynchronously perform an
                 * iScroll.refresh().  If false, then no async refresh is
                 * performed.
                 **/
                asyncRefreshDelay: 0,
                /**
                 * Delay, in ms, between each iScroll.refresh().  If false,
                 * then no periodic refresh is performed.
                 **/
                refreshInterval: false
            }
        };

        function _configureDefaults(options) {
            angular.extend(defaultOptions, options);
        }
        this.configureDefaults = _configureDefaults;
        function _getDefaults() {
            return defaultOptions;
        }
        this.getDefaults = _getDefaults;

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

            return {
                defaults: defaultOptions,
                state: _state,
                enable: _enable,
                disable: _disable,
                toggle: _toggle,
                refresh: _refresh
            };
        }

        this.$get = iScrollService;
    }

    function _call(functor) {
        functor();
    }

    /* @ngInject */
    function iscroll($rootScope, $timeout, $interval, $log, iScrollSignals,
                     iScrollService) {

        function asyncRefresh(instance, options) {
            $timeout(function _refreshAfterInitialRender() {
                instance.refresh();
            }, options.directive.asyncRefreshDelay);
        }

        function _createInstance(scope, element, attrs, options) {
            var instance = new IScroll(element[0], options.iScroll),
                refreshEnabled = true;

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
                if (refreshEnabled) {
                    refreshEnabled = false;
                    asyncRefresh(instance, options);
                    refreshEnabled = true;
                }
            }

            function _disableRefresh() {
                refreshEnabled = false;
            }

            function _enableRefresh() {
                refreshEnabled = true;
            }

            instance.on('scrollStart', _disableRefresh);
            instance.on('scrollEnd', _enableRefresh);

            if (options.directive.refreshInterval !== false) {
                $interval(_refreshInstance, options.directive.refreshInterval);
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
                iScroll: angular.extend({}, scope.iscroll.iScroll || {},
                    iScrollService.defaults.iScroll),
                directive: angular.extend({}, scope.iscroll.directive || {},
                    iScrollService.defaults.directive)
            };

            angular.forEach(options.iScroll,
                function _extractOptions(value, key) {
                    if (iScrollService.defaults.directive.hasOwnProperty(key)) {
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

    return angular.module('angular-iscroll', [])
        .directive('iscroll', iscroll)
        .provider('iScrollService', iScrollServiceProvider)
        .constant('iScrollSignals', signals);
}));

