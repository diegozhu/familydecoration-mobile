(function() {
  'use strict';

  angular
    .module('fdmobile')
    .run(platformConfig);

  function platformConfig($rootScope, $ionicPlatform, $fdPopup, $cordovaNetwork, $translate) {
    $ionicPlatform.ready(function() {
      // network status
      if ($cordovaNetwork && !$cordovaNetwork.isOnline()) {
        $fdPopup.alert({
          template: $translate.instant('COMMON_NETWORK_FAIL')
        });
      }
    });
  }
})();
