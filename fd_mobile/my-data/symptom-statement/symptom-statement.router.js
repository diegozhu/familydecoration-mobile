(function() {
  'use strict';

  angular
    .module('fdmobile.symptomStatement')
    .config(symptomStatementRouter);

  function symptomStatementRouter($stateProvider) {
    $stateProvider.state({
      name: 'home.myData.symptomStatementList',
      url: '/symptomStatementList',
      cache: false,
      views: {
        'mydata-notes': {
          templateUrl: 'my-data/symptom-statement/list/symptom-statement-list.html',
          controller: 'SymptomStatementListController as vm',
        }
      }
    });
  }
})();
