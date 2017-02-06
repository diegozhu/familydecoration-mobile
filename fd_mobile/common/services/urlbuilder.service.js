/**
 **************************** Url Builder Service****************************
 *
 * UrlBuilder is responsible for create url according to the client
 * input uri.
 *
 * How to use:
 * 1. Inject service:
 * mobileService.$inject = [UrlBuilder'];
 * 2. Build URL:
 * $resource(urlBuilder.build('mobiles/:id'))
 *
 */

(function() {
  'use strict';

  angular
    .module('fdmobile')
    .factory('urlBuilder', urlBuilder);

  urlBuilder.$inject = ['CONSTANT'];

  function urlBuilder(CONSTANT) {

    var protocol = 'http://',
      host = CONSTANT.HOST,
      port = CONSTANT.PORT,
      nutritionHost = CONSTANT.NUTRITION_HOST,
      mutritionPort = CONSTANT.NUTRITION_PORT,
      nutritionBaseURI = '/nutrition-coaching/service/',
      baseURI = '/ccs/service/',
      builder = {};

    builder.build = build;
    builder.nutritionBuild = nutritionBuild;

    function build(uri) {
      if (uri) {
        return protocol + host + ':' + port + baseURI + uri;
      }
    }
    function nutritionBuild(uri) {
      if (uri) {
        return protocol + nutritionHost + ':' + mutritionPort + nutritionBaseURI + uri;
      }
    }

    return builder;
  }
})();
