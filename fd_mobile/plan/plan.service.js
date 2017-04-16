(function() {
  'use strict';

  angular.module('fdmobile').factory('planService', function(
    $resource,
    urlBuilder,
    $q,
    transformService,
    $fdToast
  ) {
    var planResource = $resource(urlBuilder.build('libs/sdf'), null, {
      getPlanByProjectId: {
        method: 'GET',
        url: urlBuilder.build('libs/api.php?action=PlanMaking.get'),
        params: {
          random: '',
          projectId: '@projectId'
        }
      },
      getPlanItemsByProjectId: {
        method: 'GET',
        // cache: true,
        url: urlBuilder.build('libs/api.php?action=PlanMaking.getItems'),
        params: {
          random: '',
          projectId: '@projectId'
        },
        transformResponse: transformService.transformResponse
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
        transformResponse: transformService.transformResponse
      }
    });

    var service = {
      getPlanByProjectId: function(params) {
        return $q(function(resolve, reject) {
          params._preventDefaultExceptionHandler = true;
          planResource.getPlanByProjectId(params, function(res) {
            if (res.status != 'failing') {
              resolve(res);
            }
            else {
              reject(res);
            }
          });
        });
      },
      getPlanItemsByProjectId: function(params) {
        return $q(function(resolve, reject) {
          params._preventDefaultExceptionHandler = true;
          planResource.getPlanItemsByProjectId(params, function(res) {
            if (res.status != 'failing') {
              resolve(res);
            }
            else {
              $fdToast.show({
                text: res.errMsg + ' 请向右滑动新建计划'
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
        return $q
          .when()
          .then(function() {
            return $q(function(resolve, reject) {
              planResource.getPlanItemsByProjectId({
                _preventDefaultExceptionHandler: true,
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
            if (params.businessId) {
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
            }
          })
          .then(function() {
            return add(params);
          });
      }
    };

    return service;
  });
})();
