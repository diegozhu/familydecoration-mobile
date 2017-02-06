(function() {
  'use strict';

  angular
    .module('fdmobile.myData')
    .factory('symptomCarePlanService', symptomCarePlanService);

  function symptomCarePlanService($resource, urlBuilder) {
    return $resource(urlBuilder.build('care-plan/mobile/symptom-care-plan'), {}, {
      getSymptomCarePlan: {
        method: 'GET'
      }
    });
  }
})();
