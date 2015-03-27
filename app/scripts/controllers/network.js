'use strict';

// http://briantford.com/blog/angular-d3

/**
 * @ngdoc function
 * @name globiProtoApp.controller:NetworkCtrl
 * @description
 * # NetworkCtrl
 * Controller of the globiProtoApp
 */
angular.module('globiProtoApp')
  .controller('NetworkCtrl', function ($scope, $state, taxonInteraction2, graphService) {

    graphService.init();

    $scope.query = {
      taxon: $state.params.taxon || 'Thunnus obesus',
      interaction: $state.params.interaction || 'eats'
    };

    taxonInteraction2.query($scope.query, function(response) {
      if (response.length > 0) {
        var sourceTaxon = {
          name: $scope.query.taxon,
          group: 1
        };
        $scope.graph = graphService.append(response, sourceTaxon);
      } else {
        console.warn('No interactions found for: ' + JSON.stringify($scope.query));
      }
    }, function(err) {
      console.dir(err);
    });

    $scope.$on('nodeClicked', function(evt, taxon) {
      taxonInteraction2.query({taxon: taxon.name, interaction: $scope.query.interaction}, function(response) {
        $scope.graph = graphService.append(response, taxon);
      }, function(err) {
        console.dir(err);
      });
    });

    $scope.breadcrumbs = graphService.getPath();

  });
