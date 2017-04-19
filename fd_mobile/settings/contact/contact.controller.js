(function() {
  'use strict';

  angular.module('fdmobile.settingsContact').controller('SettingscontactController', SettingscontactController);

  function SettingscontactController() {
    var vm = this;
    vm.call = function(phoneNumber) {
      window.open('tel:' + phoneNumber);
    };

    vm.contacts = [
      {
        name: '德清佳诚装饰',
        number: '137 3238 8588',
        desc: '德清县武康镇舞阳街437号',
        time: '工作日 8:00-17:00'
      }
    ];
  }
})();
