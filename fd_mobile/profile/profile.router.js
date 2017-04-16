(function() {
  'use strict';

  angular.module('fdmobile.profile', [
    'fdmobile.configname',
    'fdmobile.password',
    'fdmobile.diaginfo',
    'fdmobile.gender',
    'fdmobile.contact',
    'fdmobile.qr',
    'fdmobile.avatar',
    'fdmobile.dischargeinfo'
  ]);

  angular
    .module('fdmobile.profile')
    .config(profileRouter);

  profileRouter.$inject = ['$stateProvider'];

  function profileRouter($stateProvider) {
    $stateProvider
      .state('home.profile', {
        url: '/profile',
        views: {
          'tab-profile': {
            templateUrl: 'profile/profile.html',
            controller: 'ProfileController as vm'
          }
        }
      });
  }
})();
