/**
 ***************************** nutritionService *****************************
 *
 * This service is for interacting with REST web service.
 *
 */
'use strict';

(function() {
  angular.module('fdmobile.nutrition').factory('nutritionService', nutritionService);

  nutritionService.$inject = ['$resource', 'urlBuilder'];

  function nutritionService($resource, urlBuilder) {
    return $resource(urlBuilder.nutritionBuild('foodlibrary/bymobile'), {}, {
      mobileInfo: {
        method: 'GET',
        url: urlBuilder.build('integration/nutrition/mobile')
      },
      foodLibrary: {
        method: 'POST'
      },
      getFoodVolume: {
        method: 'POST',
        url: urlBuilder.nutritionBuild('coach/nutrition')
      },
      foodImage: {
        method: 'GET',
        url: urlBuilder.nutritionBuild('wiki/piclist')
      },
      educationCard: {
        method: 'GET',
        url: urlBuilder.nutritionBuild('wiki/content/:foodName')
      }
    });
  }
})();
