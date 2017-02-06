(function() {
  'use strict';

  angular
    .module('fdmobile.symptomReport')
    .config(symptomReportRouter);

  function symptomReportRouter($stateProvider) {
    $stateProvider
      .state({
        name: 'home.myData.symptomReport',
        url: '/symptomreport',
        views: {
          'mydata-symptom-report': {
            templateUrl: 'my-data/symptom-report/symptom-report.html',
            controller: 'SymptomReportController as vm'
          }
        }
      });
  }
})();
