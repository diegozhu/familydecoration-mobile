(function() {
  'use strict';

  angular
    .module('fdmobile.dischargeinfo')
    .config(dischargeinfo);

  function dischargeinfo($stateProvider) {
    $stateProvider
      .state('discharge', {
        url: '/profile/discharge',
        templateUrl: 'profile/discharge/dischargeinfo.html',
        controller: 'DischargeinfoController as vm',
        params: {
          user: null
        }
      });
  }
})();
