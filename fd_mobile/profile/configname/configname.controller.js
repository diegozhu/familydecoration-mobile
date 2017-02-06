(function() {
  'use strict';

  angular
    .module('fdmobile.configname')
    .controller('ConfignameController', ConfignameController);

  function ConfignameController() {
    var vm = this;
    vm.back = function() {
      history.back();
    };
  }
})();
