(function() {
  'use strict';

  angular.module('fdmobile').factory('planService', function(
    $resource,
    urlBuilder,
    $q
  ) {
    var planResource = $resource(urlBuilder.build('libs/sdf'), null, {
      getPlanItemsByProjectId: {
        method: 'GET',
        cache: true,
        url: urlBuilder.build('libs/api.php?action=PlanMaking.getItems'),
        params: {
          random: '',
          projectId: '@projectId'
        },
        isArray: true
      }
    });

    var service = {
      getPlanItemsByProjectId: function(params) {
        return $q(function(resolve, reject) {
          planResource.getPlanItemsByProjectId(params, function(res) {
            if (res.status != 'failing') {
              resolve(res);
            }
            else {
              reject(res);
            }
          });
        });
      }
    };

    return service;
  });
})();
