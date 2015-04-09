'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.interactionHelper
 * @description
 * # interactionHelper
 * Factory in the globiProtoApp.
 */
angular.module('globiProtoApp')
  .factory('interactionHelper', function (images, $q) {

    var imagePromise = function(taxonName) {
      var deferred = $q.defer();
      var result = images.get({taxon: taxonName}, function() {
        deferred.resolve(result);
      });
      return deferred.promise;
    };

    var parseImageResult = function(imageResponse) {
      return {
        scientificName: imageResponse.scientificName,
        commonName: imageResponse.commonName,
        thumbnailURL: imageResponse.thumbnailURL,
        imageURL: imageResponse.imageURL,
        infoURL: imageResponse.infoURL,
      };
    };

    // Public API
    return {

      getSourceTargetDetails: function (sourceNodeName, targetNodeName) {
        var result;
        var deferred = $q.defer();
        $q.all([
          imagePromise(sourceNodeName),
          imagePromise(targetNodeName)
        ]).then(function(data) {
          result = {
            sourceTaxonData: parseImageResult(data[0]),
            targetTaxonData: parseImageResult(data[1])
          };
          deferred.resolve(result);
        });
        return deferred.promise;
      }

    };
  });
