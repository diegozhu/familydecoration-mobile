(function() {
  'use strict';

  angular
    .module('fdmobile.reference.ble')
    .config(bleRouter);

  bleRouter.$inject = ['$stateProvider'];

  function bleRouter($stateProvider) {
    $stateProvider
      .state('home.reference.ble', {
        url: '/ble',
        views: {
          'reference-ble': {
            templateUrl: 'reference/ble/ble.html',
            controller: 'BleController as vm'
          }
        }
      });
  }
})();
