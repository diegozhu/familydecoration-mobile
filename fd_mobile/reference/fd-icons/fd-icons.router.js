(function() {
  'use strict';

  angular
    .module('fdmobile.reference.fdIcons')
    .config(fdIconsRouter);

  function fdIconsRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.reference.fdIcons',
        url: '/fdicons',
        views: {
          'reference-fd-icons': {
            templateUrl: 'reference/fd-icons/fd-icons.html'
          }
        }
      });
  }
})();
