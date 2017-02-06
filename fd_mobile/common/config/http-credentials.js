(function() {
  'use strict';

  angular
    .module('fdmobile')
    .config(httpDefaultCredential);

  function httpDefaultCredential($httpProvider) {
    //Set and store cookie information, so the request to server with cookie info.
    $httpProvider.defaults.withCredentials = true;
  }
})();
