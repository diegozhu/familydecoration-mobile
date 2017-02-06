/**
 ***************************** SuccessController ****************************
 *
 * The SuccessController is used to reset password after forgot passwords.
 */
'use strict';

(function() {
  angular.module('fdmobile.forgotPassword').controller('SuccessController', SuccessController);

  // Injecting necessary dependentencies in this way for improve optimization
  SuccessController.$inject = ['$state'];

  function SuccessController($state) {

    var vm = this;

    vm.goBack = goBack;
    vm.goLogin = goLogin;

    function goBack() {
      $state.go('secondstep');
    }

    function goLogin() {
      $state.go('login');
    }
  }

})();
