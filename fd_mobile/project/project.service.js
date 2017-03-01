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
          random: ''
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
        return $q(function(resolve, reject) {
          $rootScope.$broadcast(events.updating, []);
          projectResource.getProjectsByCaptainName(params, function(res) {
            $rootScope.$broadcast(events.updated, res);
            resolve(res);
          }, reject);
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
