'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.taxonInteractionDetails
 * @description
 * # Get all the interactions of a specified source taxon
 * Factory in the globiProtoApp.
 */

angular.module('globiProtoApp')
  .factory('taxonInteraction', function ($resource, apiUrl, maxApiResults) {
    return $resource(apiUrl + '/interaction', {
        sourceTaxon: '@sourceTaxon',
        interactionType: '@interactionType',
        fields: 'source_taxon_name,source_taxon_path,interaction_type,target_taxon_name,target_taxon_path',
        type: 'json.v2',
        limit: maxApiResults
      });
  });
