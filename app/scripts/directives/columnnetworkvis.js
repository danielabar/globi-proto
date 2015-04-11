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
  .directive('columnNetworkVis', function (columnGraphValues, graphService, kingdomService, d3Extension) {
    return {
      restrict: 'E',
      scope: {
        val: '='
      },
      link: function postLink(scope, element) {

        // Color scale
        var color = d3.scale.category10();

        var shapeSize = 200;
        var shapeSizeLegend = 100;

        // Maximize available size based on container
        var svgWidth = element.parent().width();
        var svgHeight = columnGraphValues.height;

        // Init the vis
        var svg = d3.select(element[0]).append('svg')
          .attr('width', svgWidth)
          .attr('height', columnGraphValues.height);

        // Define arrow (TODO kind of ugly, needs some love)
        svg.append('svg:defs').selectAll('marker')
          .data(['arrow'])
          .enter().append('svg:marker')
          .attr('id', String)
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 10)
          .attr('refY', 0)
          .attr('markerWidth', 8)
          .attr('markerHeight', 8)
          .attr('orient', 'auto')
          .append('svg:path')
          .attr('d', 'M0,-5L10,0L0,0');

        // Keep reference to nodes and links to support updates
        var nodes = [];
        var links = [];

        // Legend
        var legend = svg.selectAll('.legend')
          .data(kingdomService.legend())
          .enter().append('g')
          .attr('class', 'legend')
          .attr('transform', function(d, i) { return 'translate(0,' + i * 20 + ')'; });

        legend.append('path')
          .attr('transform', function(d) {
            if (kingdomService.shapeInfo(d.kingdom).rotate) {
              return 'translate(' + 30 + ',' + 8 + ') rotate(' + kingdomService.shapeInfo(d.kingdom).rotate + ')';
            } else {
              return 'translate(' + 30 + ',' + 8 + ')';
            }
          })
          .attr('d', function(d) {
            return d3Extension.getSymbol(kingdomService.shapeInfo(d.kingdom).shape, shapeSizeLegend);
          })
          .attr('stroke', '#000')
          .style('fill', function (d) {
            if (!kingdomService.shapeInfo(d.kingdom).empty) {
              return '#000';
            } else {
              return 'transparent';
            }
          });

        legend.append('text')
          .attr('x', 60)
          .attr('y', 9)
          .attr('dy', '.35em')
          .style('text-anchor', 'start') // left align
          .style('fill', '#000')
          .text(function(d) { return d.kingdom; });

        // Implement D3 general updating pattern
        var update = function() {

          // Node groups (shape + label)
          var node = svg.selectAll('.node').data(nodes);
          var nodeEnter = node.enter().append('g')
            .attr('class', 'node');

          // Node shapes initial positions
          var shapes = nodeEnter.append('path')
            .attr('transform', function(d) {
              if (kingdomService.shapeInfo(d.kingdom).rotate) {
                return 'translate(' + d.initialXPos + ',' + d.initialYPos + ') rotate(' + kingdomService.shapeInfo(d.kingdom).rotate + ')';
              } else {
                return 'translate(' + d.initialXPos + ',' + d.initialYPos + ')';
              }
            })
            .attr('d', function(d) {
              return d3Extension.getSymbol(kingdomService.shapeInfo(d.kingdom).shape, shapeSize);
            })
            .style('fill', function (d) {
              if (!kingdomService.shapeInfo(d.kingdom).empty) {
                return color(d.group);
              } else {
                return 'transparent';
              }
            })
            .attr('stroke', function (d) { return color(d.group); })
            .on('click', function(item) {
              item.circleColor = d3.select(this).attr('stroke');
              scope.$emit('nodeClicked', item);
            });

          // Transition shapes to their new positions
          shapes.transition()
            .delay(function(d, i) {
              return i * 10;
            })
            .duration(300)
            .ease('linear')
            .attr('transform', function(d) {
              if (kingdomService.shapeInfo(d.kingdom).rotate) {
                return 'translate(' + d.xPos + ',' + d.yPos + ') rotate(' + kingdomService.shapeInfo(d.kingdom).rotate + ')';
              } else {
                return 'translate(' + d.xPos + ',' + d.yPos + ')';
              }
            });

          // Node labels
          nodeEnter.append('text')
            .attr('class', 'node-label')
            .attr('dx', function(d) {return d.xPos + 10;})
            .attr('dy', function(d) {return d.yPos + 5;})
            .text(function(d) { return d.name; })
            .style({
              'letter-spacing': 2,
              'fill' : function(d) {return color(d.group);}
            });

          node.exit().remove();

          // Links initial positions
          var link = svg.selectAll('.link').data(links);
          var lineLinks = link.enter().insert('line')
            .on('mouseover', function() {
              d3.select(this).style({'stroke-width': '4px', 'stroke' : '#2ED3DE'});
            })
            .on('mouseout', function() {
              d3.select(this).style({'stroke-width': '2px', 'stroke' : '#999'});
            })
            .on('click', function(linkItem) {
              scope.$emit('linkClicked', linkItem);
            })
            .attr('class', function(d) {
              if (d.linkBack) {
                // EXTREMELY important to still maintain link class because that's how the elements are selected
                return 'link linkback';
              } else {
                return 'link';
              }
            })
            .attr('marker-end', 'url(#arrow)')
            .attr('x1', function(d) { return nodes[d.source].xPos; })
            .attr('y1', function(d) { return nodes[d.source].yPos; })
            .attr('x2', function(d) { return nodes[d.source].xPos; })
            .attr('y2', function(d) { return nodes[d.source].yPos; })
            .style('stroke-width', '2')
            .style('stroke-dasharray', function(d) {
              if (d.linkBack) {
                return '3, 3';
              } else {
                return '0, 0';
              }
            });

          // Transition links end points to their new positions
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

          if (newVal.action === 'add') {
            nodes.push.apply(nodes, newVal.nodes);
            links.push.apply(links, newVal.links);
            graphService.calculateNodePositions(newVal.nodes, newVal.links, svgWidth, svgHeight);
            update();
          }

          if (newVal.action === 'remove') {
            for (var j = 0; j < newVal.nodeIndexesToRemove.length; j++) {
              nodes.splice(newVal.nodeIndexesToRemove[j],1);
            }
            for (var m = 0; m < newVal.linkIndexesToRemove.length; m++) {
              links.splice(newVal.linkIndexesToRemove[m],1);
            }
            update();
          }

          // Redraw text labels based on path, de-emphasize those not on path
          d3.selectAll('text.node-label')
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
