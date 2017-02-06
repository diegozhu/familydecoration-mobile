(function() {
  'use strict';

  angular
    .module('fdmobile')
    .config(appRouter);

  function appRouter($urlRouterProvider, $ionicConfigProvider) {
    $urlRouterProvider.otherwise('/coach');

    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');

    $ionicConfigProvider.platform.android.navBar.alignTitle('center');
  }
})();
