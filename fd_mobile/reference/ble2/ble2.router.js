(function() {
  'use strict';

  angular
    .module('fdmobile.reference.ble2')
    .config(bleRouter);

  bleRouter.$inject = ['$stateProvider'];

  function bleRouter($stateProvider) {
    $stateProvider
      .state('home.reference.ble2', {
        url: '/ble2',
        views: {
          'reference-ble2': {
            templateUrl: 'reference/ble2/ble2.html',
            controller: 'BleController2 as vm'
          }
        }
      });
  }
})();
