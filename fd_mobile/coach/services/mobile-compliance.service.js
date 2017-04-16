(function() {
  'use strict';

  angular
    .module('fdmobile.main')
    .factory('mobileComplianceService', mobileComplianceService);

  mobileComplianceService.$inject = ['$resource', 'urlBuilder'];

  function mobileComplianceService($resource, urlBuilder) {
    return $resource(urlBuilder.build('mobile-compliance/mobile-score'));
  }
})();
