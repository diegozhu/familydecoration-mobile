(function() {
  'use strict';

  angular
    .module('fdmobile.settings')
    .factory('settingsService', settingsService);

  settingsService.$inject = ['$resource', 'urlBuilder'];

  function settingsService($resource, urlBuilder) {
    return $resource(urlBuilder.build('settings'), {}, {
      saveFeedback: {
        method: 'POST',
        url: urlBuilder.build('settings/feedback')
      }
    });
  }
})();
