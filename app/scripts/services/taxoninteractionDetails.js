'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.taxonInteractionDetails
 * @description
 * # taxonInteractionDetails
 * Factory in the globiProtoApp.
 */

 /*
 http://api.globalbioticinteractions.org/interaction?
  interactionType=preysOn&
  sourceTaxon=Thunnus alalunga&
  targetTaxon=Gonatus steenstrup&
  includeObservations=true
*/

angular.module('globiProtoApp')
  .factory('taxonInteractionDetails', function ($resource, apiUrl) {
    return $resource(apiUrl + '/interaction',
      {
        interactionType: '@interactionType',
        sourceTaxon: '@sourceTaxon',
        targetTaxon: '@targetTaxon',
        includeObservations: 'true',
        type: 'json.v2'
      });
  });
