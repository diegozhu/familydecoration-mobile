(function() {
  'use strict';

  angular.module('fdmobile.main', []);

  angular.module('fdmobile.main').config(function($stateProvider) {
    $stateProvider.state({
      name: 'home.main',
      url: 'main',
      views: {
        'tab-main': {
          templateUrl: 'home/main/main.html',
          controller: 'mainController as vm',
          resolve: {
            messages: function(messageResource) {
              'ngInject';
              //if you need refresh all the time, invoke
              //return taskService.getAllRemote();
              return messageResource.getAll();
            }
          }
        }
      }
    });
  });
})();
