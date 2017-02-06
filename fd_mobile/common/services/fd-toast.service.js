(function() {
  'use strict';

  var fd_TOAST_TPL =
    '<div class="fd-toast-container" ng-class="cssClass">' +
      '<span>{{text}}</span>' +
      '<i class="icon ion-close-round" ng-if="dismissOnClick" ng-click="dismissToast()"></i>' +
    '</div>';

  angular
    .module('fdmobile')
    .run(function($templateCache) {
      $templateCache.put('fd.toast.tpl', fd_TOAST_TPL);
    })
    .factory('$fdToast', fdToast);

  function fdToast(CONSTANT, $templateCache, $ionicBody, $injector, $rootScope, $timeout) {
    var toastStack = [],
      ionicBody = $ionicBody.get(),
      $fdToast = {
        show: showToast,
        _create: createToast,
        _stack: toastStack
      };

    return $fdToast;

    function createToast(options) {
      options = angular.extend({
        scope: null,
        dismissOnTimeout: true,
        timeout: 3000,
        dismissOnClick: true
      }, options || {});

      var self = {};
      self.scope = (options.scope || $rootScope).$new();
      self.element = angular.element($templateCache.get('fd.toast.tpl'));

      if (CONSTANT.IS_IOS) {
        self.element.addClass('is-ios');
      }

      if (angular.element(ionicBody).find('ion-nav-bar').hasClass('hide')) {
        self.element.addClass('noheader');
      } else {
        self.element.removeClass('noheader');
      }

      ionicBody.appendChild(self.element[0]);
      $injector.get('$compile')(self.element)(self.scope);

      angular.extend(self.scope, {
        text: options.text,
        cssClass: options.cssClass,
        dismissOnTimeout: options.dismissOnTimeout,
        timeout: options.timeout,
        dismissOnClick: options.dismissOnClick,
        dismissToast: function() {
          self.remove();
        }
      });

      self.show = function() {
        self.element.addClass('active');

        if (options.dismissOnTimeout) {
          $timeout(self.remove, options.timeout, false);
        }
      };

      self.remove = function() {
        self.element.removeClass('active');

        $timeout(function() {
          self.element.remove();
          self.scope.$destroy();
        }, 250, false);
      };

      return self;
    }

    function showToast(options) {
      var toast = $fdToast._create(options);

      if (toastStack.length > 0) {
        $timeout(toastStack[toastStack.length - 1].remove, 0, false);
      }

      toastStack.push(toast);
      $timeout(toast.show, 250, false);
    }
  }
})();
