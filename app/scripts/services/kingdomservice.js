'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.kingdomService
 * @description
 * # kingdomService
 * Factory in the globiProtoApp.
 */
angular.module('globiProtoApp')
  .factory('kingdomService', function () {

    var DEFAULT_KINGDOM = 'Null';

    // TODO: Bacteria star???
    var KINGDOM_VIS = {
      'Null' : {
        shape: 'circle',
        empty: true
      },
      'Animalia' : {
        shape: 'circle'
      },
      'Chromista' : {
        shape: 'triangle-down'
      },
      'Fungi' : {
        shape: 'square'
      },
      'Metazoa' : {
        shape: 'triangle-up'
      },
      'Plantae' : {
        shape: 'diamond'
      },
      'Protista' : {
        shape: 'triangle-up',
        rotate: '-90'
      },
      'Protozoa' : {
        shape: 'triangle-up',
        rotate: '90'
      },
      'Viridiplantae' : {
        shape: 'cross',
        rotate: '45'
      },
      'Viruses' : {
        shape: 'cross'
      }
    };

    // Public API
    return {

      extractKingdom: function (taxonPath) {
        console.log('=== KINGDOM SERVICE: taxonPath = ' + taxonPath);
        if (taxonPath) {
          var parts = taxonPath.split('|');
          return parts[0].trim();
        } else {
          return DEFAULT_KINGDOM;
        }
      },

      shapeInfo: function(kingdom) {
        console.log('=== KINGDOM SERVICE: kingdom = ' + kingdom);
        var result = KINGDOM_VIS[kingdom];
        return result || KINGDOM_VIS[DEFAULT_KINGDOM];
      }

    };
  });
