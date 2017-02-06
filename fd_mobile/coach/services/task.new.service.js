(function() {
  'use strict';

  angular
    .module('fdmobile.coach')
    .factory('taskNewService', taskNewService);

  // Injecting necessary dependentencies in this way for improve optimization
  taskNewService.$inject = ['$resource', 'urlBuilder'];

  function taskNewService($resource, urlBuilder) {

    // rest resource apis
    var taskResource = $resource(urlBuilder.build('medication-order/task/completion'), {}, {
      finishTask: {
        method: 'POST'
      }
    });

    return taskResource;
  }
})();
