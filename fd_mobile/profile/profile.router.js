(function() {
  'use strict';

  angular
    .module('fdmobile.profile')
    .config(profileRouter);

  profileRouter.$inject = ['$stateProvider'];

  function profileRouter($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile',
        cache: false,
        templateUrl: 'profile/profile.html',
        params: { action: '', value: ''},
        controller: 'ProfileController as vm'
      });
  }
})();
