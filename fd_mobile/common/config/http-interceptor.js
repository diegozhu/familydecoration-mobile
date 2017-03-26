(function() {
  'use strict';

  angular
    .module('fdmobile')
    .factory('httpInterceptor', httpInterceptor)
    .config(httpConfig);

  function httpInterceptor($q, loggingService, $fdToast, $log, $translate, $timeout, $injector) {
    return {
      request: function(config) {
        return config;
      },
      // requestError: function(rejection) {
      //   if (canRecover(rejection)) {
      //     return responseOrNewPromise
      //   }
      //   return $q.reject(rejection);
      // },
      response: function(_response) {
        // $log.log(_response.config.url);
        if (_response && _response.data && _response.data.status === 'failing' && !(_response.config && _response.config.params && _response.config.params._preventDefaultExceptionHandler)) {
          $fdToast.show({
            text: _response.data.errMsg
          });
          throw new Error(_response.data);
        }
        return _response;
      },
      responseError: function(rejection) {
        var exception = rejection instanceof Error ? rejection : new Error(angular.toJson(rejection));
        var errorMsg = '未知异常' + exception.message;
        if (rejection && rejection.data && rejection.data.error && rejection.data.error.message) {
          errorMsg = rejection.data.error.message;
        }
        if (rejection.status === -1) {
          errorMsg = '网络异常!';
          try {
            $injector.get('$ionicLoading').hide();
          } catch (e) {
            // do nothing;
          }
        } else if (rejection.status === 401 && !rejection.config.url.endsWith('security/logout')) {
          //session timeout in server side, need to trigger logout in client side
          errorMsg = '您还没有登陆或登陆已超时';
          $timeout(function() {
            try {
              $injector.get('authenticationService').logout();
            } catch (e) {
              // do nothing;
            }
          }, 500);
        }

        if (rejection.status === 401 || (rejection.config && rejection.config.data && rejection.config.data._preventDefaultExceptionHandler)) {
          // _preventDefaultExceptionHandler = true in reject will prevent default toast
          // user session timeout/not login will not show toast cause we have auto login at login view, if login success, will make user confused.
          // do nothing;
        } else {
          $fdToast.show({
            text: $translate.instant(errorMsg) || errorMsg
          });
        }
        if (rejection.status !== -1) {
          //network exception dont need log.
          loggingService(exception);
        }
        return $q.reject(rejection);
      }
    };
  }

  function httpConfig($httpProvider) {
    $httpProvider.interceptors.push(httpInterceptor);
    $httpProvider.defaults.timeout = 3000;
  }
})();
