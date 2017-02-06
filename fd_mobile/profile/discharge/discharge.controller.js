(function() {
  'use strict';

  angular
    .module('fdmobile.dischargeinfo')
    .controller('DischargeinfoController', DischargeinfoController);

  function DischargeinfoController($stateParams, profileDataService) {
    var vm = this;

    init();
    function init() {
      var mobileInfo = profileDataService.getmobileInfo();
      vm.dischargeSummary = mobileInfo.dischargeSummary;
      angular.forEach(mobileInfo.dischargeSummaryBrief, function(item) {
        if (item.oid === vm.dischargeSummary.oid) {
          vm.dischargeDate = new Date(item.dischargeDate);
        }
      });
    }

  }
})();
