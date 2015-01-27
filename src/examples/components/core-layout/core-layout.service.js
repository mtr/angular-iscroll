'use strict';

var angular = require('angular');

/* @ngInject */
function CoreLayoutService($rootScope) {
    var _state = {
        /* Different state variables are assigned by core-layout directive
         * instances. */
    };

    function _openModal() {
        _state.modal.show = true;
    }

    function _closeModal() {
        /* FIXME:  Should perhaps take an optional set of classes to add on the
         * surrounding core-layout element, like 'visible-xs-block',
         * 'hidden-xs hidden-sm', etc.
         * NOTE:  Theres should probably be configurable
         * 'all', 'header', 'contents', and 'footer' add/remove classes,
          * since whether to show, e.g., the footer might depend on
          * the screen size.
         */
        _state.modal.show = false;
    }

    $rootScope.coreLayout = _state;

    return {
        state: _state,
        openModal: _openModal,
        closeModal: _closeModal
    };
}

module.exports = angular
    .module('coreLayout.service', [])
    .factory('coreLayoutService', CoreLayoutService);
