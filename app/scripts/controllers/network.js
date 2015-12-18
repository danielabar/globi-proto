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
      graphService, interactionHelper, interactionService, toaster, $window, $modal) {

    $scope.isHelpCollapsed = true;

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
      var deduped,
        speciesOnly,
        sourceTaxon,
        graphData;

      if (response.length > 0) {
        deduped = interactionService.removeDuplicateTargets(response);
        speciesOnly = interactionService.removeShallowTaxonPaths(deduped);
        sourceTaxon = {
          name: $scope.query.sourceTaxon,
          group: 1
        };
        graphData = graphService.append(speciesOnly, sourceTaxon);
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
        var deduped,
          speciesOnly;

        if (response.length > 0) {
          deduped = interactionService.removeDuplicateTargets(response);
          speciesOnly = interactionService.removeShallowTaxonPaths(deduped);
          graphData = graphService.append(speciesOnly, taxon);
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
      // $scope.interactionDetails = {};
      var linkNodes = graphService.getLinkNodes(linkItem);
      interactionHelper.getSourceTargetDetails(
        linkNodes.sourceName, linkNodes.targetName, $scope.query.interactionType
      ).then(function(response) {
        $scope.interactionDetails = response;
        $scope.interactionDetails.show = true;
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
