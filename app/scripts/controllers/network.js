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

    var totalGraph = {};

    $scope.query = {
      taxon: $state.params.taxon || 'Thunnus obesus',
      interaction: $state.params.interaction || 'eats'
    };

    var convertToGraph = function(response, sourceNodeName, group) {

      // Manually construct the source node
      var sourceNode = {
        name: sourceNodeName,
        group: group
      };

      // Iterate over the response to find target nodes (API sometimes returns targets that aren't linked to source)
      var targetNodes = [];
      // temp debug limit to 3 to figure out whats wrong with delta calc
      // var numIterations = Math.min(10, response.length);
      var numIterations = Math.min(3, response.length);
      for (var i=0; i<numIterations; i++) {
        var item = response[i];
        // if (item.source && item.source.name === sourceNode.name) {
          targetNodes.push({
            name: item.target.name,
            group: group + 1
          });
        // }
      }
      targetNodes.push(sourceNode);

      // Build links
      var links = targetNodes.map(function(item) {
        return {
          source: getIndexOfNode(sourceNode.name, targetNodes),
          target: getIndexOfNode(item.name, targetNodes),
          value: 1
        };
      });

      // Return graph
      return {
        nodes: targetNodes,
        links: links
      };
    };

    var getIndexOfNode = function(name, nodes) {
      var result = null;
      for (var i=0; i<nodes.length; i++) {
        if (name === nodes[i].name) {
          return i;
        }
      }
      return result;
    };

    var mergeGraphData = function(currentGraph, newData, sourceNodeName) {

      // Merge nodes
      var mergedNodes = angular.copy(currentGraph.nodes);
      for (var i=0; i<newData.nodes.length; i++) {
        var item = newData.nodes[i];
        var index = getIndexOfNode(item.name, currentGraph.nodes);
        if (!index) {
          mergedNodes.push(item);
        }
      }

      // Merge links
      var mergedLinks = angular.copy(currentGraph.links);
      for (var j=0; j<newData.nodes.length; j++) {
        var curNode = newData.nodes[j];
        mergedLinks.push({
          source: getIndexOfNode(sourceNodeName, mergedNodes),
          target: getIndexOfNode(curNode.name, mergedNodes),
          value: 1
        });
      }

      // Return graph
      return {
        nodes: mergedNodes,
        links: mergedLinks
      };
    };

    // TODO Make this a method like 'getData' not dependent on $scope so it can be re-used in 'nodeClicked' handler
    taxonInteraction2.query($scope.query, function(response) {
      $scope.graph = convertToGraph(response, $scope.query.taxon, 1);
      totalGraph = angular.copy($scope.graph);
    }, function(err) {
      console.dir(err);
    });

    $scope.$on('nodeClicked', function(evt, data) {
      taxonInteraction2.query({taxon: data.name, interaction: $scope.query.interaction}, function(response) {
        var graphData = convertToGraph(response, $scope.query.taxon, data.group);
        var mergedGraph = mergeGraphData(totalGraph, graphData, data.name);
        var graphDelta = graphService.calcDiff(totalGraph, mergedGraph);
        console.log('=== NETWORK: graphDelta = ' + JSON.stringify(graphDelta));
        $scope.graph = graphDelta;
        totalGraph = angular.copy(mergedGraph);
      }, function(err) {
        console.dir(err);
      });
    });


  });
