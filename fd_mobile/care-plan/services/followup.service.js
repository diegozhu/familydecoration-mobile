(function() {
  'use strict';

  angular
    .module('fdmobile.carePlan')
    .factory('followupService', followupService);

  followupService.$inject = ['$resource', 'urlBuilder'];

  function followupService($resource, urlBuilder) {
    return $resource(urlBuilder.build('care-plan/mobile/followup-care-plan'));
  }
})();
