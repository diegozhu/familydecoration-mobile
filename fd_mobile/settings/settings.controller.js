(function() {
  'use strict';

  angular
    .module('fdmobile.settings')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$state', '$stateParams', '$translate', 'CONSTANT'];

  function SettingsController($state, $stateParams, $translate, CONSTANT) {
    var vm = this;
    angular.extend(vm, {
      datatransfer: localStorage.getItem('settings.devices.model'),
      datatransferDisplay: $translate.instant(localStorage.getItem('settings.devices.model') || 'CHOSE'),
      notify: true,
      contactNumber: '13057530560',
      version: CONSTANT.VERSION
    });

    vm.goto = function($s) {
      $state.go($s);
    };
  }
})();
