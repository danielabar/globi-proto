'use strict';

// http://briantford.com/blog/angular-d3

/**
 * @ngdoc function
 * @name globiProtoApp.controller:NetworkCtrl
 * @description
 * # NetworkCtrl
 * Controller of the globiProtoApp
 */
angular.module('globiProtoApp')
  .controller('NetworkCtrl', function ($scope, $state, taxonInteractionFields, images,
      graphService, interactionHelper, toaster, $window, $modal, leafletData) {

    $scope.isHelpCollapsed = true;

    $scope.mapDefaults = {
      scrollWheelZoom: false
    };

    graphService.init();

    $scope.interactionDetails = {
      show: false
    };

    // Pre-populate a good example if one is not provided by the user
    $scope.query = {
      sourceTaxon: $state.params.taxon || 'Thunnus obesus',
      interactionType: $state.params.interaction || 'eats'
    };

    $scope.$on('followEvent', function(evt, eventData) {
      $state.transitionTo('network', {
        taxon: eventData.imageData.scientificName,
        interaction: eventData.interactionType
      }, {location: true, reload: true});
    });

    taxonInteractionFields.query($scope.query, function(response) {
      if (response.length > 0) {
        var sourceTaxon = {
          name: $scope.query.sourceTaxon,
          group: 1
        };
        var graphData = graphService.append(response, sourceTaxon);
        graphData.action = 'add';
        $scope.graph = graphData;
        $scope.columnGraph = graphData;
      } else {
        toaster.pop('note', 'Sorry', 'No interactions found for: ' + $scope.query.sourceTaxon + ' ' + $scope.query.interactionType);
      }
    }, function(err) {
      console.dir(err);
    });

    $scope.$on('nodeClicked', function(evt, taxon) {
      var graphData;

      if (graphService.getCurrentGroupNumber() >= taxon.group) {
        graphData = graphService.rewind(taxon);
        graphData.action = 'remove';
        $scope.columnGraph = graphData;
      }

      taxonInteractionFields.query({sourceTaxon: taxon.name, interactionType: $scope.query.interactionType}, function(response) {
        if (response.length > 0) {
          graphData = graphService.append(response, taxon);
          graphData.action = 'add';
          $scope.graph = graphData;
          $scope.columnGraph = graphData;
        } else {
          toaster.pop('note', 'Sorry', 'No interactions found for: ' + taxon.name + ' ' + $scope.query.interactionType);
        }
      }, function(err) {
        console.dir(err);
      });
    });

    $scope.breadcrumbs = graphService.getPath();

    // Card data for subject taxon (starting point of the vis)
    images.get({taxon: $scope.query.sourceTaxon}).$promise.then(function(response) {
      $scope.subjectTaxon = {
        scientificName: response.scientificName,
        commonName: response.commonName,
        thumbnailURL: response.thumbnailURL,
        imageURL: response.imageURL,
        infoURL: response.infoURL
      };
    }, function(err) {
      console.dir(err);
    });

    $scope.$on('linkClicked', function(evt, linkItem) {
      $scope.interactionDetails = {};
      var linkNodes = graphService.getLinkNodes(linkItem);
      interactionHelper.getSourceTargetDetails(linkNodes.sourceName, linkNodes.targetName, $scope.query.interactionType).then(function(response) {
        $scope.interactionDetails = response;
        $scope.interactionDetails.show = true;
        leafletData.getMap('interactionMap').then(function(map) {
          var mapMarkers = $scope.interactionDetails.mapMarkers;
          var markersArray = [];
          Object.keys(mapMarkers).forEach(function(key) {
            if (mapMarkers.hasOwnProperty(key)) {
              markersArray.push(L.latLng(mapMarkers[key].lat, mapMarkers[key].lng));
            }
          });
          if (markersArray.length) {
            map.fitBounds(new L.latLngBounds(markersArray));
          }
        });
      });
    });

    $scope.$on('maxLevelNodeClicked', function(evt, eventData) {
      var modalInstance = $modal.open({
        templateUrl: 'views/maxNetworkLevel.html',
        controller: 'MaxNetworkLevelCtrl',
        resolve: {
          modalData: function () {
            return {
              maxLevel: eventData.maxLevel,
              taxon: eventData.node.name,
              interaction: $scope.query.interactionType
            };
          }
        }
      });

      modalInstance.result.then(function (modalData) {
        $state.transitionTo('network', {
          taxon: modalData.taxon,
          interaction: modalData.interaction
        }, {location: true, reload: true});
      }, function () { });
    });

    $scope.$on('legendClicked', function(evt, legendItem) {
      if (legendItem.wiki) {
        $window.open(legendItem.wiki, '_blank');
      }
    });

  });
