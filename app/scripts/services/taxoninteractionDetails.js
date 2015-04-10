'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.taxonInteractionDetails
 * @description
 * # taxonInteractionDetails
 * Factory in the globiProtoApp.
 */

angular.module('globiProtoApp')
  .factory('taxonInteractionDetails', function ($resource, apiUrl) {
    return $resource(apiUrl + '/interaction',
      {
        interactionType: '@interactionType',
        sourceTaxon: '@sourceTaxon',
        targetTaxon: '@targetTaxon',
        includeObservations: 'true',
        fields: 'study_title,study_url,latitude,longitude,source_taxon_name,target_taxon_name',
        type: 'json.v2'
      });
  });