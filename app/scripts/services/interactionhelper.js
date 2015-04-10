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

    var parseGeo = function(interactionDetailsResponse) {
      var uniqueHolder = {};
      interactionDetailsResponse.forEach(function(interactionDetail) {
        if (interactionDetail.study_title && interactionDetail.latitude && interactionDetail.longitude) {
          var uniqueKey = interactionDetail.study_title.replace(/\s|\-/g, '') + interactionDetail.latitude.toString().replace('-','#') + '_' + interactionDetail.longitude.toString().replace('-','#');
          if (uniqueHolder[uniqueKey]) {
            uniqueHolder[uniqueKey].itemCount += 1;
            uniqueHolder[uniqueKey].message = uniqueHolder[uniqueKey].itemCount + ' Observations, ' + '<a target="_blank" href="' + interactionDetail.study_url + '">' + interactionDetail.study_title + '</a>';
          } else {
            uniqueHolder[uniqueKey] = {
              lat: interactionDetail.latitude,
              lng: interactionDetail.longitude,
              message: '1 Observation, ' + '<a target="_blank" href="' + interactionDetail.study_url + '">' + interactionDetail.study_title + '</a>',
              focus: true,
              draggable: false,
              itemCount: 1
            };
          }
        }
      });
      return uniqueHolder;
    };

    var calculateMapCenter = function(markers) {
      var totalLat = 0;
      var totalLng = 0;
      Object.keys(markers).forEach(function(key) {
        totalLat += markers[key].lat;
        totalLng += markers[key].lng;
      });
      return {
        lat: totalLat / Object.keys(markers).length,
        lng: totalLng / Object.keys(markers).length,
        zoom: 3
      };
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
            studies: parseStudies(data[2]),
            mapMarkers: parseGeo(data[2]),
          };
          result.mapCenter = calculateMapCenter(result.mapMarkers);
          deferred.resolve(result);
        });
        return deferred.promise;
      }

    };
  });
