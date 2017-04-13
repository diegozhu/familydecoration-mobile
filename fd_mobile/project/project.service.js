(function() {
  'use strict';

  angular.module('fdmobile').factory('projectService', function(
    $fdPopup,
    $cacheFactory,
    $resource,
    urlBuilder,
    $q,
    $log,
    CONSTANT,
    $fdToast,
    $translate,
    $state,
    $templateCache,
    $rootScope,
    authenticationService,
    $fdUser
  ) {
    var projectResource = $resource(urlBuilder.build('libs/sdf'), null, {
      getProjectsByCaptainName: {
        method: 'GET',
        cache: true,
        url: urlBuilder.build('libs/api.php?action=Project.get'),
        params: {
          random: '',
          captainName: JSON.parse(sessionStorage.getItem('userInfo')).name,
          isDeleted: 'false',
          'isFrozen': 'false'
        }
      },
      getAllProjects: {
        method: 'GET',
        cache: true,
        url: urlBuilder.build('libs/api.php?action=Project.get'),
        params: {
          random: '',
          isDeleted: 'false',
          isFrozen: 'false'
        }
      }
    });

    var events = {
      updating: 'fd.event.project.updating',
      updateFailed: 'fd.event.project.updateFailed',
      updated: 'fd.event.project.updated'
    };

    $rootScope.$on(authenticationService.events.logout, function() {
      //clean all the cache
    });

    var service = {
      events: events,
      getAll: function(params) {
        if (this.needLoadAll()) {
          return $q(function(resolve, reject) {
            projectResource.getAllProjects(params, function(res) {
              if (res.data) {
                resolve(res);
              }
              else {
                reject(res);
              }
            });
          });
        }
        else {
          // here is gonna return a promise
          return $q(function(resolve, reject) {
            projectResource.getProjectsByCaptainName(params, function(res) {
              if (res.data) {
                resolve(res);
              }
              else {
                reject(res);
              }
            });
          });
        }
      },
      getAllRemote: function(params) {
        params = params || {};
        params.random = Math.random();
        return service.getAll.call(this, params);
      },
      /**
       * @desc whether we load all projects or just projects under one dividual projectCaptain
       */
      needLoadAll: function() {
        var
          userInfo = sessionStorage.getItem('userInfo'),
          level;
        if (userInfo) {
          userInfo = JSON.parse(userInfo);
          level = userInfo.level;
        }
        return $fdUser.isAdmin(level) || $fdUser.isProjectManager(level) || $fdUser.isSupervisor(level) || $fdUser.isAdministrationManager(level) || $fdUser.isFinanceManager(level) || $fdUser.isBudgetManager(level) || $fdUser.isBudgetStaff(level);
      }
    };

    return service;
  });
})();
