(function() {
  'use strict';

  angular
    .module('fdmobile.login')
    .controller('LoginController', LoginController);

  function LoginController($state, $stateParams, loginService) {
    var vm = this;

    vm.login = login;

    function login() {
      loginService.save({
        username: vm.username,
        password: vm.password
      }).$promise.then(function() {
        localStorage.setItem('username', vm.username);
        localStorage.setItem('password', vm.password);

        $state.go('home.coach');
      });
    }
  }
})();
