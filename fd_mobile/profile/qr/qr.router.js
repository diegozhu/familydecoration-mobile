(function() {
  'use strict';

  angular.module('fdmobile.qr').config(avatarRouter);

  avatarRouter.$inject = ['$stateProvider'];

  function avatarRouter($stateProvider) {
    $stateProvider
      .state('configureqr', {
        url: '/profile/qr',
        templateUrl: 'profile/qr/qr.html',
        controller: 'QrController as vm'
      });
  }
})();
