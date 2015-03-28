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
        var graphData = graphService.append(response, sourceTaxon);
        $scope.graph = graphData;
        $scope.columnGraph = graphData;
      } else {
        console.warn('No interactions found for: ' + JSON.stringify($scope.query));
      }
    }, function(err) {
      console.dir(err);
    });

    $scope.$on('nodeClicked', function(evt, taxon) {
      taxonInteraction2.query({taxon: taxon.name, interaction: $scope.query.interaction}, function(response) {
        var graphData = graphService.append(response, taxon);
        $scope.graph = graphData;
        $scope.columnGraph = graphData;
      }, function(err) {
        console.dir(err);
      });
    });

    $scope.breadcrumbs = graphService.getPath();

    // Hard code some data for column graph POC
    // var width = 960;
    // var height = 500;
    // var nodes = [
    //   {name: 'A', group: 1, x: width/6, y: height/2},
    //   {name: 'B', group: 2, x: (width/6)*2, y: height/3},
    //   {name: 'C', group: 2, x: (width/6)*2, y: height/3*2},
    //   {name: 'D', group: 2, x: (width/6)*2, y: height/3*3},
    //   {name: 'E', group: 3, x: (width/6)*3, y: height/3},
    //   {name: 'F', group: 3, x: (width/6)*3, y: height/3*2}
    // ];
    // var links = [
    //   {source: 0, target: 1},
    //   {source: 0, target: 2},
    //   {source: 0, target: 3},
    //   {source: 3, target: 4},
    //   {source: 3, target: 5}
    // ];
    // $scope.columnGraph = {
    //   nodes: nodes,
    //   links: links
    // };

  });
