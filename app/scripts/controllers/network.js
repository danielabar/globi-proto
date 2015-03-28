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

    // Hard code some data for column graph POC
    var width = 960;
    var height = 500;
    var nodes = [
      {name: 'A', group: 1, x: width/6, y: height/2},
      {name: 'B', group: 2, x: (width/6)*2, y: height/3},
      {name: 'C', group: 2, x: (width/6)*2, y: height/3*2},
      {name: 'D', group: 2, x: (width/6)*2, y: height/3*3},
      {name: 'E', group: 3, x: (width/6)*3, y: height/3},
      {name: 'F', group: 3, x: (width/6)*3, y: height/3*2}
    ];
    var links = [
      {source: nodes[0], target: nodes[1]},
      {source: nodes[0], target: nodes[2]},
      {source: nodes[0], target: nodes[3]},
      {source: nodes[3], target: nodes[4]},
      {source: nodes[3], target: nodes[5]}
    ];
    $scope.columnGraph = {
      nodes: nodes,
      links: links
    };

  });
