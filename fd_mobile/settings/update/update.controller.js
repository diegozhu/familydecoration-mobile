(function() {
  'use strict';

  angular.module('fdmobile.settingsUpdate').controller('SettingsUpdateController', SettingsUpdateController);

  SettingsUpdateController.$inject = ['$scope', '$timeout'];

  function SettingsUpdateController($scope, $timeout) {
    var vm = this;
    vm.checking = true;
    $timeout(function() {
      vm.checking = false;
      $scope.$digest();
    }, 800);
  }

})();
