'use strict';

// http://leafletjs.com/examples/quick-start.html
// http://leaflet-extras.github.io/leaflet-providers/preview/index.html

/**
 * @ngdoc directive
 * @name globiProtoApp.directive:interactionMap
 * @description
 * # interactionMap
 */
angular.module('globiProtoApp')
  .directive('interactionMap', function (columnGraphValues) {
    return {
      restrict: 'E',
      scope: {
        observations: '=observations'
      },
      replace: true,
      templateUrl: 'views/interactionMap.html',
      controller: 'InteractionMapCtrl',
      link: function postLink(scope, element) {
        element.width(element.parent().width());
        element.height(columnGraphValues.height);

        // Base layer
        var tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				  maxZoom: 18,
				  attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			  });

        // Default center (Gulf of Mexico)
        var latlng = L.latLng(27.3649, -82.623643);
        var map = L.map('interactionMap', {
          center: latlng, zoom: 3, scrollWheelZoom: false, layers: [tiles]
        });

        // Cluster overlay
        var markers = L.markerClusterGroup({ disableClusteringAtZoom: 17 });
        var markerArray;

        // Marker options
        L.Icon.Default.imagePath = 'http://api.tiles.mapbox.com/mapbox.js/v1.0.0beta0.0/images';
        var markerOpts = {
          icon: new L.Icon.Default()
        };

        // Watch for new observations to be added
        scope.$watch('observations', function(newObservations) {

          if (newObservations) {

            // Cleanup old observations
            map.removeLayer(markers);
            markerArray = [];

            // Add to layer
            Object.keys(newObservations).forEach(function(obs) {
              var markerLocation = new L.LatLng(newObservations[obs].lat, newObservations[obs].lng);
              var marker = new L.Marker(markerLocation, markerOpts);
              marker.bindPopup(newObservations[obs].message);
              markers.addLayer(marker);
              markerArray.push(markerLocation);
            });
            map.addLayer(markers);

            // Optimize zoom and center for new observations
            map.fitBounds(new L.latLngBounds(markerArray));
          }
        });
      }
    };
  });
