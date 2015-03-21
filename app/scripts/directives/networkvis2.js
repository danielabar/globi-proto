angular.module('globiProtoApp')
  .directive('networkVis', function() {

    var width = 960;
    var height = 500;

    var force = d3.layout.force()
      .charge(-120)
      .linkDistance(30)
      .size([width, height]);

    return {
      restrict: 'E',
      scope: {
        val: '='
      },
      link: function(scope) {

        // set up initial svg object
        var svg = d3.select('body').append('svg')
          .attr('width', width)
          .attr('height', height);

        scope.$watch('val', function(newVal) {
          if (!newVal) {return; }
          svg.selectAll('*').remove();

          force
            .nodes(newVal.nodes)
            .links(newVal.links)
            .start();

            var link = svg.selectAll('.link')
              .data(newVal.links)
              .enter().append('line')
              .attr('class', 'link')
              .style('stroke-width', function(d) { return Math.sqrt(d.weight); });

            var node = svg.selectAll('.node')
              .data(newVal.nodes)
              .enter().append('g')
              .attr('class', 'node')
              .call(force.drag);

            node.append('circle')
              .attr('r','5');

            node.append('text')
              .attr('dx', 12)
              .attr('dy', '.35em')
              .text(function(d) { return d.name; });

              force.on('tick', function() {
                link.attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });
                node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
              });
        });//$scope.$watch

      }//link
    };//return

  });//directive
