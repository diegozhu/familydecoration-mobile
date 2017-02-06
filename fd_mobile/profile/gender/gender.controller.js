(function() {
  'use strict';

  angular.module('fdmobile.gender').controller('GenderController', GenderController);

  function GenderController($scope, $state, $stateParams) {
    var vm = this;
    vm.user = $stateParams.user || {};
    vm.gotoProfile = function($s) {
      $state.go('profile', { action: 'setGender', value: $s});
    };
  }
})();
