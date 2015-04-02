'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.taxonInteractionDetails
 * @description
 * # taxonInteractionDetails
 * Factory in the globiProtoApp.
 */

angular.module('globiProtoApp')
  .factory('taxonInteractionFields', function ($resource, apiUrl) {
    return $resource(apiUrl + '/interaction',
      {
        interactionType: '@interactionType',
        sourceTaxon: '@sourceTaxon',
        fields: 'source_taxon_name,source_taxon_path,interaction_type,target_taxon_name,target_taxon_path',
        type: 'json.v2'
      });
  });
