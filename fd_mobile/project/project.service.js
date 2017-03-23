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
    authenticationService
  ) {
    var projectResource = $resource(urlBuilder.build('libs/sdf'), null, {
      getProjectsByCaptainName: {
        method: 'GET',
        cache: true,
        url: urlBuilder.build('libs/api.php?action=Project.get'),
        params: {
          random: '',
          //captainName: JSON.parse(sessionStorage.getItem('userInfo')).name,
          isDeleted: 'false',
          'isFrozen': 'false'
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
      },
      getAllRemote: function(params) {
        params = params || {};
        params.random = Math.random();
        return service.getAll.call(this, params);
      }
    };

    return service;
  });
})();
