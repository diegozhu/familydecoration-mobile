(function() {
  'use strict';

  angular
    .module('fdmobile.plan')
    .config(planRouter);

  function planRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.plan',
        url: 'plan',
        abstract: true, // 用中文明显点，这里其实个人觉得，abstract不应该用，用了会报错。
        views: {
          'tab-plan': {
            templateUrl: 'plan/tabs/tabs.html'
          }
        }
      });
  }
})();
