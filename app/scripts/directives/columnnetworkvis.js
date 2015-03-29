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

          // Define arrow
          svg.append('svg:defs').selectAll('marker')
            .data(['arrow'])
            .enter().append('svg:marker')
            .attr('id', String)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10)
            .attr('refY', 0)
            .attr('markerWidth', 10)
            .attr('markerHeight', 10)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,0');

        // Keep reference to nodes and links to support updates
        var nodes = [];
        var links = [];

        // Implement D3 general updating pattern
        var update = function() {

          // Node groups (circle + label)
          var node = svg.selectAll('.node').data(nodes);
          var nodeEnter = node.enter().append('g')
            .attr('class', 'node');

          // Node circles (initial positions start them at their respective sources, then later will transition)
          var circles = nodeEnter.append('circle')
            .attr('cx', function(d) { return d.initialXPos; })
            .attr('cy', function(d) { return d.initialYPos; })
            .attr('r', 1)
            .style('fill', function (d) { return color(d.group); })
            .on('click', function(item) {
              item.circleColor = d3.select(this).attr('style').split('fill: ')[1];
              scope.$emit('nodeClicked', item);
            });

          // Transition circles to their new positions
          circles.transition()
            .delay(function(d, i) {
              return i * 10;
            })
            .duration(300)
            .ease('linear')
            .attr('r', 10)
            .attr('cx', function(d) { return d.xPos; })
            .attr('cy', function(d) { return d.yPos; });

          // Node labels
          nodeEnter.append('text')
            .attr('dx', function(d) {return d.xPos + 10;})
            .attr('dy', function(d) {return d.yPos + 5;})
            .text(function(d) { return d.name; })
            .style('stroke', function(d) {return color(d.group);});

          node.exit().remove();

          // Links between nodes (initial positions make x2/y2 points the same as x1/y1)
          var link = svg.selectAll('.link').data(links);
          var lineLinks = link.enter().insert('line')
            // .attr('class', 'link')
            .attr('class', function(d) {
              if (d.linkBack) {
                return 'linkback';
              } else {
                return 'link';
              }
            })
            // .attr('class', 'link arrow')
            .attr('marker-end', 'url(#arrow)')
            .attr('x1', function(d) { return nodes[d.source].xPos; })
            .attr('y1', function(d) { return nodes[d.source].yPos; })
            .attr('x2', function(d) { return nodes[d.source].xPos; })
            .attr('y2', function(d) { return nodes[d.source].yPos; })
            .style('stroke-width', '2');

          // Transition line links end points to their new positions
          lineLinks.transition()
            .delay(function(d, i) {
              return i * 10;
            })
            .duration(300)
            .ease('linear')
            .attr('x2', function(d) { return nodes[d.target].xPos; })
            .attr('y2', function(d) { return nodes[d.target].yPos; });

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

          // Redraw ALL the text labels based on path, de-emphasize those not on path
          d3.selectAll('text')
            .style('stroke', function(d) {
              if (graphService.isNodeInPath(d.name) || graphService.isNodeTargetOfPathTip(d.name)) {
                return color(d.group);
              } else {
                return '#b3b1b1';
              }
            })
            .style('font-size', function(d) {
              if (!graphService.isNodeInPath(d.name) && !graphService.isNodeTargetOfPathTip(d.name)) {
                return '10px';
              }
            });

        });//scope.$watch

      }//link
    };//return
  });//directive
