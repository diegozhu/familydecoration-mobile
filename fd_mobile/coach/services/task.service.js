(function() {
  'use strict';

  angular
    .module('fdmobile.coach')
    .factory('taskService', taskService);

  taskService.$inject = ['$resource', 'urlBuilder'];

  function taskService($resource, urlBuilder) {
    return $resource(urlBuilder.build('care-service-task/mobile'));
  }
})();
