'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.graphService
 * @description
 * # graphService
 * Factory in the globiProtoApp.
 */
angular.module('globiProtoApp')
  .factory('graphService', function () {

    // Sanity
    var MAX_LINKS_PER_NODE = 10;

    // In-memory representation of entire graph
    var graph = {nodes: [], links: [], path: []};

    // Utility functions
    var getIndexOfNode = function(name, nodes) {
      var result = null;
      for (var i=0; i<nodes.length; i++) {
        if (name === nodes[i].name) {
          result = i;
        }
      }
      return result;
    };

    var getIndexOfLink = function(link, links) {
      var result = null;
      for (var i=0; i<links.length; i++) {
        var curLink = links[i];
        if (link.source === curLink.source && link.target === curLink.target) {
          result = i;
        }
      }
      return result;
    };

    // Public API
    return {

      // Append to graph and return deltas
      append: function(interactions, sourceNode) {
        var delta = {nodes: [], links: []};
        var targetNode;
        var numIterations = Math.min(MAX_LINKS_PER_NODE, interactions.length);
        var curInteraction;
        var sourceNodeIndex;

        // Source node
        graph.path.push(sourceNode);
        if (!getIndexOfNode(sourceNode.name, graph.nodes)) {
          graph.nodes.push(sourceNode);
          delta.nodes.push(sourceNode);
        }
        sourceNodeIndex = getIndexOfNode(sourceNode.name, graph.nodes);

        // Target nodes
        for (var i=0; i<numIterations; i++) {
          curInteraction = interactions[i];
          if (!getIndexOfNode(curInteraction.target.name, graph.nodes)) {
            targetNode = {name: curInteraction.target.name, group: sourceNode.group +1};
            graph.nodes.push(targetNode);
            delta.nodes.push(targetNode);
          }
        }

        // Links
        for (var j=0; j<numIterations; j++) {
          curInteraction = interactions[j];
          var candidateLink = {
            source: sourceNodeIndex,
            target: getIndexOfNode(curInteraction.target.name, graph.nodes),
            value: 1
          };
          if (!getIndexOfLink(candidateLink, graph.links)) {
            graph.links.push(candidateLink);
            delta.links.push(candidateLink);
          }
        }
        return delta;
      }

    };
  });
