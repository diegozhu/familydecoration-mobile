(function() {
  'use strict';

  angular
    .module('fdmobile.coach')
    .factory('taskService', taskService);

  function taskService($resource, urlBuilder, $q, $cacheFactory, $log, $rootScope) {
    var events = {
      updating: 'fd.events.task.updating',
      updated: 'fd.events.task.updated',
      updateFailed: 'fd.events.task.updateFailed',
      complete: 'fd.events.task.complete'
    };

  // serivce hold data through all controllers.
  // cacheFactory can config to localStorage or sessionStorage or just keep it in memory.
  // docs see from angular $cacheFactory
    var cache = $cacheFactory('taskService');
    var inited = false;

    var service = {
      events: events,
      doTasks: function(task) {
        return $q(function(resolve, reject) {
          service.getAll().then(function(tasks) {
            var found = false;
            angular.forEach(tasks, function(t) {
              if (t.id === task.id) {
                found = true;
                task = t;
              }
            });
            if (!found) {
              reject('cound not found');
            }
            if (task.completed) {
              reject('already completed');
            }
            task.completed = true;
            $rootScope.$broadcast(events.complete, task);
            resolve(task);
          });
        });
      },
      getAll: function(params) {
        if (!inited) {
          return service.getAllRemote(params);
        }
        return $q(function(resolve) {
          return resolve(cache.get('tasks'));
        });
      },
      getAllRemote: function() {
        $log.log('taskService getAllRemote');
        $rootScope.$broadcast(events.updating);
        return $q(function(resolve) {
          setTimeout(function() {
            inited = true;
            var tasks = [];
            var total = parseInt(Math.random() * 10);
            for (var i = 0; i < total; i++) {
              tasks.push({
                name: 'tasks' + i,
                id: 'tasks' + i,
                date: new Date(),
                completed: Math.random() > 0.5
              });
            }
            cache.put('tasks', tasks);
            $rootScope.$broadcast(events.updated, tasks);
            resolve(tasks);
          }, 0);
        });
      }
    };

    // if you need to auto refresh every 15 minutes or what , just comments out below
    // $timeout(function() {
    //  service.getAllRemote();
    //}, 15 * 60 * 1000)
    return service;
  }
})();
