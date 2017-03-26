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
        // cache: true,
        url: urlBuilder.build('libs/api.php?action=PlanMaking.getItems'),
        params: {
          random: '',
          projectId: '@projectId'
        },
        transformResponse: function(jsonData) {
          var
            obj = {},
            data = angular.fromJson(jsonData);
          if (data.status === 'failing') {
            obj = data;
          }
          else {
            obj.data = data;
            obj.total = data.length;
          }
          return obj;
        }
      }
    });

    var service = {
      getPlanItemsByProjectId: function(params) {
        return $q(function(resolve, reject) {
          params._preventDefaultExceptionHandler = true;
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
