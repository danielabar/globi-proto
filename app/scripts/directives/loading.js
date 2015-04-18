'use strict';

/**
 * @ngdoc directive
 * @name globiProtoApp.directive:loading
 * @description
 * # loading
 */
angular.module('globiProtoApp')
  .directive('loading', function ($http) {
    return {
      restrict: 'A',
        link: function (scope, elm) {
            scope.isLoading = function () {
              return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v) {
              if (v) {
                elm.show();
              } else{
                elm.hide();
              }
            });
        }
    };
  });
