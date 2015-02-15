'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.interactionTypes
 * @description
 * # interactionTypes
 * Factory in the globiProtoApp.
 */
angular.module('globiProtoApp')
  .factory('interactionTypes', function ($resource, apiUrl) {
    return $resource(apiUrl + '/interactionTypes');
  });
