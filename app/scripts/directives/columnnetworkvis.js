'use strict';

/**
 * @ngdoc directive
 * @name globiProtoApp.directive:columnNetworkVis
 * @description
 * # columnNetworkVis
 * D3 Symbol Reference: https://github.com/mbostock/d3/wiki/SVG-Shapes#symbol_type
 * SO Example: http://stackoverflow.com/questions/15352033/unique-symbols-for-each-data-set-in-d3-scatterplot
 * SO Example: http://stackoverflow.com/questions/23224285/change-the-size-of-a-symbol-with-a-transition-in-d3-js
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

        // Define arrow (TODO kind of ugly, needs some love)
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

          // TODO: pass d.kingdom to KingdomService to find rotation, symbol, and fill
          // Node shapes (initial positions start them at their respective sources, then later will transition)
          // To generate different shapes, can conditionally rotate a symbol
          var shapes = nodeEnter.append('path')
            .attr('transform', function(d) {
              // console.log('=== COL GRAPH transform d = ' + JSON.stringify(d));
              return 'translate(' + d.initialXPos + ',' + d.initialYPos + ') rotate(90)';
            })
            .attr('d', function() {
              // console.log('=== COL GRAPH symbol d = ' + JSON.stringify(d));
              return d3.svg.symbol().type('circle').size(150)();
            })
            .style('fill', function (d) { return color(d.group); })
            .on('click', function(item) {
              item.circleColor = d3.select(this).attr('style').split('fill: ')[1];
              scope.$emit('nodeClicked', item);
            });

          // Transition shapes to their new positions (use KingdomService mapping for rotation)
          shapes.transition()
            .delay(function(d, i) {
              return i * 10;
            })
            .duration(300)
            .ease('linear')
            .attr('transform', function(d) { return 'translate(' + d.xPos + ',' + d.yPos + ') rotate(90)'; });

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
            .attr('class', function(d) {
              if (d.linkBack) {
                return 'linkback';
              } else {
                return 'link';
              }
            })
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
