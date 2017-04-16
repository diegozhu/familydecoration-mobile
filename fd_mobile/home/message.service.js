(function() {
  'use strict';

  angular.module('fdmobile').factory('messageResource', function(
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
    $fdUser,
    transformService
  ) {
    var resource = $resource(urlBuilder.build('libs/sdf'), null, {
      getMessage: {
        method: 'GET',
        url: urlBuilder.build('libs/bulletin.php?action=view&start=0&limit=99&page=1'),
        transformResponse: transformService.transformResponse
      }
    });

    var service = {
      getAll: function(params) {
        return $q(function(resolve) {
          resource.getMessage(params, function(res) {
            var r = [];
            res.data.resultSet.every(function(ele) {
              r.push({
                id: ele.id,
                createTime: ele.createTime,
                isStickTop: ele.isStickTop,
                content: unescape(ele.content || ''),
                title: unescape(ele.title || '')
              });
              return true;
            });
            resolve(r);
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
