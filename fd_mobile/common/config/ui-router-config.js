(function() {
  'use strict';

  angular
    .module('fdmobile')
    .run(uiRouterConfig);

  function uiRouterConfig($rootScope, $ionicLoading) {
    $rootScope.$on('$stateChangeStart', function() {
      $ionicLoading.show({
        template: 'Loading...',
        duration: 3000
      });
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      $ionicLoading.hide();
    });
  }
})();
