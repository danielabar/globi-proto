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

    $scope.query = {
      taxon: $state.params.taxon || 'Thunnus obesus',
      interaction: $state.params.interaction || 'eats'
    };

    taxonInteraction2.query($scope.query, function(response) {
      var sourceTaxon = {
        name: response[0].source.name,
        group: 1
      };
      var graphDelta = graphService.append(response, sourceTaxon);
      // console.table(graphDelta.nodes);
      // console.table(graphDelta.links);
      $scope.graph = graphDelta;
    }, function(err) {
      console.dir(err);
    });

    $scope.$on('nodeClicked', function(evt, taxon) {
      taxonInteraction2.query({taxon: taxon.name, interaction: $scope.query.interaction}, function(response) {
        var graphDelta = graphService.append(response, taxon);
        // console.table(graphDelta.nodes);
        // console.table(graphDelta.links);
        $scope.graph = angular.copy(graphDelta);
      }, function(err) {
        console.dir(err);
      });
    });


  });
