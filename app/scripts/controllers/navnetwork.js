'use strict';

/**
 * @ngdoc function
 * @name globiProtoApp.controller:NavnetworkCtrl
 * @description
 * # Controller for network version of the top navigation bar.
 * Controller of the globiProtoApp
 */
angular.module('globiProtoApp')
  .controller('NavNetworkCtrl', function ($scope, $state) {

    $scope.currentTaxon = $state.params.sourceTaxon;

    $scope.$on('$stateChangeSuccess', function(event, toState) {
      $scope.state = toState.name;
    });

    $scope.explore = function(evt) {
      evt.preventDefault();
      $state.transitionTo('main', {
        sourceTaxon: $state.params.sourceTaxon,
        interactionType: $state.params.interactionType
      }, {location: true, reload: true});
    };

  });
