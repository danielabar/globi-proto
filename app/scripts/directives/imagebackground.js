'use strict';

/**
 * @ngdoc directive
 * @name globiProtoApp.directive:imageBackground
 * @description
 * # imageBackground
 */
angular.module('globiProtoApp')
  .directive('backgroundImage', function ($rootScope) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs) {
        console.log('=== IMAGE BACKGROUND DIRECTIVE IS RUNNING');
        $element.css('background-image', 'url(' + $attrs.backgroundImage + ')');

        $scope.$on('taxonEvent', function(evt, data) {
          console.log('=== IMAGE BACKGROUND RESPONDING TO $scope.$on TAXON EVENT: ' + JSON.stringify(data));
          $element.css('background-image', 'url(' + data.thumbnailURL + ')');
        });

        $rootScope.$on('taxonEvent', function(evt, data) {
          console.log('=== IMAGE BACKGROUND RESPONDING TO $rootScope.$on TAXON EVENT: ' + JSON.stringify(data));
          $element.css('background-image', 'url(' + data.thumbnailURL + ')');
        });

        // $scope.$watch('background-image', function(oldval, newval) {
        //   console.log('=== IMAGE BACKGROUND RESPONDING TO $scope.$watch: oldval = ' + oldval + ', newval = ' + newval);
        //   $element.css('background-image', 'url(' + $attrs.backgroundImage + ')');
        // });
      }
    };
  });
