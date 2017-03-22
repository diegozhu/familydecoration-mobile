(function() {
  'use strict';

  angular
    .module('fdmobile')
    .factory('authenticationService', authenticationService);

  function authenticationService(md5, $fdPopup, $cacheFactory, $resource, urlBuilder, $q, $log, CONSTANT, $fdToast, $translate, $state, $templateCache, $rootScope) {

    var resource = $resource(urlBuilder.build('security/login'), null, {
      login: {
        method: 'POST',
        url: urlBuilder.build('libs/user.php?action=login'),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        transformRequest: function(data) {
          var s = [];
          for (var d in data) {
            s.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
          }
          return s.join('&');
        },
        param: {
          name: '',
          password: ''
        }
      },
      logout: {
        method: 'POST',
        url: urlBuilder.build('security/logout')
      }
    });

    var events = {
      login: 'fd.event.login',
      logout: 'fd.event.logout',
      newVersion: 'fd.event.newVersion',
      disableLogin: 'fd.event.disableLogin'
    };

    var isLogin = false;

    var service = {
      events: events,
      isLogin: function() {
        return $q(function(resolve) {
          resolve(isLogin);
        });
      },
      getLoginUserInfo: function() {
        return $q(function(resolve) {
          resolve(JSON.parse(sessionStorage.getItem('userInfo')));
        });
      },
      tryAutoLogin: function() {
        return $q(function(resolve, reject) {
          var param = JSON.parse(sessionStorage.getItem('userInfo') || localStorage.getItem('userInfo') || '{}');
          param._preventDefaultExceptionHandler = true;
          if (!!param.username && !!param.password) {
            $log.log('trying auto login.');
            service.login(param).then(resolve).catch(reject);
          } else {
            reject();
          }
        });
      },
      login: function(params) {
        return $q(function(resolve, reject) {
          params.password = md5.createHash('familydecoration-' + params.password);
          resource.login(params, function() {
            isLogin = true;
            sessionStorage.setItem('userInfo', JSON.stringify(params));
            localStorage.setItem('userInfo', JSON.stringify(params));
            $rootScope.$broadcast(events.login, params);
            resolve(params);
            $state.go('home.coach');
          }, reject);
        });
      },
      logout: function(params) {
        return $q(function(resolve, reject) {
          $templateCache.removeAll();
          sessionStorage.clear();
          // invoke encapsulated destroy function in cachefactory.config.js
          $cacheFactory.destroy();
          if (params && params.clearLocalStorage) {
            localStorage.clear();
          }
          $rootScope.$broadcast(events.logout);
          if (!isLogin) {
            $log.log('logout already, return;');
            $state.go('login', params);
            return ;
          }
          isLogin = false;
          resource.logout(params, function(res) {
            resolve(res);
            $state.go('login', params);
          }, function(res) {
            reject(res);
            $state.go('login', params);
          });
        });
      },
      checkUpdate: function() {
        return $q(function(resolve, reject) {
          resolve();
          var a = true;
          if (a) {
            return ;
          }
          var url = '/fd_patient/fd_patient_latest_version' + (CONSTANT.IS_IOS ? '_ios' : '_android' ) + '.json?rand=' + parseInt((Math.random()) * 10000);
          $resource(urlBuilder.buildRaw(url)).get(function(res) {
            $log.log(res);
            if (CONSTANT.VERSION < res.version) {
              var newVersion = angular.extend({}, res);
              delete newVersion.$resolved;
              delete newVersion.$promise;
              newVersion.url = res.url.startsWith('http') ? res.url : urlBuilder.buildRaw('/fd_patient/' + res.url);
              $rootScope.$broadcast(events.newVersion, newVersion);
              resolve(newVersion);
            } else {
              reject('already latest');
            }
          }, reject);
        });
      }
    };

    service.checkUpdate().then(function(newVersion) {
      var a = true;
      if (a) {
        return ;
      }
      var alert = {
        iconClass: 'ion-star',
        disableBackButtonClose: true,
        title: $translate.instant('UPDATE') + ' ' + newVersion.version,
        template: newVersion['desc_' + $translate.use()] || newVersion.desc,
        buttons: [{
          text: $translate.instant('UPDATE_NOW'),
          type: 'button-positive',
          onTap: function(event) {
            window.open(newVersion.url, '_system');
            event.defaultPrevented = false;
            return true;
          }
        }]
      };
      var lastAlertTime = localStorage.getItem('new-version-' + newVersion.version + '-last-alert-time');
      if (!newVersion.force) {
        if (lastAlertTime && (new Date()).getTime() - (new Date(lastAlertTime)).getTime() < 12 * 60 * 60 * 1000) {
          return ;
        }
        alert.buttons.push({
          text: $translate.instant('UPDATE_LATER'),
          onTap: function() {
            localStorage.setItem('new-version-' + newVersion.version + '-last-alert-time', new Date());
            return true;
          }
        });
      } else {
        $rootScope.$broadcast(events.disableLogin);
      }
      $fdPopup.alert(alert);
    });
    return service;
  }
})();
