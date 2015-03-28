'use strict';

/**
 * @ngdoc directive
 * @name globiProtoApp.directive:columnNetworkVis
 * @description
 * # columnNetworkVis
 */
angular.module('globiProtoApp')
  .directive('columnNetworkVis', function (columnGraphValues, graphService) {
    return {
      restrict: 'E',
      scope: {
        val: '='
      },
      link: function postLink(scope, element) {

        // Color scale
        var color = d3.scale.category10();

        // Init the vis
        var svg = d3.select(element[0]).append('svg')
          .attr('width', columnGraphValues.width)
          .attr('height', columnGraphValues.height);

        // Keep reference to nodes and links to support updates
        var nodes = [];
        var links = [];

        // Implement D3 general updating pattern
        var update = function() {

          // Node groups (circle + label)
          var node = svg.selectAll('.node').data(nodes);
          var nodeEnter = node.enter().append('g')
            .attr('class', 'node');

          // Node circles
          nodeEnter.append('circle')
            .attr('cx', function(d) { return d.xPos; })
            .attr('cy', function(d) { return d.yPos; })
            .attr('r', 10)
            .style('fill', function (d) { return color(d.group); })
            .on('click', function(item) {
              item.circleColor = d3.select(this).attr('style').split('fill: ')[1];
              scope.$emit('nodeClicked', item);
            });

          // Node labels
          nodeEnter.append('text')
            // .attr('dx', 11)
            .attr('dx', function(d) {return d.xPos + 10;})
            .attr('dy', function(d) {return d.yPos + 10;})
            // .attr('dy', '.45em')
            .text(function(d) { return d.name; })
            .style('stroke', function(d) {return color(d.group);});

          node.exit().remove();

          // Links between nodes
          var link = svg.selectAll('.link').data(links);
          link.enter().insert('line')
            .attr('class', 'link')
            .attr('x1', function(d) { return nodes[d.source].xPos; })
            .attr('y1', function(d) { return nodes[d.source].yPos; })
            .attr('x2', function(d) { return nodes[d.target].xPos; })
            .attr('y2', function(d) { return nodes[d.target].yPos; })
            .style('stroke-width', '2');

          link.exit().remove();

        };//update

        // Watch for new graph data in scope
        scope.$watch('val', function(newVal) {

          // Nothing to do if no new data available
          if (!newVal) {return; }

          // Append new graph data and update vis
          nodes.push.apply(nodes, newVal.nodes);
          links.push.apply(links, newVal.links);
          update();

          // Redraw ALL the text labels based on path
          d3.selectAll('text')
            .style('stroke', function(d) {
              if (graphService.isNodeInPath(d.name) || graphService.isNodeTargetOfPathTip(d.name)) {
                return color(d.group);
              } else {
                return '#b3b1b1';
              }
            });

        });//scope.$watch

      }//link
    };//return
  });//directive
