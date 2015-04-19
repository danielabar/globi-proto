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

        // Initialize
        var map = L.map('interactionMap', {
          center: [27.3649, -82.623643],
          zoom: 3,
          scrollWheelZoom: false
        });

        // Base layer
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 10
        }).addTo(map);

        // Watch for new markers to be added (TODO remove others?)
        scope.$watch('observations', function(newObservations) {
          console.log('map directive detected new observations to add: ');
          console.dir(newObservations);
          if (newObservations) {
            Object.keys(newObservations).forEach(function(obs) {
              var markerLocation = new L.LatLng(newObservations[obs].lat, newObservations[obs].lng);
              var marker = new L.Marker(markerLocation);
              // marker.bindPopup('<b>Hello world!</b><br />I am a popup.');
              marker.bindPopup(newObservations[obs].message);
              // L.marker([newObservations[obs].lat, newObservations[obs].lng]).addTo(map);
              marker.addTo(map);
            });
          } else {
            // TODO hide map? or some message like no geo data available...
          }
        });
      }
    };
  });
