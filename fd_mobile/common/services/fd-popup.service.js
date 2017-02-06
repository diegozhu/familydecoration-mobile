(function() {
  'use strict';

  var fd_POPUP_TPL =
    '<div class="fd-popup-container" ng-class="cssClass">' +
      '<div class="fd-popup">' +
        '<div class="fd-popup-head">' +
          '<div class="fd-popup-icon">' +
            '<i class="icon" ng-class="iconClass"></i>' +
          '</div>' +
          '<div class="fd-popup-title">' +
            '<div class="fd-popup-main-title" ng-bind-html="title"></div>' +
            '<div class="fd-popup-sub-title" ng-bind-html="subTitle" ng-if="subTitle"></div>' +
          '</div>' +
        '</div>' +
        '<div class="fd-popup-body">' +
        '</div>' +
        '<div class="fd-popup-buttons" ng-show="buttons.length">' +
          '<button ng-repeat="button in buttons" ng-click="$buttonTapped(button, $event)" class="button button-full" ng-class="button.type || \'button-default\'" ng-bind-html="button.text"></button>' +
        '</div>' +
      '</div>' +
    '</div>';

  angular
    .module('fdmobile')
    .run(function($templateCache) {
      $templateCache.put('fd.popup.tpl', fd_POPUP_TPL);
    })
    .factory('$fdPopup', fdPopup);

  function fdPopup($templateCache, $ionicTemplateLoader, $ionicBackdrop, $q, $timeout, $rootScope, $ionicBody,
    $compile, $ionicPlatform, $ionicModal, IONIC_BACK_PRIORITY, $translate) {
    var config = { stackPushDelay: 75 },
      popupStack = [],
      $fdPopup = {
        show: showPopup,
        alert: showAlert,
        // confirm: showConfirm,
        // prompt: showPrompt,
        _createPopup: createPopup,
        _popupStack: popupStack
      };

    return $fdPopup;

    function createPopup(options) {
      options = angular.extend({
        scope: null,
        buttons: []
      }, options || {});

      var self = {};
      self.scope = (options.scope || $rootScope).$new();
      self.element = angular.element($templateCache.get('fd.popup.tpl'));
      self.responseDeferred = $q.defer();

      $ionicBody.get().appendChild(self.element[0]);
      $compile(self.element)(self.scope);

      angular.extend(self.scope, {
        title: options.title,
        subTitle: options.subTitle,
        iconClass: options.iconClass,
        cssClass: options.cssClass,
        buttons: options.buttons,
        $buttonTapped: function(button, event) {
          var result = (button.onTap || angular.noop).apply(self, [event]);
          event = event.originalEvent || event;

          if (!event.defaultPrevented) {
            self.responseDeferred.resolve(result);
          }
        }
      });

      $q.when(
        options.templateUrl ?
        $ionicTemplateLoader.load(options.templateUrl) :
          (options.template || options.content || '')
      ).then(function(template) {
        var popupBody = angular.element(self.element[0].querySelector('.fd-popup-body'));
        if (template) {
          popupBody.html(template);
          $compile(popupBody.contents())(self.scope);
        } else {
          popupBody.remove();
        }
      });

      self.show = function() {
        if (self.isShown || self.removed) {
          return;
        }

        $ionicModal.stack.add(self);
        self.isShown = true;
        ionic.requestAnimationFrame(function() {
          if (!self.isShown) {
            return;
          }

          self.element.removeClass('popup-hidden');
          self.element.addClass('popup-showing active');
          focusInput(self.element);
        });
      };

      self.hide = function(callback) {
        callback = callback || angular.noop;
        if (!self.isShown) {
          return callback();
        }

        $ionicModal.stack.remove(self);
        self.isShown = false;
        self.element.removeClass('active');
        self.element.addClass('popup-hidden');
        $timeout(callback, 250, false);
      };

      self.remove = function() {
        if (self.removed) {
          return;
        }

        self.hide(function() {
          self.element.remove();
          self.scope.$destroy();
        });

        self.removed = true;
      };

      return self;
    }

    function onHardwareBackButton() {
      var last = popupStack[popupStack.length - 1];
      last && last.responseDeferred.resolve();
    }

    function showPopup(options) {
      var popup = $fdPopup._createPopup(options),
        showDelay = 0;

      if (popupStack.length > 0) {
        showDelay = config.stackPushDelay;
        $timeout(popupStack[popupStack.length - 1].hide, showDelay, false);
      } else {
        //Add popup-open & backdrop if this is first popup
        $ionicBody.addClass('popup-open');
        $ionicBackdrop.retain();
        //only show the backdrop on the first popup
        $fdPopup._backButtonActionDone = $ionicPlatform.registerBackButtonAction(
          onHardwareBackButton,
          IONIC_BACK_PRIORITY.popup
        );
      }

      // Expose a 'close' method on the returned promise
      popup.responseDeferred.promise.close = function popupClose(result) {
        if (!popup.removed) {
          popup.responseDeferred.resolve(result);
        }
      };
      //DEPRECATED: notify the promise with an object with a close method
      popup.responseDeferred.notify({ close: popup.responseDeferred.close });

      doShow();

      return popup.responseDeferred.promise;

      function doShow() {
        popupStack.push(popup);
        $timeout(popup.show, showDelay, false);

        popup.responseDeferred.promise.then(function(result) {
          var index = popupStack.indexOf(popup);
          if (index !== -1) {
            popupStack.splice(index, 1);
          }

          popup.remove();

          if (popupStack.length > 0) {
            popupStack[popupStack.length - 1].show();
          } else {
            $ionicBackdrop.release();
            //Remove popup-open & backdrop if this is last popup
            $timeout(function() {
              // wait to remove this due to a 300ms delay native
              // click which would trigging whatever was underneath this
              if (!popupStack.length) {
                $ionicBody.removeClass('popup-open');
              }
            }, 400, false);
            ($fdPopup._backButtonActionDone || angular.noop)();
          }

          return result;
        });
      }
    }

    function focusInput(element) {
      var focusOn = element[0].querySelector('[autofocus]');
      if (focusOn) {
        focusOn.focus();
      }
    }

    function showAlert(opts) {
      return showPopup(angular.extend({
        title: $translate.instant('COMMON_ALERT_TITLE'),
        iconClass: 'ion-alert',
        buttons: [{
          text: opts.okText || $translate.instant('COMMON_CONFIRM'),
          type: opts.okType || 'button-positive',
          onTap: function() {
            return true;
          }
        }]
      }, opts || {}));
    }
  }
})();
