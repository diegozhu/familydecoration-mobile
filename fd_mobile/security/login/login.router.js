(function() {
  'use strict';

  angular
    .module('fdmobile.security')
    .config(loginRouter);

  function loginRouter($stateProvider) {
    $stateProvider.state({
      name: 'login',
      url: '/login',
      templateUrl: 'security/login/login.html',
      controller: 'LoginController as vm'
    });
  }

})();
