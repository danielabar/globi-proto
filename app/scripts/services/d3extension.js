// 'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.d3Extension
 * @description
 * http://jsbin.com/xohox/1/edit?js,output
 * http://stackoverflow.com/questions/25332120/create-additional-d3-js-symbols
 */
angular.module('globiProtoApp')
  .factory('d3Extension', function () {

    // TODO Use this to get path for star http://www.smiffysplace.com/stars.html
    var customSymbolTypes = d3.map({
      'star': function(size) {
        size = Math.sqrt(size);
        return 'M' + (-size/2) + ',' + (-size/2) +
          'l' + size + ',' + size +
          'm0,' + -(size) +
          'l' + (-size) + ',' + size;
      },
      'smiley': function(size) {
        size = Math.sqrt(size);
        var pad = size/5;
        var r = size/8;
        return 'M' + ((-size/2)+pad) + ',' + (-size/2) +
        ' m' + (-r) + ',0' +
        ' a' + r + ',' + r + ' 0 1,0' + (r * 2) + ',0' +
        ' a' + r + ',' + r + ' 0 1,0' + (-(r * 2)) + ',0' +

        'M' + ((size/2)-pad) + ',' + (-size/2) +
        ' m' + (-r) + ',0' +
        ' a' + r + ',' + r + ' 0 1,0' + (r * 2) + ',0' +
        ' a' + r + ',' + r + ' 0 1,0' + (-(r * 2)) + ',0' +

        'M' + (-size/2) + ',' + ((size/2)-(2*pad)) +
        'q' + (size/2) + ',' + (pad*2) + ' ' + size + ',0';
      }
    });

    d3.svg.customSymbol = function() {
      var type,
          size = 64;
      function symbol(d,i) {
        return customSymbolTypes.get(type.call(this,d,i))(size.call(this,d,i));
      }
      symbol.type = function(_) {
        if (!arguments.length) { return type; }
        type = d3.functor(_);
        return symbol;
      };
      symbol.size = function(_) {
        if (!arguments.length) { return size; }
        size = d3.functor(_);
        return symbol;
      };
      return symbol;
    };


    // Public API
    return {
      getSymbol: function (type, size) {
        size = size || 64;
        if (d3.svg.symbolTypes.indexOf(type) !== -1) {
          return d3.svg.symbol().type(type).size(size)();
        } else {
          return d3.svg.customSymbol().type(type).size(size)();
        }
      }
    };
  });
