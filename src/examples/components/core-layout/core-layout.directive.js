'use strict';

var angular = require('angular'),
    _ = require('lodash');

var defaultsDeep = _.partialRight(_.merge, function deep(value, other) {
    return _.merge(value, other, deep);
});

var suffixes = {
    all: '',
    xs: '-xs',
    sm: '-sm',
    md: '-md',
    lg: '-lg'
};

function _createSizeSettings(options) {
    options = options || {};
    return {
        all: options.all || false,
        xs: options.xs || false,
        sm: options.sm || false,
        md: options.md || false,
        lg: options.lg || false
    };
}

function _trueKeys(result, value, key) {
    if (value === true) {
        result.push(key);
    }
    return result;
}

/* @ngInject */
function coreLayout($rootScope, $log, coreLayoutService) {
    var defaults = {
        show: true,
        header: {
            visible: _createSizeSettings(),
            hidden: _createSizeSettings()
        },
        footer: {
            visible: _createSizeSettings(),
            hidden: _createSizeSettings()
        }
        },
        cache = {};

    function _addWatcher(attrs, name, area, visibility) {
        var group = name + '.' + area + '.' + visibility;

        $rootScope.$watchCollection('coreLayout.' + group,
            function _updateClasses(newValue) {
                /**
                 * In lodash v3.0.0, it should be possible to reduce the
                 * following _.reduce() statement to
                 *
                 *   var sizes = _.invert(newValue, true).true;
                 *
                 * by supplying the multiValue flag to _.invert():
                 **/
                var sizes = _.reduce(newValue, _trueKeys, []),
                    current = cache[group] || [],
                    classPrefix = 'cl-' + area + '-' + visibility,
                    layoutChanged = false;

                _.each(_.difference(sizes, current), function _addClass(size) {
                    attrs.$addClass(classPrefix + suffixes[size]);
                    layoutChanged = true;
                });

                _.each(_.difference(current, sizes), function _removeClass(size) {
                    attrs.$removeClass(classPrefix + suffixes[size]);
                    layoutChanged = true;
                });

                if (layoutChanged) {
                    coreLayoutService.layoutChanged(name);
                }

                cache[group] = sizes;
            });
    }

    function _link(scope, element, attrs) {
        var options = defaultsDeep({}, scope.options, defaults),
            name = options.name;

        delete options.name;

        scope.names = {
            header: name + '-header',
            contents: name + '-contents',
            footer: name + '-footer'
        };

        coreLayoutService.state[name] = options;

        attrs.$addClass('core-layout');

        var deregistrators = [
            _addWatcher(attrs, name, 'header', 'visible'),
            _addWatcher(attrs, name, 'header', 'hidden'),
            _addWatcher(attrs, name, 'footer', 'visible'),
            _addWatcher(attrs, name, 'footer', 'hidden')
        ];

        scope.$on('$destroy', function _deregister() {
            _.each(deregistrators, function _deregister(deregistrator) {
                deregistrator();
            })
        });
    }

    return {
        link: _link,
        scope: {
            options: '=coreLayout'
        },
        templateUrl: 'components/core-layout/core-layout.html'
    };
}

module.exports = angular
    .module('coreLayout.directive', ['ui.router'])
    .directive('coreLayout', coreLayout);
