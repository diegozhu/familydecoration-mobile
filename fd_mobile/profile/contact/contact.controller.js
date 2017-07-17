(function() {
  'use strict';

  angular.module('fdmobile.contact').controller('DontactController', DontactController);

  function DontactController() {
    var vm = this;
    vm.call = function(phoneNumber) {
      window.cordova.InAppBrowser.open('tel:' + phoneNumber.replace(/\s/g, ''), '_system');
    };
  }
})();
