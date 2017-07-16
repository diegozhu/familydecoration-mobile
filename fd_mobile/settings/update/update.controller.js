(function() {
  'use strict';

  angular.module('fdmobile.settingsUpdate').controller('SettingsUpdateController', SettingsUpdateController);

  SettingsUpdateController.$inject = ['$scope', '$timeout', 'authenticationService'];

  function SettingsUpdateController($scope, $timeout, authenticationService) {
    var vm = this;
    vm.checking = true;
    vm.newVersionInfo = '';
    authenticationService.checkUpdate().then(function(newVersion) {
      vm.checking = false;
      if (newVersion) {
        vm.newVersionInfo = '有新版本:' + newVersion.version;
      }
    });
  }

})();
