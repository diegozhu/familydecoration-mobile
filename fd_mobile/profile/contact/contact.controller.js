(function() {
  'use strict';

  angular.module('fdmobile.contact').controller('DontactController', DontactController);

  function DontactController() {
    var vm = this;
    vm.call = function(phoneNumber) {
      window.open('tel:' + phoneNumber);
    };
  }
})();
