(function() {
  'use strict';

  angular
    .module('fdmobile')
    .config(function($cordovaInAppBrowserProvider) {
      var defaultOptions = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'no'
      };

      document.addEventListener('deviceready', function() {

        $cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions);

      }, false);
    });
})();
