'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.taxonInteraction
 * @description
 * # Get all the interactions of a specified source taxon
 * Factory in the globiProtoApp.
 */
angular.module('globiProtoApp')
  .factory('taxonInteraction2', function ($resource, apiUrl, maxApiResults) {
    return $resource(apiUrl + '/interaction', {
      sourceTaxon: '@sourceTaxon',
      interactionType: '@interactionType',
      type: 'json.v2',
      limit: maxApiResults});
  });
