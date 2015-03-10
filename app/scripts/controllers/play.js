'use strict';

/**
 * @ngdoc function
 * @name globiProtoApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 * Controller of the globiProtoApp
 */
angular.module('globiProtoApp')
  .controller('PlayCtrl', function () {
    // Experiment pass data from Angular to Canvas
    var species = 'Thunnus albacares';
    TP.init(species);
  });
