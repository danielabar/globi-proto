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

    var KINGDOM_VIS = {
      'Null' : {
        shape: 'circle',
        empty: true
      },
      'Animalia' : {
        shape: 'circle',
        wiki: 'http://en.wikipedia.org/wiki/Animal'
      },
      'Bacteria' : {
        shape: 'star',
        wiki: 'http://en.wikipedia.org/wiki/Bacterial_taxonomy'
      },
      'Chromista' : {
        shape: 'triangle-down',
        wiki: 'http://en.wikipedia.org/wiki/Chromista'
      },
      'Fungi' : {
        shape: 'square',
        wiki: 'http://en.wikipedia.org/wiki/Fungus'
      },
      'Metazoa' : {
        shape: 'triangle-up',
        wiki: 'http://en.wikipedia.org/wiki/Animal'
      },
      'Plantae' : {
        shape: 'diamond',
        wiki: 'http://en.wikipedia.org/wiki/Plant'
      },
      'Protista' : {
        shape: 'triangle-up',
        rotate: '-90',
        wiki: 'http://en.wikipedia.org/wiki/Protist'
      },
      'Protozoa' : {
        shape: 'triangle-up',
        rotate: '90',
        wiki: 'http://en.wikipedia.org/wiki/Protozoa'
      },
      'Viridiplantae' : {
        shape: 'cross',
        rotate: '45'
      },
      'Viruses' : {
        shape: 'cross',
        wiki: 'http://en.wikipedia.org/wiki/Virus'
      }
    };

    // Public API
    return {

      extractKingdom: function (taxonPath) {
        if (taxonPath) {
          var parts = taxonPath.split('|');
          return parts[0].trim();
        } else {
          return DEFAULT_KINGDOM;
        }
      },

      shapeInfo: function(kingdom) {
        var result = KINGDOM_VIS[kingdom];
        return result || KINGDOM_VIS[DEFAULT_KINGDOM];
      },

      legend: function() {
        return Object.keys(KINGDOM_VIS).map(function(key) {
          return {
            kingdom: key,
            shape: KINGDOM_VIS[key].shape,
            rotate: KINGDOM_VIS[key].rotate,
            empty: KINGDOM_VIS[key].empty,
            wiki: KINGDOM_VIS[key].wiki
          };
        });
      }

    };
  });
