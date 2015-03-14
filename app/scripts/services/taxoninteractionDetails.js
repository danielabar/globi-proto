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
    return $resource(apiUrl + '/taxon/:sourceTaxon/:interactionType/:targetTaxon',
      {
        sourceTaxon: '@sourceTaxon',
        targetTaxon: '@targetTaxon',
        interactionType: '@interactionType',
        includeObservations: 'true'
      });
  });
