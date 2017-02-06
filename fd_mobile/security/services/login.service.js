(function() {
  'use strict';

  angular
    .module('fdmobile.security')
    .factory('loginService', loginService);

  function loginService($resource, urlBuilder) {
    return $resource(urlBuilder.build('security/login'));
  }
})();
