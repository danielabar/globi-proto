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

    var DEFAULT_KINGDOM = 'Animalia';

    // Public API here
    return {
      extractKingdom: function (taxonPath) {
        if (taxonPath) {
          var parts = taxonPath.split('|');
          return parts[0].trim();
        } else {
          return DEFAULT_KINGDOM;
        }
      }
    };
  });
