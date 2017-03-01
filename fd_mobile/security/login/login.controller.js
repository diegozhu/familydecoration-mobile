(function() {
  'use strict';

  angular
    .module('fdmobile.login')
    .controller('LoginController', LoginController);

  //function LoginController($state, $stateParams, loginService) {
  function LoginController($state, authenticationService) {
    var vm = this;

    vm.username = '';
    vm.password = '';

    vm.login = function() {
      authenticationService.login({
        name: vm.username,
        password: vm.password
      });
    };
  }
})();
