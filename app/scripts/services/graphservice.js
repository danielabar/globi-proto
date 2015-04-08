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

    var widthPerGroup = function(graphWidth) {
      return graphWidth / (columnGraphValues.maxLevel + 1);
    };

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

    var calculateNodeXPosition = function(node, graphWidth) {
      return node.group * widthPerGroup(graphWidth);
    };

    var calculateNodeYPosition = function(node, graphHeight) {
      var numNodesInGroup = numNodesForGroup(node.group);
      var spacer = graphHeight / (numNodesInGroup + 1);
      var index = indexOfNodeWithinGroup(node);
      return (index + 1) * spacer;
    };

    var populateNodePosition = function(node, graphWidth, graphHeight) {
      node.xPos = calculateNodeXPosition(node, graphWidth);
      node.yPos = calculateNodeYPosition(node, graphHeight);
    };

    // Modify graph.path given a new sourceNode
    var maintainCurrentPath = function(sourceNode) {
      var nodeAtPathTip = getNodeAtPathTip();
      if (!nodeAtPathTip) {
        graph.path.push(sourceNode);
      } else {
        // Append
        if (sourceNode.group === (nodeAtPathTip.group + 1) ) {
          graph.path.push(sourceNode);
        }
        // Replace
        if (sourceNode.group === nodeAtPathTip.group) {
          graph.path.pop();
          graph.path.push(sourceNode);
        }
        // Rewind
        if (sourceNode.group < nodeAtPathTip.group) {
          graph.path.splice(sourceNode.group, (nodeAtPathTip.group - sourceNode.group));
        }
      }
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
        var numIterations = Math.min(columnGraphValues.maxNodesPerSource, interactions.length);
        var curInteraction;
        var sourceNodeIndex;

        // Hack the first node color (because there's no click event to get it out of D3)
        if (!sourceNode.circleColor) {
          sourceNode.circleColor = '#1f77b4';
        }

        // Maintain current path
        maintainCurrentPath(sourceNode);

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
        // delta.nodes.forEach(function(node) {
        //   populateNodePosition(node);
        // });

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
        var nodeIndexesAtSourceLevel = [];
        var linkIndexesToRemoveHash = {}; // use a hash to avoid remove same link twice
        var linkIndexesToRemove = [];

        // Maintain current path
        maintainCurrentPath(sourceNode);

        // Identify node indicies that should be removed and those at same level for link cleanup
        for (var i=0; i<graph.nodes.length; i++) {
          if (graph.nodes[i].group > sourceNode.group) {
            nodeIndexesToRemove.push(i);
            graph.nodes[i].originalIndex = i;
            delta.nodes.push(graph.nodes[i]);
          }
          if (graph.nodes[i].group === sourceNode.group) {
            nodeIndexesAtSourceLevel.push(i);
          }
        }

        // Identify unique link indicies to be removed based on nodes to be removed
        delta.nodes.forEach(function(node) {
          for (var k=0; k<graph.links.length; k++) {
            if (graph.links[k].source === node.originalIndex || graph.links[k].target === node.originalIndex) {
              linkIndexesToRemoveHash[k] = graph.links[k];
            }
          }
        });

        // Identify unique link indicies to be removed based on nodes at source level
        nodeIndexesAtSourceLevel.forEach(function(nodeIndex) {
          for (var n=0; n<graph.links.length; n++) {
            if (graph.links[n].source === nodeIndex) {
              linkIndexesToRemoveHash[n] = graph.links[n];
            }
          }
        });

        // Remove links in reverse order by index
        linkIndexesToRemove = Object.keys(linkIndexesToRemoveHash);
        linkIndexesToRemove.sort(function(a,b){ return b - a; });
        delta.linkIndexesToRemove = linkIndexesToRemove;
        for (var m = 0; m < linkIndexesToRemove.length; m++) {
          delta.links.push(graph.links[m]);
          graph.links.splice(linkIndexesToRemove[m],1);
        }

        // Remove nodes in reverse order by index
        nodeIndexesToRemove.sort(function(a,b){ return b - a; });
        delta.nodeIndexesToRemove = nodeIndexesToRemove;
        for (var j = 0; j < nodeIndexesToRemove.length; j++) {
          graph.nodes.splice(nodeIndexesToRemove[j],1);
        }

        return delta;
      },

      calculateNodePositions: function(deltaNodes, deltaLinks, graphWidth, graphHeight) {
        deltaNodes.forEach(function(node) {
          populateNodePosition(node, graphWidth, graphHeight);
        });
        deltaLinks.forEach(function(link) {
          graph.nodes[link.target].initialXPos = graph.nodes[link.source].xPos;
          graph.nodes[link.target].initialYPos = graph.nodes[link.source].yPos;
        });
      }

    };
  });
