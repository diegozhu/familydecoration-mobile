(function() {
  'use strict';

  angular.module('fdmobile.datatransfer').controller('DatatransferController', DatatransferController);

  function DatatransferController($scope, $state, $ionicHistory) {
    var vm = this;

    vm.datatransfer = localStorage.getItem('settings.devices.model') || 'CHOSE';
    vm.gotoSettings = function($s) {
      localStorage.setItem('settings.devices.model', $s);
      $ionicHistory.goBack();
    };
  }
})();
