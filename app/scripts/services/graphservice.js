'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.graphService
 * @description
 * # graphService
 * Factory in the globiProtoApp.
 */
angular.module('globiProtoApp')
  .factory('graphService', function (columnGraphValues, kingdomService) {

    // In-memory representation of entire graph
    var graph = {nodes: [], links: [], path: []};

    var deltaHistory = {};

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

    var findSourceTaxonPath = function(name, interactions) {
      for (var i=0; i<interactions.length; i++) {
        var curInteraction = interactions[i];
        if (name === curInteraction.source_taxon_name) {
          return curInteraction.source_taxon_path;
        }
      }
    };

    var calculateNodeXPosition = function(node) {
      return node.group * widthPerGroup;
    };

    var calculateNodeYPosition = function(node) {
      var numNodesInGroup = numNodesForGroup(node.group);
      var spacer = columnGraphValues.height / (numNodesInGroup + 1);
      var index = indexOfNodeWithinGroup(node);
      return (index + 1) * spacer;
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
        // TODO: If we're going to display less than actual results, populate message in return about how many cut off
        var numIterations = Math.min(columnGraphValues.maxNodesPerSource, interactions.length);
        var curInteraction;
        var sourceNodeIndex;
        var nodeAtPathTip;

        // Hack the first node color (because there's no click event to get it out of D3)
        if (!sourceNode.circleColor) {
          sourceNode.circleColor = '#1f77b4';
        }

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
          sourceNode.kingdom = kingdomService.extractKingdom(findSourceTaxonPath(sourceNode.name, interactions));
          graph.nodes.push(sourceNode);
          delta.nodes.push(sourceNode);
        }
        sourceNodeIndex = getIndexOfNode(sourceNode.name, graph.nodes);

        // Target nodes
        for (var i=0; i<numIterations; i++) {
          curInteraction = interactions[i];
          if (getIndexOfNode(curInteraction.target_taxon_name, graph.nodes) === null) {
            targetNode = {
              name: curInteraction.target_taxon_name,
              group: sourceNode.group +1,
              kingdom: kingdomService.extractKingdom(curInteraction.target_taxon_path)
            };
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
            target: getIndexOfNode(curInteraction.target_taxon_name, graph.nodes),
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

        // Maintain delta history
        deltaHistory[sourceNode.name] = delta;

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
      },

      getCurrentGroupNumber: function() {
        return graph.path[graph.path.length-1].group;
      },

      rewind: function(sourceNode) {
        // TODO: maybe delta only needs to contain indicies not the actual nodes and links
        var delta = {nodes: [], links: []};
        var nodeIndexesToRemove = [];
        var linkIndexesToRemoveHash = {}; // use a hash to avoid remove same link twice
        var linkIndexesToRemove = [];

        // TODO maintain path

        // Identify nodes indicies that should be removed
        for (var i=0; i<graph.nodes.length; i++) {
          if (graph.nodes[i].group > sourceNode.group) {
            nodeIndexesToRemove.push(i);
            graph.nodes[i].originalIndex = i;
            delta.nodes.push(graph.nodes[i]);
          }
        }

        // Remove nodes in reverse order by index
        nodeIndexesToRemove.sort(function(a,b){ return b - a; });
        delta.nodeIndexesToRemove = nodeIndexesToRemove;
        // for (var j = nodeIndexesToRemove.length -1; j >= 0; j--) {
        for (var j = 0; j < nodeIndexesToRemove.length; j++) {
          graph.nodes.splice(nodeIndexesToRemove[j],1);
        }

        // Identify unique link indicies that should be removed
        delta.nodes.forEach(function(node) {
          for (var k=0; k<graph.links.length; k++) {
            if (graph.links[k].source === node.originalIndex || graph.links[k].target === node.originalIndex) {
              linkIndexesToRemoveHash[k] = graph.links[k];
            }
          }
        });

        // Remove links in reverse order by index
        linkIndexesToRemove = Object.keys(linkIndexesToRemoveHash);
        linkIndexesToRemove.sort(function(a,b){ return b - a; });
        delta.linkIndexesToRemove = linkIndexesToRemove;
        // for (var m = linkIndexesToRemove.length -1; m >= 0; m--) {
        for (var m = 0; m < linkIndexesToRemove.length; m++) {
          delta.links.push(graph.links[m]);
          graph.links.splice(linkIndexesToRemove[m],1);
        }

        return delta;
      }

    };
  });
