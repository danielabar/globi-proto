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
        var i, r, yAngle, cmd, xsvg, ysvg, xResult, yResult, radiusi, radiuso;
        var result = "";
        var svgData = "";
        var baseAngle = (2 * Math.PI) / 10;
        var oddEven = 0;
        var counter = 0;
        var centrePoint = 0;
        var startX = 0;
        var startY = 0;
        var number_format = function number_format (number, decimals, dec_point, thousands_sep) {
          // http://kevin.vanzonneveld.net
          // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
          // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
          // +     bugfix by: Michael White (http://getsprink.com)
          // +     bugfix by: Benjamin Lupton
          // +     bugfix by: Allan Jensen (http://www.winternet.no)
          // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
          // +     bugfix by: Howard Yeend
          // +    revised by: Luke Smith (http://lucassmith.name)
          // +     bugfix by: Diogo Resende
          // +     bugfix by: Rival
          // +      input by: Kheang Hok Chin (http://www.distantia.ca/)
          // +   improved by: davook
          // +   improved by: Brett Zamir (http://brett-zamir.me)
          // +      input by: Jay Klehr
          // +   improved by: Brett Zamir (http://brett-zamir.me)
          // +      input by: Amir Habibi (http://www.residence-mixte.com/)
          // +     bugfix by: Brett Zamir (http://brett-zamir.me)
          // +   improved by: Theriault
          // +      input by: Amirouche
          // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
          // *     example 1: number_format(1234.56);
          // *     returns 1: '1,235'
          // *     example 2: number_format(1234.56, 2, ',', ' ');
          // *     returns 2: '1 234,56'
          // *     example 3: number_format(1234.5678, 2, '.', '');
          // *     returns 3: '1234.57'
          // *     example 4: number_format(67, 2, ',', '.');
          // *     returns 4: '67,00'
          // *     example 5: number_format(1000);
          // *     returns 5: '1,000'
          // *     example 6: number_format(67.311, 2);
          // *     returns 6: '67.31'
          // *     example 7: number_format(1000.55, 1);
          // *     returns 7: '1,000.6'
          // *     example 8: number_format(67000, 5, ',', '.');
          // *     returns 8: '67.000,00000'
          // *     example 9: number_format(0.9, 0);
          // *     returns 9: '1'
          // *    example 10: number_format('1.20', 2);
          // *    returns 10: '1.20'
          // *    example 11: number_format('1.20', 4);
          // *    returns 11: '1.2000'
          // *    example 12: number_format('1.2000', 3);
          // *    returns 12: '1.200'
          // *    example 13: number_format('1 000,50', 2, '.', ' ');
          // *    returns 13: '100 050.00'
          // Strip all characters but numerical ones.
          number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
          var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s,
            toFixedFix = function (n, prec) {
              var k = Math.pow(10, prec);
              return '' + Math.round(n * k) / k;
            };
          // Fix for IE parseFloat(0.55).toFixed(0) = 0;
          s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
          if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
          }
          if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
          }
          return s.join(dec);
        };

        size = Math.sqrt(size);
        radiuso = size;
        radiusi = size * 0.4;

        /*
         Smiffy's SVG Path Shape Generator by Matthew Smith is licensed under a Creative Commons Attribution 3.0 Unported License.
         Based on a work at http://www.smiffysplace.com/shapes.html and http://www.smiffysplace.com/shapes.js.
         */

        /*
         Calculate points. Skew code is buggy, so
         skew value forced to zero.
         */
        for (i = 0; i <= Math.PI * 2; i += baseAngle)
        {
          if (oddEven === 0)
          {
            /* Start on inner radius. */
            r = radiusi;
            oddEven = 1;
            yAngle = i;
          }
          else
          {
            /* Even points on outer radius. */
            r = radiuso;
            oddEven = 0;
            yAngle = i;
          }

          if (counter == 0)
          {
            cmd = 'M';
          }
          else
          {
            cmd = 'L';
          }

          xsvg = number_format( (r * Math.sin(i)) + centrePoint, 3, '.', '');
          ysvg = number_format( (r * Math.cos(yAngle)) + centrePoint, 3, '.', '');

          xResult = number_format( (r * Math.sin(i)) + parseFloat(startX), 3, '.', '');
          yResult = number_format( (r * Math.cos(yAngle)) + parseFloat(startY), 3, '.', '');

          result += cmd + ' ' + xResult + ' ' + yResult + '\n';
          svgData += cmd + ' ' + xsvg + ' ' + ysvg + '\n';

          counter++;
        }

        return svgData;
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
