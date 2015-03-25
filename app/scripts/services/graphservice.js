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

    return {
      calcDiff: function (oldGraph, newGraph) {

        if (!oldGraph) {
          return newGraph;
        }

        // Find nodes in newGraph that are not in oldGraph
        var nodeDiff = [];
        for (var i=0; i<newGraph.nodes.length; i++) {
          var curNewNode = newGraph.nodes[i];
          var nodeIndex = getIndexOfNode(curNewNode.name, oldGraph.nodes);
          if (!nodeIndex) {
            nodeDiff.push(curNewNode);
          }
        }

        // Find links in newGraph that are not in oldGraph
        var linkDiff = [];
        for (var j=0; j<newGraph.links.length; j++) {
          var curNewLink = newGraph.links[j];
          var linkIndex = getIndexOfLink(curNewLink, oldGraph.links);
          if (!linkIndex) {
            linkDiff.push(curNewLink);
          }
        }

        // Return the diff graph
        return {
          nodes: nodeDiff,
          links: linkDiff
        };

      }
    };
  });
