(function() {
  'use strict';

  angular
    .module('fdmobile.settings')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$state', '$stateParams', '$translate'];

  function SettingsController($state, $stateParams, $translate) {
    var vm = this;
    angular.extend(vm, {
      datatransfer: localStorage.getItem('settings.devices.model'),
      datatransferDisplay: $translate.instant(localStorage.getItem('settings.devices.model') || 'CHOSE'),
      notify: true,
      contactNumber: '13057530560',
      version: 'Version 1.0.1' //current version
    });

    vm.goto = function($s) {
      $state.go($s);
    };
  }
})();
