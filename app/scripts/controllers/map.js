'use strict';

/**
 * @ngdoc function
 * @name globiProtoApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the globiProtoApp
 */
angular.module('globiProtoApp')
  .controller('MapCtrl', function ($scope, $state, taxonInteractionDetails) {

    taxonInteractionDetails.get({
      sourceTaxon: $state.params.sourceTaxon,
      targetTaxon: $state.params.targetTaxon,
      interactionType: $state.params.interactionType
    }, function(data) {
      // TODO find unique markers (bring in angular underscore?)
      // TOOD build markers (eventually custom template with citation & link to study if exists)
      // TODO calc center based on avg lat and lng of markers
      // TODO If no markers found - display error
      console.dir(data);
    }, function(err) {
      console.dir(err);
    });

    $scope.center = {
        lat: 45,
        lng: 18,
        zoom: 8
    };

    $scope.markers = {
      osloMarker: {
        lat: 45,
        lng: 18,
        // message: "I want to travel here!",
        focus: true,
        draggable: false
      }
    };

  });
