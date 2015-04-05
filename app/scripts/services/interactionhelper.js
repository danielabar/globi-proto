'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.interactionHelper
 * @description
 * # interactionHelper
 * Factory in the globiProtoApp.
 */
angular.module('globiProtoApp')
  .factory('interactionHelper', function () {

    // Public API
    return {

      getSourceTargetDetails: function () {
        // Hard code some data for proof of concept, the real thing will have to make a few http calls...
        var result = {
          sourceTaxonData: {
            scientificName: 'Thunnus albacares',
            commonName: 'Yellowfin Tuna',
            thumbnailURL: 'http://media.eol.org/content/2009/05/21/17/48356_98_68.jpg',
            imageURL: 'http://whatever',
            infoURL: 'http://eol.org/pages/205934'
          },
          interactionType: 'eats',
          targetTaxonData: {
            scientificName: 'Teuthida',
            commonName: 'Squid',
            thumbnailURL: 'http://media.eol.org/content/2010/12/10/04/25917_98_68.jpg',
            imageURL: 'http://whatever',
            infoURL: 'http://eol.org/pages/2336'
          },
          studies: [
            {studyTitle: 'foo', studyUrl: 'http://bar'},
            {studyTitle: 'foo2', studyUrl: 'http://bar2'}
          ],
          hasGeo: true
        };
        return result;
      }

    };
  });
