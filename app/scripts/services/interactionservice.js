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

    // Heuristic to determine if its a species rather than a higher order classification
    var MIN_TAXON_PATH = 6;

    var calculateTaxonPathLength = function(taxonPath) {
      var split,
        pathLength = 0;

      if (taxonPath) {
        split = taxonPath.split('|');
        if (split && split.length > 0) {
          pathLength = split.length;
        }
      }
      return pathLength;
    };

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
      },

      removeShallowTaxonPaths: function(interactions) {
        var filtered = [],
          taxonPath;

        if (interactions && interactions.length > 0) {
          filtered = interactions.filter(function(interaction) {
            taxonPath = interaction.target_taxon_path;
            // temp debug
            if (calculateTaxonPathLength(taxonPath) < MIN_TAXON_PATH) {
              console.log('=== filtered out due to shallow taxon path: ' + interaction.target_taxon_name + ', ' + interaction.target_taxon_path);
            }
            return calculateTaxonPathLength(taxonPath) >= MIN_TAXON_PATH;
          });
        }

        return filtered;
      }
    };
  });
