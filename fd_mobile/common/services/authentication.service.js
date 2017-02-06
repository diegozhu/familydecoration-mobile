(function() {
  'use strict';

  angular
    .module('fdmobile')
    .factory('authenticationService', authenticationService);

  function authenticationService($resource, urlBuilder) {
    return $resource(urlBuilder.build('security/login'), null, {
      login: {
        method: 'POST'
      },
      logout: {
        method: 'POST',
        url: urlBuilder.build('security/logout')
      }
    });
  }
})();
