'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.columnGraphValues
 * @description
 * # columnGraphValues
 * Shared constants for column graph visualization.
 */
angular.module('globiProtoApp')
  .value('columnGraphValues', {
    width: 960,
    height: 700,
    maxLevel: 6,
    maxNodesPerSource: 20
  });
