'use strict';

var angular = require('angular'),
    _ = require('lodash');


/* @ngInject */
function CoreLayoutService($rootScope, $log, iScrollService) {
    var _state = {
        /**
         * Different state variables are assigned by core-layout directive
         * instances.
         **/
    };

    function _mergeStateIfProvided(configChanges) {
        if (angular.isDefined(configChanges)) {
            _.merge(_state.modal, configChanges);
        }
    }

    function _openModal(configChanges) {
        _mergeStateIfProvided(configChanges);
        _state.modal.show = true;
    }

    function _updateModal(configChanges) {
        _mergeStateIfProvided(configChanges);
    }

    function _closeModal(configChanges) {
        _state.modal.show = false;
        _mergeStateIfProvided(configChanges);
    }

    function _layoutChanged(name) {
        iScrollService.refresh(name);
    }

    $rootScope.coreLayout = _state;

    return {
        state: _state,
        openModal: _openModal,
        updateModal: _updateModal,
        closeModal: _closeModal,
        layoutChanged: _layoutChanged
    };
}

module.exports = angular
    .module('coreLayout.service', [])
    .factory('coreLayoutService', CoreLayoutService);
