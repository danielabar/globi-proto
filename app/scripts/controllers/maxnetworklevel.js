'use strict';

/**
 * @ngdoc function
 * @name globiProtoApp.controller:MaxNetworkLevelCtrl
 * @description
 * # MaxNetworkLevelCtrl
 * Controller for the Max Network Level reached modal.
 */
angular.module('globiProtoApp')
  .controller('MaxNetworkLevelCtrl', function ($scope, $modalInstance, modalData) {

    $scope.modalData = modalData;

    $scope.ok = function () {
      $modalInstance.close(modalData);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });
