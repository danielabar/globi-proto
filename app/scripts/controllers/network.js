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
  .controller('NetworkCtrl', function ($scope, $state, taxonInteraction, images,
      graphService, interactionHelper, toaster, $window, $modal, leafletData) {

    $scope.isHelpCollapsed = true;

    // TODO map stuff should get pulled out into separate directive/controller
    $scope.mapDefaults = {
      scrollWheelZoom: false
    };

    graphService.init();

    $scope.interactionDetails = {
      show: false
    };

    // Pre-populate a good example if one is not provided by the user
    $scope.query = {
      sourceTaxon: $state.params.sourceTaxon || 'Thunnus obesus',
      interactionType: $state.params.interactionType || 'eats'
    };

    $scope.$on('followEvent', function(evt, eventData) {
      $state.transitionTo('network', {
        sourceTaxon: eventData.imageData.scientificName,
        interactionType: eventData.interactionType
      }, {location: true, reload: true});
    });

    taxonInteraction.query($scope.query, function(response) {
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

      taxonInteraction.query({
        sourceTaxon: taxon.name,
        interactionType: $scope.query.interactionType
      }, function(response) {
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

    // Map Stuff (TODO this should go in a separate directive/controller)
    /* Latitude:27.3649°
Longitude:-82.623643°*/
    $scope.mapCenter = {
      lat: 27.3649,
      lng: -82.623643,
      zoom: 2
    };

    $scope.layers = {
      baselayers: {
        osm: {
        name: 'OpenStreetMap',
          type: 'xyz',
          url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          layerOptions: {
              subdomains: ['a', 'b', 'c'],
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              continuousWorld: true
          }
        }
      },
      overlays: {
        // hillshade: {
        //   name: 'Hillshade Europa',
        //   type: 'wms',
        //   url: 'http://129.206.228.72/cached/hillshade',
        //   visible: true,
        //   layerOptions: {
        //       layers: 'europe_wms:hs_srtm_europa',
        //       format: 'image/png',
        //       opacity: 0.25,
        //       attribution: 'Hillshade layer by GIScience http://www.osm-wms.de',
        //       crs: L.CRS.EPSG900913
        //   }
        // },
        interactions: {
          name: 'interactions',
          type: 'markercluster',
          visible: true
        }
      }
    };

    // temp hack to get cluster thingie working
    // $scope.interactionDetails = {};
    // $scope.interactionDetails.mapMarkers = {
    //   m1: {
    //       lat: 42.20133,
    //       lng: 2.19110,
    //       layer: 'interactions',
    //       message: 'Im a moving car'
    //     }
    // };

    $scope.$on('linkClicked', function(evt, linkItem) {
      $scope.interactionDetails = {};
      var linkNodes = graphService.getLinkNodes(linkItem);
      interactionHelper.getSourceTargetDetails(
        linkNodes.sourceName, linkNodes.targetName, $scope.query.interactionType
      ).then(function(response) {
        $scope.interactionDetails = response;
        $scope.interactionDetails.show = true;
        leafletData.getMap('interactionMap').then(function(map) {
          var mapMarkers = $scope.interactionDetails.mapMarkers;
          var markersArray = [];
          Object.keys(mapMarkers).forEach(function(key, i) {
            if (mapMarkers.hasOwnProperty(key)) {
              // console.log('=== lat: ' + mapMarkers[key].lat + ', lng: ' + mapMarkers[key].lng);
              // { lat: foo, lng: bar, layer: 'interactions'},
              console.log('m' + i + ': {lat: ' + mapMarkers[key].lat + ', lng: ' + mapMarkers[key].lng + ', layer: "interactions"},');
              markersArray.push(L.latLng(mapMarkers[key].lat, mapMarkers[key].lng));
            }
          });
          if (markersArray.length) {
            // map.fitBounds(new L.latLngBounds(markersArray));
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
              sourceTaxon: eventData.node.name,
              interactionType: $scope.query.interactionType
            };
          }
        }
      });

      modalInstance.result.then(function (modalData) {
        $state.transitionTo('network', {
          sourceTaxon: modalData.sourceTaxon,
          interactionType: modalData.interactionType
        }, {location: true, reload: true});
      }, function () { });
    });

    $scope.$on('legendClicked', function(evt, legendItem) {
      if (legendItem.wiki) {
        $window.open(legendItem.wiki, '_blank');
      }
    });

  });
