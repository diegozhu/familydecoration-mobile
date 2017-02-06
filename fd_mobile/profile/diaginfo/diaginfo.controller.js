(function() {
  'use strict';
  angular.module('fdmobile.diaginfo').controller('DiaginfoController', DiaginfoController);

  function DiaginfoController($stateParams) {
    var vm = this;
    init();

    function init() {
      vm.user = $stateParams.user || {};
    }
  }
})();
