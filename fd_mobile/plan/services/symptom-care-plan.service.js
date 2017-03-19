(function() {
  'use strict';

  angular
    .module('fdmobile.plan')
    .factory('symptomCarePlanService', symptomCarePlanService);

  function symptomCarePlanService($resource, urlBuilder) {
    return $resource(urlBuilder.build('care-plan/mobile/symptom-care-plan'), {}, {
      getSymptomCarePlan: {
        method: 'GET'
      }
    });
  }
})();
