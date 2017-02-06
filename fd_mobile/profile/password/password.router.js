(function() {
  'use strict';

  angular
    .module('fdmobile.password')
    .config(password);

  password.$inject = ['$stateProvider'];

  function password($stateProvider) {
    $stateProvider
      .state('password', {
        url: '/profile/password',
        templateUrl: 'profile/password/password.html',
        controller: 'PasswordController as vm'
      });
  }
})();
