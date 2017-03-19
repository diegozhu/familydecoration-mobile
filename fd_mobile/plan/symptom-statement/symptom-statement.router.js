(function() {
  'use strict';

  angular
    .module('fdmobile.symptomStatement')
    .config(symptomStatementRouter);

  function symptomStatementRouter($stateProvider) {
    $stateProvider.state({
      name: 'home.plan.symptomStatementList',
      url: '/symptomStatementList',
      cache: false,
      views: {
        'plan-notes': {
          templateUrl: 'plan/symptom-statement/list/symptom-statement-list.html',
          controller: 'SymptomStatementListController as vm',
        }
      }
    });
  }
})();
