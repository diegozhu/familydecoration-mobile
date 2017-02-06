(function() {
  'use strict';

  angular.module('fdmobile.avatar').config(avatarRouter);

  avatarRouter.$inject = ['$stateProvider'];

  function avatarRouter($stateProvider) {
    $stateProvider
      .state('configureavatar', {
        url: '/profile/avatar',
        templateUrl: 'profile/avatar/avatar.html',
        controller: 'AvatarController as vm'
      });
  }

})();
