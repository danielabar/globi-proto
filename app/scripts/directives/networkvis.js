angular.module('globiProtoApp')
  .directive('networkVis', function() {

    return {
      restrict: 'E',
      scope: {
        val: '='
      },
      link: function(scope, element) {

        // Constants
        var width = 960;
        var height = 500;
        var color = d3.scale.category20();
        var force = d3.layout.force()
          .charge(-120)
          .linkDistance(30)
          .size([width, height]);

        // Init the vis
        var svg = d3.select(element[0]).append('svg')
          .attr('width', width)
          .attr('height', height);

        scope.$watch('val', function(newVal) {

          // Nothing to do if no new data available
          if (!newVal) {return; }

          // Clear out the old elements
          svg.selectAll('*').remove();

          // Force layout
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
          }); //force.on(tick)
        });//$scope.$watch

      }//link
    };//return

  });//directive
