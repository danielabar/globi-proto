'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.images
 * @description
 * # images
 * Factory in the globiProtoApp.
 */
angular.module('globiProtoApp')
  .factory('images', function ($resource, apiUrl) {
    return $resource(apiUrl + '/imagesForName/:taxon',
      {taxon: '@taxon'},
      {'GET' : {cache: true}
    });
  });
