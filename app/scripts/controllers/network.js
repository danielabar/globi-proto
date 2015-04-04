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
  .controller('NetworkCtrl', function ($scope, $state, taxonInteractionFields, graphService, toaster) {

    graphService.init();

    // Pre-populate a good example if one is not provided by the user
    $scope.query = {
      sourceTaxon: $state.params.taxon || 'Thunnus obesus',
      interactionType: $state.params.interaction || 'eats'
    };

    taxonInteractionFields.query($scope.query, function(response) {
      if (response.length > 0) {
        var sourceTaxon = {
          name: $scope.query.sourceTaxon,
          group: 1
        };
        var graphData = graphService.append(response, sourceTaxon);
        $scope.graph = graphData;
        $scope.columnGraph = graphData;
      } else {
        toaster.pop('note', 'Sorry', 'No interactions found for: ' + $scope.query.taxon + ' ' + $scope.query.interaction);
      }
    }, function(err) {
      console.dir(err);
    });

    $scope.$on('nodeClicked', function(evt, taxon) {
      taxonInteractionFields.query({sourceTaxon: taxon.name, interactionType: $scope.query.interactionType}, function(response) {
        if (response.length > 0) {
          var graphData = graphService.append(response, taxon);
          $scope.graph = graphData;
          $scope.columnGraph = graphData;
        } else {
          toaster.pop('note', 'Sorry', 'No interactions found for: ' + taxon.name + ' ' + $scope.query.interactionType);
        }
      }, function(err) {
        console.dir(err);
      });
    });

    $scope.breadcrumbs = graphService.getPath();

  });