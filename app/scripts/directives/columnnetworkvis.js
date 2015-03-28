'use strict';

/**
 * @ngdoc directive
 * @name globiProtoApp.directive:columnNetworkVis
 * @description
 * # columnNetworkVis
 */
angular.module('globiProtoApp')
  .directive('columnNetworkVis', function () {
    return {
      restrict: 'E',
      link: function postLink(scope, element) {

        // Constants
        var width = 960;
        var height = 500;
        var color = d3.scale.category10();

        // Init the vis
        var svg = d3.select(element[0]).append('svg')
          .attr('width', width)
          .attr('height', height);

        // TODO Refresh graph with new nodes and links
        // var update = function() {

        // };//update

        // Just draw a static vis for now
        // http://thinkingonthinking.com/Getting-Started-With-D3/
        var nodes = [
          {name: 'A', group: 1, x: width/6, y: height/2},

          {name: 'B', group: 2, x: (width/6)*2, y: height/3},
          {name: 'C', group: 2, x: (width/6)*2, y: height/3*2},
          {name: 'D', group: 2, x: (width/6)*2, y: height/3*3},

          {name: 'E', group: 3, x: (width/6)*3, y: height/3},
          {name: 'F', group: 3, x: (width/6)*3, y: height/3*2}
        ];

        var links = [
          {source: nodes[0], target: nodes[1]},
          {source: nodes[0], target: nodes[2]},
          {source: nodes[0], target: nodes[3]},

          {source: nodes[3], target: nodes[4]},
          {source: nodes[3], target: nodes[5]}
        ];

        // Render the nodes as circles
        svg.selectAll('circle.nodes')
          .data(nodes)
          .enter()
          .append('svg:circle')
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; })
          .attr('r', '10px')
          .style('fill', function (d) { return color(d.group); });

        // Render the links as lines connecting the nodes
        svg.selectAll('.line')
          .data(links)
          .enter()
          .append('line')
          .attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; })
          .style('stroke', 'rgb(56, 65, 67)');

        // Watch for new graph data in scope
        scope.$watch('val', function(newVal) {

          // Nothing to do if no new data available
          if (!newVal) {return; }

        });//scope.$watch

      }//link
    };//return
  });//directive
