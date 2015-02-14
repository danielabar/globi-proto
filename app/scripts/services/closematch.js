'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.closeMatch
 * @description
 * # closeMatch
 * Factory in the globiProtoApp.
 */
angular.module('globiProtoApp')
  .factory('closeMatch', function ($resource, apiUrl) {
    return $resource(apiUrl + '/findCloseMatchesForTaxon/:taxon', {taxon: '@taxon'});
  });
