(function() {
  'use strict';

  angular
    .module('fdmobile.symptomReport')
    .config(symptomReportRouter);

  function symptomReportRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.plan.symptomReport',
        url: '/symptomreport',
        views: {
          'plan-symptom-report': {
            templateUrl: 'plan/symptom-report/symptom-report.html',
            controller: 'SymptomReportController as vm'
          }
        }
      });
  }
})();
