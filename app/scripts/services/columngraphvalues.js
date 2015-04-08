'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.columnGraphValues
 * @description
 * # columnGraphValues
 * Constants for column graph visualization.
 */
angular.module('globiProtoApp')
  .value('columnGraphValues', {
    height: 700,
    maxLevel: 6,
    maxNodesPerSource: 20
  });
