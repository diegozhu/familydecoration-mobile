(function() {
  'use strict';

  angular
    .module('fdmobile.contact')
    .config(contact);

  contact.$inject = ['$stateProvider'];

  function contact($stateProvider) {
    $stateProvider
      .state('contact', {
        url: '/profile/contact',
        templateUrl: 'profile/contact/contact.html',
        controller: 'DontactController as vm'
      });
  }
})();
