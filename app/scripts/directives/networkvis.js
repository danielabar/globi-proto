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
        var color = d3.scale.category10();
        var force = d3.layout.force()
          .charge(-120)
          .linkDistance(80)
          .size([width, height]);

        // Collision Detection
        var padding = 4;
        var radius = 12;
        var collide = function (alpha, nodes) {
          var quadtree = d3.geom.quadtree(nodes);
          return function(d) {
            var rb = 2*radius + padding,
              nx1 = d.x - rb,
              nx2 = d.x + rb,
              ny1 = d.y - rb,
              ny2 = d.y + rb;
          quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
              var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y);
              if (l < rb) {
                l = (l - rb) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
              }//if(l<rb)
            }//if(quad.point...)
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
          });//quadtree.visit...
        };//return function(d)
      };//collide

        // Init the vis
        var svg = d3.select(element[0]).append('svg')
          .attr('width', width)
          .attr('height', height);

        scope.$watch('val', function(newVal) {

          // Nothing to do if no new data available
          if (!newVal) {return; }

          // D3 modifies the data, can cause issues back on Angular side
          var workingCopy = angular.copy(newVal);

          // Clear out the old elements
          svg.selectAll('*').remove();

          // Force layout
          force
            .nodes(workingCopy.nodes)
            .links(workingCopy.links)
            .start();

          //Create all the line svgs but without locations yet
          var link = svg.selectAll('.link')
            .data(workingCopy.links)
            .enter().append('line')
            .attr('class', 'link')
            // .style('stroke-width', function (d) { return Math.sqrt(d.value); });
            .style('stroke-width', '2' );

          // Create all the circle svgs but without locations yet
          var node = svg.selectAll('.node')
            .data(workingCopy.nodes)
            .enter().append('g')
            .attr('class', 'node')
            .on('click', function(item) { scope.$emit('nodeClicked', item); })
            .call(force.drag);

          node.append('circle')
            .attr('r', 10)
            .style('fill', function (d) {
            return color(d.group);
          });

          // Text labels
          node.append('text')
            .attr('dx', 11)
            .attr('dy', '.45em')
            .text(function(d) { return d.name; })
            .style('stroke', function(d) {return color(d.group);});

          // Provide SVGs co-ordinates
          force.on('tick', function() {
            link.attr('x1', function(d) { return d.source.x; })
              .attr('y1', function(d) { return d.source.y; })
              .attr('x2', function(d) { return d.target.x; })
              .attr('y2', function(d) { return d.target.y; });

            node.attr('cx', function(d) { return d.x; })
              .attr('cy', function(d) { return d.y; });

            d3.selectAll('circle').attr('cx', function (d) { return d.x; })
              .attr('cy', function (d) { return d.y; });
            d3.selectAll('text').attr('x', function (d) { return d.x; })
              .attr('y', function (d) { return d.y; });

            // Apply collision detection
            node.each(collide(0.5, workingCopy.nodes));

          }); //force.on(tick)
        });//$scope.$watch

      }//link
    };//return

  });//directive
