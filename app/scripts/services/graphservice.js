'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.graphService
 * @description
 * # graphService
 * Factory in the globiProtoApp.
 */
angular.module('globiProtoApp')
  .factory('graphService', function (maxApiResults, columnGraphValues) {

    // In-memory representation of entire graph
    var graph = {nodes: [], links: [], path: []};

    // Column graph calculation constants
    var widthPerGroup = columnGraphValues.width / columnGraphValues.maxLevel;

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

    var getNodeAtPathTip = function() {
      if (graph.path.length > 0) {
        return graph.path[graph.path.length-1];
      }
      return null;
    };

    var numNodesForGroup = function(group) {
      var result = 0;
      graph.nodes.forEach(function(node) {
        if (node.group === group) {
          result += 1;
        }
      });
      return result;
    };

    var indexOfNodeWithinGroup = function(node) {
      var nodesInGroup = graph.nodes.filter(function(item) {
        return item.group === node.group;
      });
      for (var i=0; i<nodesInGroup.length; i++) {
        if (nodesInGroup[i].name === node.name) {
          return i;
        }
      }
      return 0;
    };

    var calculateNodeXPosition = function(node) {
      return node.group * widthPerGroup;
    };

    var calculateNodeYPosition = function(node) {
      var numNodesInGroup = numNodesForGroup(node.group);
      var spacer = columnGraphValues.height / (numNodesInGroup + 1);
      var index = indexOfNodeWithinGroup(node);
      return (index + 1) * spacer;
      // return (columnGraphValues.height / (numNodesInGroup+1)) * (index+1);
    };

    var populateNodePosition = function(node) {
      node.xPos = calculateNodeXPosition(node);
      node.yPos = calculateNodeYPosition(node);
    };

    // Public API
    return {

      // Initialize a new empty graph
      init: function() {
        graph = {nodes: [], links: [], path: []};
      },

      // Append to graph and return deltas
      append: function(interactions, sourceNode) {
        var delta = {nodes: [], links: []};
        var targetNode;
        var numIterations = Math.min(maxApiResults, interactions.length);
        var curInteraction;
        var sourceNodeIndex;
        var nodeAtPathTip;

        // Maintain current path
        nodeAtPathTip = getNodeAtPathTip();
        if (!nodeAtPathTip) {
          graph.path.push(sourceNode);
        }
        if (nodeAtPathTip && (nodeAtPathTip.group !== sourceNode.group)) {
          graph.path.push(sourceNode);
        }
        if (nodeAtPathTip && (nodeAtPathTip.group === sourceNode.group)) {
          graph.path.pop();
          graph.path.push(sourceNode);
        }

        // Source node
        if (getIndexOfNode(sourceNode.name, graph.nodes) === null) {
          graph.nodes.push(sourceNode);
          delta.nodes.push(sourceNode);
        }
        sourceNodeIndex = getIndexOfNode(sourceNode.name, graph.nodes);

        // Target nodes
        for (var i=0; i<numIterations; i++) {
          curInteraction = interactions[i];
          if (getIndexOfNode(curInteraction.target.name, graph.nodes) === null) {
            targetNode = {name: curInteraction.target.name, group: sourceNode.group +1};
            graph.nodes.push(targetNode);
            delta.nodes.push(targetNode);
          }
        }

        // Node positions
        delta.nodes.forEach(function(node) {
          populateNodePosition(node);
        });

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

        // Flag linkbacks
        delta.links.forEach(function(link) {
          var targetNode = graph.nodes[link.target];
          var positionInDelta = getIndexOfNode(targetNode.name, delta.nodes);
          if (positionInDelta === null) {
            link.linkBack = true;
          }
        });

        // Transitions
        delta.links.forEach(function(link) {
          var sourceNode = graph.nodes[link.source];
          var targetNode = graph.nodes[link.target];
          targetNode.initialXPos = sourceNode.xPos;
          targetNode.initialYPos = sourceNode.yPos;
        });

        return delta;
      },

      getPath: function() {
        return graph.path;
      },

      isNodeInPath: function(nodeName) {
        if (getIndexOfNode(nodeName, graph.path) !== null) {
          return true;
        } else {
          return false;
        }
      },

      isNodeTargetOfPathTip: function(nodeName) {
        var nodePathTip;
        var indexOfNodePathTip;
        var indexOfNode = getIndexOfNode(nodeName, graph.nodes);

        if (graph.path.length > 0 && getIndexOfNode !== null) {
          nodePathTip = graph.path[graph.path.length-1];
          indexOfNodePathTip = getIndexOfNode(nodePathTip.name, graph.nodes);
          for (var i = 0; i<graph.links.length; i++) {
            var currentLink = graph.links[i];
            if (currentLink.source === indexOfNodePathTip && currentLink.target === indexOfNode) {
              return true;
            }
          }
        }

        return false;
      }

    };
  });
