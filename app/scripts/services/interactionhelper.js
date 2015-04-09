'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.interactionHelper
 * @description
 * # interactionHelper
 * Factory in the globiProtoApp.
 */
angular.module('globiProtoApp')
  .factory('interactionHelper', function (images, taxonInteractionDetails, $q) {

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

    var interactionDetailsPromise = function(sourceName, targetName, interactionType) {
      var deferred = $q.defer();
      var result = taxonInteractionDetails.query({
        sourceTaxon: sourceName,
        targetTaxon: targetName,
        interactionType: interactionType
      }, function() {
        deferred.resolve(result);
      });
      return deferred.promise;
    };

    var parseInteractionDetailsResult = function(interactionDetailsResponse) {
      return {
        studies: parseStudies(interactionDetailsResponse)
      };
    };

    var parseStudies = function(interactionDetailsResponse) {
      var uniqueStudies = {};
      interactionDetailsResponse.forEach(function(detail) {
        uniqueStudies[detail.study_title] = detail.study_url;
      });
      return Object.keys(uniqueStudies).map(function(studyTitle) {
        return {
          studyTitle: studyTitle,
          studyUrl: uniqueStudies[studyTitle]
        };
      });
    };

    // Public API
    return {

      getSourceTargetDetails: function (sourceName, targetName, interactionType) {
        var result;
        var deferred = $q.defer();
        $q.all([
          imagePromise(sourceName),
          imagePromise(targetName),
          interactionDetailsPromise(sourceName, targetName, interactionType)
        ]).then(function(data) {
          result = {
            sourceTaxonData: parseImageResult(data[0]),
            targetTaxonData: parseImageResult(data[1]),
            studies: parseInteractionDetailsResult(data[2]).studies
          };
          deferred.resolve(result);
        });
        return deferred.promise;
      }

    };
  });
