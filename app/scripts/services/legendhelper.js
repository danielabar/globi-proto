'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.legendHelper
 * @description
 * # legendHelper
 * Legend drawing for Network Graph visualization.
 */
angular.module('globiProtoApp')
  .factory('legendHelper', function (kingdomService, d3Extension) {

    // Public API
    return {

      kingdom: function (svg, scope) {
        var shapeSizeLegend = 100;
        var legendColor = '#000';

        var legend = svg.selectAll('.legend')
          .data(kingdomService.legend())
          .enter().append('g')
          .attr('class', 'legend')
          .attr('transform', function(d, i) { return 'translate(0,' + (i+1) * 20 + ')'; });

        legend.append('path')
          .attr('transform', function(d) {
            if (kingdomService.shapeInfo(d.kingdom).rotate) {
              return 'translate(' + 30 + ',' + 10 + ') rotate(' + kingdomService.shapeInfo(d.kingdom).rotate + ')';
            } else {
              return 'translate(' + 30 + ',' + 10 + ')';
            }
          })
          .attr('d', function(d) {
            return d3Extension.getSymbol(kingdomService.shapeInfo(d.kingdom).shape, shapeSizeLegend);
          })
          .attr('stroke', legendColor)
          .style('fill', function (d) {
            if (!kingdomService.shapeInfo(d.kingdom).empty) {
              return legendColor;
            } else {
              return 'transparent';
            }
          });

        legend.append('text')
          .attr('class', 'legend-text')
          .on('mouseover', function() {
            d3.select(this).style('fill', '#1588ec');
          })
          .on('mouseout', function() {
            d3.select(this).style('fill', legendColor);
          })
          .on('click', function(legendItem) {
            scope.$emit('legendClicked', legendItem);
          })
          .attr('x', 60)
          .attr('y', 9)
          .attr('dy', '.35em')
          .style('text-anchor', 'start') // left align
          .style('fill', legendColor)
          .text(function(d) { return d.kingdom; });
      },

      level: function(svg) {
        var levelLegendColor = d3.scale.category10();
        var levelData = ['1st level', '2nd level', '3rd level', '4th level', '5th level', '6th level'];

        var legend = svg.selectAll('.legendLevel')
          .data(levelData)
          .enter().append('g')
          .attr('class', 'legend-level')
          .attr('transform', function(d, i) { return 'translate(0,' + (i+17) * 21 + ')'; });

        legend.append('rect')
          .attr('x', 20)
          .attr('width', 18)
          .attr('height', 18)
          .style('fill', function(d, i) { return levelLegendColor(i); });

        legend.append('text')
          .attr('x', 60)
          .attr('y', 8)
          .attr('dy', '.35em')
          .style('text-anchor', 'start')
          .text(function(d) { return d; });
      },

      interaction: function(svg) {
        var data = [{description: 'Forward link', linkBack: false}, {description: 'Back link', linkBack: true}];
        var legend = svg.selectAll('.interactionLegend')
          .data(data)
          .enter().append('g')
          .attr('class', 'interaction-legend')
          .attr('transform', function(d, i) { return 'translate(0,' + (i+21) * 25 + ')'; });

        legend.append('line')
          .attr('class', 'link-legend')
          .attr('marker-end', 'url(#arrow)')
          .attr('x1', function(d) { if (d.linkBack) { return 65; } else { return 20; } })
          .attr('x2', function(d) { if (d.linkBack) { return 20; } else { return 65; } })
          .style('stroke-width', '2')
          .style('stroke-dasharray', function(d) { if (d.linkBack) { return '3, 3'; } else { return '0, 0'; }
          });

        legend.append('text')
          .attr('x', 75)
          .attr('y', 0)
          .attr('dy', '.35em')
          .style('text-anchor', 'start')
          .text(function(d) { return d.description; });
      }

    };
  });
