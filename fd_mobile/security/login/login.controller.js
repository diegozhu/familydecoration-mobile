(function() {
  'use strict';

  angular
    .module('fdmobile.login')
    .controller('LoginController', LoginController);

  function LoginController($log, $state, CONSTANT, authenticationService) {
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

    //if already fired, will run callback instantly
    document.addEventListener('deviceready', function() {
      $log.log('deviceready');
      authenticationService.checkUpdate().then(function(newVersion) {
        $log.log('checkUpdate');
        if (!newVersion) {
          $log.log('tryAutoLogin');
          authenticationService.tryAutoLogin();
        }
      });
    }, false);
  }
})();
