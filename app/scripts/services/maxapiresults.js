'use strict';

/**
 * @ngdoc service
 * @name globiProtoApp.maxApiResults
 * @description
 * # maxApiResults
 * Maximum number of API results to parse, to avoid crashing the brwoser.
 */
angular.module('globiProtoApp')
  .value('maxApiResults', 100);
