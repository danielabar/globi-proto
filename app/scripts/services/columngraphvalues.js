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
    height: 500,
    maxLevel: 10,
    maxNodesPerSource: 10
  });
