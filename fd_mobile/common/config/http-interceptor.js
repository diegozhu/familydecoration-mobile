(function() {
  'use strict';

  angular
    .module('fdmobile')
    .factory('httpInterceptor', httpInterceptor)
    .config(httpConfig);

  function httpInterceptor($q, loggingService, $fdToast) {
    return {
      // 'request': function(config) {
      //   return config;
      // },
      // 'requestError': function(rejection) {
      //   return $q.reject(rejection);
      // },
      // 'response': function(response) {
      //   return response;
      // },
      'responseError': function(rejection) {
        var exception = new Error(angular.toJson(rejection));

        $fdToast.show({
          text: rejection.statusText
        });

        loggingService(exception);
        return $q.reject(rejection);
      }
    };
  }

  function httpConfig($httpProvider) {
    $httpProvider.interceptors.push(httpInterceptor);
  }
})();
