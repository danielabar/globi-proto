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
      link: function($scope, $element) {

        var placeholderUlr = 'http://dummyimage.com/150x150&text=No%20image%20available';

        $scope.$on('taxonEvent', function(evt, data) {
          console.log('=== IMAGE BACKGROUND RESPONDING TO $scope.$on TAXON EVENT: ' + JSON.stringify(data));
          if (data.thumbnailURL) {
            $element.css('background-image', 'url(' + data.thumbnailURL + ')');
          } else {
            $element.css('background-image', 'url(' + placeholderUlr + ')');
          }
        });

        $rootScope.$on('taxonEvent', function(evt, data) {
          console.log('=== IMAGE BACKGROUND RESPONDING TO $rootScope.$on TAXON EVENT: ' + JSON.stringify(data));
          if (data.thumbnailURL) {
            $element.css('background-image', 'url(' + data.thumbnailURL + ')');
          } else {
            $element.css('background-image', 'url(' + placeholderUlr + ')');
          }
        });
      }
    };
  });
