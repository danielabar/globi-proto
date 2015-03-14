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

    var buildMarkers = function(data) {
      var result = {};
      var allMarkers = data.map(function(item) {
        var obj = {
          lat: item.latitude,
          lng: item.longitude,
          message: item.study,
          focus: true,
          draggable: false
        };
        return obj;
      });
      // TODO Filter by unique lat/lng/msg and keep count of how many of each and modify message accordingly
      for(var i=0; i<allMarkers.length; i++) {
        if (allMarkers[i].lat && allMarkers[i].lng) {
          result['marker'+i] = allMarkers[i];
        }
      }
      return result;
    };

    taxonInteractionDetails.query({
      interactionType: $state.params.interactionType,
      sourceTaxon: $state.params.sourceTaxon,
      targetTaxon: $state.params.targetTaxon
    }, function(response) {
      $scope.markers = buildMarkers(response);
      // TODO calc center based on avg lat and lng of markers
      // TODO If no markers found - display error and/or redirect back to Learn
    }, function(err) {
      console.dir(err);
    });

    $scope.center = {
        lat: 45,
        lng: 18,
        zoom: 2
    };

    // $scope.markers = {
    //   osloMarker: {
    //     lat: 45,
    //     lng: 18,
    //     // message: "I want to travel here!",
    //     focus: true,
    //     draggable: false
    //   }
    // };

  });
