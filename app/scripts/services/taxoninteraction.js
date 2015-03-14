'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.taxonInteraction
 * @description
 * # taxonInteraction
 * Factory in the globiProtoApp.
 */
angular.module('globiProtoApp')
  .factory('taxonInteraction', function ($resource, apiUrl) {
    return $resource(apiUrl + '/taxon/:taxon/:interaction', {taxon: '@taxon', interaction: '@interaction'});
  });