(function() {
  'use strict';

  angular
    .module('fdmobile.home')
    .config(homeRouter);

  function homeRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home',
        url: '/',
        abstract: true,
        templateUrl: 'home/home/home.html'
      });
  }
})();
