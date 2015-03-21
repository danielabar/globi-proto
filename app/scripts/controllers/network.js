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

    var convertToGraph = function(response) {
      var sourceNode = {
        name: response[0].source_taxon_name,
        group: 1
      };
      var targetNodes = response.map(function(item) {
        return {
          name: item.target.name,
          group: 1
        };
      });
      targetNodes.push(sourceNode);
      var links = targetNodes.map(function(item) {
        return {
          source: getIndexOfNode(sourceNode.name, targetNodes),
          target: getIndexOfNode(item.name, targetNodes),
          value: 1
        };
      });
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
      // console.dir(response);
      $scope.graph = convertToGraph(response);
      // console.dir($scope.graph);
    }, function(err) {
      console.dir(err);
    });


  });
