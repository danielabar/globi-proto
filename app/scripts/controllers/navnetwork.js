'use strict';

/**
 * @ngdoc function
 * @name globiProtoApp.controller:NavnetworkCtrl
 * @description
 * # NavnetworkCtrl
 * Controller of the globiProtoApp
 */
angular.module('globiProtoApp')
  .controller('NavNetworkCtrl', function ($scope, $state) {

    $scope.currentTaxon = $state.params.taxon;

    $scope.$on('$stateChangeSuccess', function(event, toState) {
      $scope.state = toState.name;
    });

    $scope.explore = function(evt) {
      evt.preventDefault();
      $state.transitionTo('main', {
        name: $state.params.taxon, interaction: $state.params.interaction
      }, {location: true, reload: true});
    };

  });
