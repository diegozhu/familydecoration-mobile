(function() {
  'use strict';

  var app = angular.module('fdmobile');
  app.factory('planEditService', function(
    $resource,
    urlBuilder,
    $q
  ) {
    var planItemResource = $resource(urlBuilder.build('libs/sdf'), null, {
      updatePlanItem: {
        method: 'POST',
        cache: false,
        url: urlBuilder.build('libs/api.php?action=PlanMaking.updateItem'),
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        transformRequest: function(data) {
          var s = [];
          for (var d in data) {
            s.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
          }
          return s.join('&');
        }
        // params: {
        //   id: '@id',
        //   '@time': '@time'
        // }
      }
    });

    var service = {
      updatePlanItem: function(params) {
        return $q(function(resolve, reject) {
          planItemResource.updatePlanItem(params, function(res) {
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
