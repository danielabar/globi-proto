'use strict';

/**
 * @ngdoc directive
 * @name globiProtoApp.directive:networkVis
 * @description
 * # networkVis
 */
angular.module('globiProtoApp')
  .directive('networkVis', function () {

    // constants
    var width = 960,
    height = 500;

    var color = d3.scale.category20();

    var force = d3.layout.force()
      .charge(-120)
      .linkDistance(30)
      .size([width, height]);

    var svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height);

    return {
      restrict: 'E',
      scope: {
        val: '='
      },
      // link: function (scope, element, attrs) {
      link: function (scope) {

        // set up initial svg object
        // var vis = d3.select(element[0])
        //   .append('svg')
        //   .attr('width', width)
        //   .attr('height', height + margin + 100);

        scope.$watch('val', function (newVal) {

          // if 'val' is undefined, exit
          if (!newVal) {
            return;
          }

          force
            .nodes(newVal.nodes)
            .links(newVal.links)
            .start();

          var link = svg.selectAll('.link')
              .data(newVal.links)
            .enter().append('line')
              .attr('class', 'link')
              .style('stroke-width', function(d) { return Math.sqrt(d.value); });

          var node = svg.selectAll('.node')
              .data(newVal.nodes)
            .enter().append('circle')
              .attr('class', 'node')
              .attr('r', 5)
              .style('fill', function(d) { return color(d.group); })
              .call(force.drag);

          node.append('title')
              .text(function(d) { return d.name; });

          force.on('tick', function() {
            link.attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });

            node.attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; });
          });

          // clear the elements inside of the directive
          // vis.selectAll('*').remove();
          //
          // // if 'val' is undefined, exit
          // if (!newVal) {
          //   return;
          // }
          //
          // // draw the most basic thing ever
          // vis.selectAll('rect')
	        //   .data(newVal)
	        //   .enter()
	        //   .append('rect')
	        //   .attr({
		      //     x: function(d, i) { return i * 101; },
		      //     y: function(d, i) { return 400 - (d * 5); },
		      //     width: 100,
		      //     height: function(d) { return d * 5; },
		      //     fill: 'orange'
	        //   });
        });
      }
    };
  });
