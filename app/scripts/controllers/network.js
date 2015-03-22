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
  .controller('NetworkCtrl', function ($scope, $state, taxonInteraction2) {

    $scope.query = {
      taxon: $state.params.taxon || 'Thunnus obesus',
      interaction: $state.params.interaction || 'eats'
    };

    var convertToGraph = function(response, sourceNodeName) {

      // Manually construct the source node
      var sourceNode = {
        name: sourceNodeName,
        group: 1
      };

      // Iterate over the response to find target nodes (API sometimes returns targets that aren't linked to source)
      var targetNodes = [];
      for (var i=0; i<response.length; i++) {
        var item = response[i];
        //
        if (item.source && item.source.name === sourceNode.name) {
          targetNodes.push({
            name: item.target.name,
            group: 2
          });
        }
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
      for (var i=0; i<nodes.length; i++) {
        if (name === nodes[i].name) {
          return i;
        }
      }
    };

    taxonInteraction2.query($scope.query, function(response) {
      $scope.graph = convertToGraph(response, $scope.query.taxon);
    }, function(err) {
      console.dir(err);
    });


  });
