(function() {
  'use strict';

  angular
    .module('fdmobile')
    .config(googleAnalyticsConfig)
    .run(['Analytics', function(Analytics) {
      //console.log('run:', Analytics);
      // Create a new tracking event with a value
      Analytics.trackEvent('app', 'startup', 'fd1.0');
      //Analytics.trackEvent('video', 'play', 'django.mp4', 4);
    }]);

  function googleAnalyticsConfig(AnalyticsProvider) {
    // Add configuration code as desired
    //console.log('config:', AnalyticsProvider);
    AnalyticsProvider.setAccount('UA-90531911-1'); //UU-XXXXXXX-X should be your tracking code
  }

})();
