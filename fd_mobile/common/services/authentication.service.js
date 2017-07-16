(function() {
  'use strict';
  angular
    .module('fdmobile')
    .factory('authenticationService', authenticationService);

  function authenticationService($ionicLoading, md5, $fdPopup, $cacheFactory, $resource, urlBuilder, $q, $log, CONSTANT, $fdToast, $translate, $state, $templateCache, $rootScope) {
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
          manufacturer: '',
          model: '',
          platform: '',
          version: '',
          app: true,
          name: '',
          password: ''
        }
      },
      logout: {
        method: 'POST',
        url: urlBuilder.build('libs/user.php?action=logout')
      }
    });

    var events = {
      login: 'fd.event.login',
      logout: 'fd.event.logout'
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
          if (!!param.name && !!param.password) {
            $log.log('trying auto login.');
            param.isPwdEncrypted = true;
            service.login(param).then(resolve).catch(reject);
          } else {
            reject();
          }
        });
      },
      // isPwdEncrypted: do we need to encrypt our password or not, false is used for autologin.
      login: function(params) {
        return $q(function(resolve, reject) {
          if (params.isPwdEncrypted !== true) {
            params.password = md5.createHash('familydecoration-' + params.password);
          }
          params.app = true;
          params.manufacturer = window.device.manufacturer;
          params.model = window.device.model;
          params.platform = window.device.platform;
          params.version = window.device.version;
          resource.login(params, function(res) {
            isLogin = true;
            angular.extend(params, {
              level: res.level
            });
            sessionStorage.setItem('userInfo', JSON.stringify(params));
            localStorage.setItem('userInfo', JSON.stringify(params));
            $rootScope.$broadcast(events.login, params);
            resolve(params);
            $state.go('home.main');
          }, reject);
        });
      },
      logout: function(params) {
        return $q(function(resolve, reject) {
          $templateCache.removeAll();
          sessionStorage.clear();
          // invoke encapsulated destroy function in cachefactory.config.js
          // $cacheFactory.destroyAll();
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
        $ionicLoading.show({ template: '正在检查更新...' });
        return $q(function(resolve) {
          var url = 'app/latest_version' + (CONSTANT.IS_IOS ? '_ios' : '_android' ) + '.json?rand=' + parseInt((Math.random()) * 10000);
          $resource(urlBuilder.build(url)).get(function(res) {
            $ionicLoading.hide();
            $log.log(res);
            var newVersion;
            if (CONSTANT.VERSION < res.version) {
              newVersion = angular.extend({}, res);
              newVersion.url = res.url.startsWith('http') ? res.url : urlBuilder.build('app/' + res.url);
              $fdPopup.alert({
                iconClass: 'ion-star',
                disableBackButtonClose: true,
                title: $translate.instant('UPDATE') + ' ' + newVersion.version,
                template: newVersion['desc_' + $translate.use()] || newVersion.desc,
                buttons: [{
                  text: $translate.instant('UPDATE_NOW'),
                  type: 'button-positive',
                  onTap: function(event) {
                    window.cordova.InAppBrowser.open(newVersion.url, '_system');
                    event.defaultPrevented = false;
                    return true;
                  }
                }
                ,{
                  text: $translate.instant('UPDATE_LATER'),
                  onTap: function() {
                    localStorage.setItem('new-version-' + newVersion.version + '-last-alert-time', new Date());
                    return true;
                  }
                }
                ]
              });
            }
            resolve(newVersion);
          });
        });
      }
    };
    return service;
  }
})();
