'use strict';

// http://leafletjs.com/examples/quick-start.html

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
        // var map = L.map('interactionMap').setView([27.3649, -82.623643], 3);
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

        // Watch for new markers to be added
        scope.$watch('observations', function(newObservations) {
          console.log('map directive detected new observatiosn to add: ');
          console.dir(newObservations);
        });
      }
    };
  });
