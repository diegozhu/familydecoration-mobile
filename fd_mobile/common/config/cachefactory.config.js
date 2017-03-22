(function() {
  'use strict';

  var app = angular.module('fdmobile');

  app.config(function($provide) {
    $provide.decorator('$cacheFactory', function($delegate) {
      $delegate.removeAll = function() {
        angular.forEach($delegate.info(), function(obj, key) {
          $delegate.get(key).removeAll();
        });
      };

      $delegate.destroyAll = function() {
        angular.forEach($delegate.info(), function(obj, key) {
          $delegate.get(key).destroy();
        });
      };

      return $delegate;
    });
  });
})();
