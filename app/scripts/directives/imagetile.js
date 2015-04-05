'use strict';

/**
 * @ngdoc directive
 * @name globiProtoApp.directive:imageTile
 * @description
 * # imageTile
 */
angular.module('globiProtoApp')
  .directive('imageTile', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        imageData: '=imageTile'
      },
      templateUrl: 'views/imageTile.html',
      controller: 'ImagetileCtrl',

      link: function(scope, element) {
        scope.$on('flipCard', function() {
          // console.log("flipCard");
          if (element.hasClass('back-side')) {
            element.removeClass('back-side');
            element.addClass('front-side');
          }
          else {
            element.removeClass('front-side');
            element.addClass('back-side');
          }
        });
      }
    };
  });
