'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.interactionService
 * @description
 * # interactionService
 * Factory in the globiProtoApp.
 */
angular.module('globiProtoApp')
  .factory('interactionService', function () {

    // Public API
    return {
      removeDuplicateTargets: function (interactions) {
        var result = [];
        var seen = {};
        interactions.forEach(function(interaction) {
          seen[interaction.target_taxon_name] = interaction;
        });
        Object.keys(seen).forEach(function(key) {
          result.push(seen[key]);
        });
        return result;
      }
    };
  });
