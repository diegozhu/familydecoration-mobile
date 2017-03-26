(function() {
  'use strict';

  angular
    .module('fdmobile')
    .run(uiRouterConfig);

  function uiRouterConfig($rootScope, $ionicLoading, $timeout) {
    $rootScope.$on('$stateChangeStart', function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      $timeout($ionicLoading.hide, 10);
    });

    $rootScope.$on('$stateChangeError', function() {
      $timeout($ionicLoading.hide, 10);
    });
  }
})();
