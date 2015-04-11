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
  .controller('NetworkCtrl', function ($scope, $state, taxonInteractionFields, images, graphService, interactionHelper, toaster, $window) {

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
        infoURL: response.infoURL,
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
      });
    });

    $scope.$on('maxLevelNodeClicked', function(evt, maxVal) {
      toaster.pop('warning', 'Max reached', 'This version only supports up to ' + maxVal + ' levels of exploration. Please select any earlier node in the graph to continue.');
    });

    $scope.$on('legendClicked', function(evt, legendItem) {
      if (legendItem.wiki) {
        $window.open(legendItem.wiki, '_blank');
      }
    });

  });
