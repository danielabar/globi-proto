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

        // Initialize the map
        var tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				  maxZoom: 18,
				  attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			  });

        var latlng = L.latLng(27.3649, -82.623643);

        var map = L.map('interactionMap', {
          center: latlng, zoom: 3, scrollWheelZoom: false, layers: [tiles]
        });

        var baseLayer = {
			    Base: tiles
		    };
        L.control.layers(baseLayer).addTo(map);

        // Markers Cluster Layer
        var markers = L.markerClusterGroup({ disableClusteringAtZoom: 17 });

        // Fit Bounds support
        var markerArray;

        // Watch for new markers to be added (TODO remove others?)
        scope.$watch('observations', function(newObservations) {

          if (newObservations) {

            map.removeLayer(markers);
            markerArray = [];

            Object.keys(newObservations).forEach(function(obs) {
              var markerLocation = new L.LatLng(newObservations[obs].lat, newObservations[obs].lng);
              var marker = new L.Marker(markerLocation);
              marker.bindPopup(newObservations[obs].message);
              markers.addLayer(marker);
              markerArray.push(markerLocation);
            });
            map.addLayer(markers);
            map.fitBounds(new L.latLngBounds(markerArray));
          } else {
            // TODO hide map? or some message like no geo data available...
          }
        });
      }
    };
  });
