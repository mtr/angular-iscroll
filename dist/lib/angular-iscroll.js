/**
 * @license angular-iscroll v3.1.0, 2016-01-22T22:29:52+0100
 * (c) 2016 Martin Thorsen Ranang <mtr@ranang.org>
 * License: MIT
 */
(function (root, factory) {
    // Using the Universal Module Definition pattern from
    // https://github.com/umdjs/umd/blob/master/returnExports.js
    if (typeof define === 'function' && define.amd) {
        define(['iscroll', 'platform'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('iscroll'), require('platform'));
    } else {
        // Browser globals (root is window)
        root.angularIscroll = factory(root.IScroll, root.platform);
    }
}(this, function (IScroll, platform) {
    'use strict';

    var signals = {
            disabled: 'iscroll:disabled',
            enabled: 'iscroll:enabled',
            refresh: 'iscroll:refresh'
        },
        classes = {
            on: 'iscroll-on',
            off: 'iscroll-off'
        },
        iScrollEvents = [
            'beforeScrollStart',
            'scrollCancel',
            'scrollStart',
            'scroll',
            'scrollEnd',
            'flick',
            'zoomStart',
            'zoomEnd'
        ],
        iScrollEventHandlerMap = {},
        minIOSMajorVersion = 7,
        useNativeScroll = _useNativeScroll();

    function _osVersion() {
        var v = (platform.os.version).match(/(\d+).(\d+).?(\d+)?/);
        return [
            parseInt(v[1], 10),
            parseInt(v[2], 10),
            parseInt(v[3] || 0, 10)
        ];
    }

    function _isChromeMobile() {
        return platform.name === 'Chrome Mobile';
    }

    function _useNativeScroll() {
        if (platform.name === 'Opera Mini') {
            return false;
        }

        switch (platform.os.family) {
            case 'Android':
                // In Chrome we trust.
                return _isChromeMobile();
            case 'iOS':
                // Buggy handling in older iOS versions.
                return _osVersion()[0] > minIOSMajorVersion;
            default:
                // Assuming desktop or other browser.
                return true;
        }
    }

    /**
     * Add handler name to event name mapping.
     *
     * Please note that the 'scroll' event is only available when using
     * iscroll-probe.js (for example, through angular-iscroll-probe).
     *
     * For example, the handler for the 'scrollEnd' event can be configured
     * by supplying the onScrollEnd option.
     **/
    angular.forEach(iScrollEvents, function _addPair(event) {
        this['on' + _capitalizeFirst(event)] = event;
    }, iScrollEventHandlerMap);

    function _capitalizeFirst(str) {
        return str.substring(0, 1).toLocaleUpperCase() + str.substring(1);
    }

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
                 * Whether or not to initially enable the use of iScroll.
                 *
                 * The `useNativeScroll` flag is automatically determined
                 * by running _useNativeScroll();
                 **/
                initiallyEnabled: !useNativeScroll,
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
                refreshInterval: false,
                /**
                 * If `false`, skip `$digest()` cycle on iScroll.refresh().
                 */
                invokeApply: false
                /**
                 * Event handler options are added below.
                 **/
            }
        };

        angular.forEach(iScrollEventHandlerMap, function _default(event, handler) {
            this[handler] = undefined;
        }, defaultOptions.directive);

        function _configureDefaults(options) {
            /**
             * Since angular.extend is not performing a "deep" merge, we'll
             * do it in two steps.
             **/
            if (angular.isDefined(options.directive)) {
                angular.extend(defaultOptions.directive, options.directive);
            }
            if (angular.isDefined(options.iScroll)) {
                angular.extend(defaultOptions.iScroll, options.iScroll);
            }
        }

        // Export the auto-determined value of `useNativeScroll`.
        this.useNativeScroll = useNativeScroll;
        this.platform = platform;

        this.configureDefaults = _configureDefaults;
        function _getDefaults() {
            return defaultOptions;
        }

        //noinspection JSUnusedGlobalSymbols
        this.getDefaults = _getDefaults;

        /* @ngInject */
        function iScrollService($rootScope, iScrollSignals) {
            var _state = {
                useIScroll: defaultOptions.directive.initiallyEnabled,
                autoDetectedUseNativeScroll: useNativeScroll
            };

            function _disable(signalOnly) {
                if (!signalOnly) {
                    _state.useIScroll = false;
                }
                //$log.debug('emit(iScrollSignals.disabled)',
                //    iScrollSignals.disabled);
                $rootScope.$emit(iScrollSignals.disabled);
            }

            function _enable(signalOnly) {
                if (!signalOnly) {
                    _state.useIScroll = true;
                }
                //$log.debug('emit(iScrollSignals.enabled)',
                //    iScrollSignals.enabled);
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
        iScrollService.$inject = ["$rootScope", "iScrollSignals"];

        //noinspection JSUnusedGlobalSymbols
        this.$get = iScrollService;
    }

    function _call(functor) {
        functor();
    }

    /* @ngInject */
    function iscroll($rootScope, $timeout, $interval, iScrollSignals,
                     iScrollService) {
        function asyncRefresh(instance, options) {
            $timeout(function _refreshAfterInitialRender() {
                instance.refresh();
            }, options.directive.asyncRefreshDelay, options.directive.invokeApply);
        }

        function _createInstance(scope, element, attrs, options) {
            var instance = new IScroll(element[0], options.iScroll),
                refreshEnabled = true,
                refreshInterval = null;

            angular.forEach(iScrollEventHandlerMap,
                function _addHandler(event, option) {
                    if (angular.isDefined(options.directive[option])) {
                        instance.on(event, options.directive[option]);
                    }
                });

            element.removeClass(classes.off).addClass(classes.on);

            if (angular.isDefined(attrs.iscrollInstance)) {
                scope.iscrollInstance = instance;
            }

            if (options.directive.asyncRefreshDelay !== false) {
                asyncRefresh(instance, options);
            }

            function _destroyInstance() {
                if (refreshInterval !== null) {
                    $interval.cancel(refreshInterval);
                }

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
                    //noinspection JSUnusedAssignment
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
                refreshInterval = $interval(_refreshInstance,
                    options.directive.refreshInterval, 0, options.directive.invokeApply);
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
                iScroll: angular.extend({}, scope.iscroll || {},
                    iScrollService.defaults.iScroll),
                directive: angular.extend({}, iScrollService.defaults.directive)
            };

            angular.forEach(options.iScroll,
                function _extractOptions(value, key) {
                    if (iScrollService.defaults.directive.hasOwnProperty(key) ||
                        iScrollEventHandlerMap.hasOwnProperty(key)) {
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
        };
    }
    iscroll.$inject = ["$rootScope", "$timeout", "$interval", "iScrollSignals", "iScrollService"];

    return angular.module('angular-iscroll', [])
        .directive('iscroll', iscroll)
        .provider('iScrollService', iScrollServiceProvider)
        .constant('iScrollSignals', signals);
}));


