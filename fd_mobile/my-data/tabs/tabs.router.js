(function() {
  'use strict';

  angular
    .module('fdmobile.myData')
    .config(myDataRouter);

  function myDataRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.myData',
        url: 'mydata',
        abstract: true,
        views: {
          'tab-my-data': {
            templateUrl: 'my-data/tabs/tabs.html'
          }
        }
      });
  }
})();
