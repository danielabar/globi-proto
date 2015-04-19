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

    // study_title is used as the unique id
    var parseStudies = function(interactionDetailsResponse) {
      var uniqueStudies = {};
      interactionDetailsResponse.forEach(function(detail) {
        uniqueStudies[detail.study_title] = {
          studyUrl: detail.study_url,
          studyCitation: detail.study_citation,
          studySourceCitation: detail.study_source_citation
        };
      });
      return Object.keys(uniqueStudies).map(function(studyTitle) {
        return {
          studyTitle: studyTitle,
          studyUrl: uniqueStudies[studyTitle].studyUrl,
          studyCitation: uniqueStudies[studyTitle].studyCitation,
          studySourceCitation: uniqueStudies[studyTitle].studySourceCitation
        };
      });
    };

    var buildGeoMessage = function(studyUrl, numObservations) {
      var observationGrammar = numObservations > 1 ? 'Observations' : 'Observation';
      if (studyUrl) {
        return '<a target="_blank" href="' + studyUrl + '">' +
          numObservations + ' ' + observationGrammar + '</a>';
      } else {
        return numObservations + ' ' + observationGrammar;
      }
    };

    var parseGeo = function(interactionDetailsResponse) {
      var uniqueHolder = {};
      interactionDetailsResponse.forEach(function(interactionDetail) {
        if (interactionDetail.study_title && interactionDetail.latitude && interactionDetail.longitude) {
          var uniqueKey = interactionDetail.study_title.replace(/\s|\-/g, '') + interactionDetail.latitude.toString().replace('-','#') + '_' + interactionDetail.longitude.toString().replace('-','#');
          if (uniqueHolder[uniqueKey]) {
            uniqueHolder[uniqueKey].itemCount += 1;
            uniqueHolder[uniqueKey].message = buildGeoMessage(interactionDetail.study_url, uniqueHolder[uniqueKey].itemCount);
          } else {
            uniqueHolder[uniqueKey] = {
              lat: interactionDetail.latitude,
              lng: interactionDetail.longitude,
              layer: 'interactions',  // TODO: Caller should pass the layer
              message: buildGeoMessage(interactionDetail.study_url, 1),
              // focus: true,
              draggable: false,
              itemCount: 1
            };
          }
        }
      });
      return uniqueHolder;
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
          deferred.resolve(result);
        });
        return deferred.promise;
      }

    };
  });
