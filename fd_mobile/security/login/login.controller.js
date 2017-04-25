(function() {
  'use strict';

  angular
    .module('fdmobile.login')
    .controller('LoginController', LoginController);

  //function LoginController($state, $stateParams, loginService) {
  function LoginController($state, CONSTANT, authenticationService) {
    var vm = this;

    vm.username = '';
    vm.password = '';
    vm.version = CONSTANT.VERSION;

    vm.login = function() {
      authenticationService.login({
        name: vm.username,
        password: vm.password
      });
    };

    var promise = authenticationService.tryAutoLogin();
    promise.then(function() {
    }, function() {
    });
  }
})();
