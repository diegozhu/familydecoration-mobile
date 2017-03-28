(function() {
  'use strict';

  angular.module('fdmobile').factory('planService', function(
    $resource,
    urlBuilder,
    $q,
    $fdToast
  ) {
    var transformResponse = function(jsonData) {
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
    };
    var planResource = $resource(urlBuilder.build('libs/sdf'), null, {
      getPlanItemsByProjectId: {
        method: 'GET',
        // cache: true,
        url: urlBuilder.build('libs/api.php?action=PlanMaking.getItems'),
        params: {
          random: '',
          projectId: '@projectId'
        },
        transformResponse: transformResponse
      },
      createNewPlan: {
        method: 'POST',
        url: urlBuilder.build('./libs/api.php?action=PlanMaking.add'),
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        transformRequest: function(data) {
          var s = [];
          for (var d in data) {
            s.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
          }
          return s.join('&');
        }
      },
      getBusinessById: {
        method: 'GET',
        url: urlBuilder.build('./libs/business.php?action=getBusinessById'),
        params: {
          businessId: '@businessId'
        },
        transformResponse: transformResponse
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
              $fdToast.show({
                text: res.errMsg + ' 请长按项目新建计划'
              });
              reject(res);
            }
          });
        });
      },
      createNewPlan: function(params) {
        function add(params) {
          return $q(function(resolve, reject) {
            params._preventDefaultExceptionHandler = true;
            delete params.businessId;
            planResource.createNewPlan(params, function(res) {
              if (res.status === 'successful') {
                resolve(res);
              }
              else {
                $fdToast.show({
                  text: res.errMsg
                });
                reject(res);
              }
            });
          });
        }
        if (params.businessId) {
          return $q
            .when()
            .then(function() {
              return $q(function(resolve, reject) {
                planResource.getPlanItemsByProjectId({
                  projectId: params['@projectId']
                }, function(res) {
                  if (res.status === 'failing') {
                    resolve(res);
                  }
                  else {
                    $fdToast.show({
                      text: params['@projectAddress'] + '已经存在计划，不能重复创建'
                    });
                    reject(res);
                  }
                });
              });
            })
            .then(function() {
              return $q(function(resolve, reject) {
                planResource.getBusinessById({
                  businessId: params.businessId
                }, function(res) {
                  if (res.status === 'failing') {
                    reject(res);
                  }
                  else {
                    var data = res.data;
                    angular.extend(params, {
                      '@custName': data[0].customer
                    });
                    resolve(res);
                  }
                });
              });
            })
            .then(function() {
              return add(params);
            });
        }
        else {
          return add(params);
        }
      }
    };

    return service;
  });
})();
