(function() {
  'use strict';

  angular
    .module('fdmobile.feedback')
    .config(feedback);

  feedback.$inject = ['$stateProvider'];

  function feedback($stateProvider) {
    $stateProvider
      .state('settings-feedback', {
        url: '/settings/feedback',
        templateUrl: 'settings/feedback/feedback.html',
        controller: 'FeedbackController as vm'
      });
  }
})();
