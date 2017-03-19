(function() {
  'use strict';

  angular
    .module('fdmobile.plan')
    .factory('symptomStatementService', symptomStatementService);

  function symptomStatementService($resource, urlBuilder, CONSTANT) {
    return $resource(urlBuilder.build('symptomStatements:symptomStatementOid'), {}, {
      saveSymptomStatement: {
        method: 'POST'
      },
      listSymptomStatements: {
        method: 'GET',
        url: urlBuilder.build('symptomStatements/pageable'),
        params: {
          mobileId: '@mobileId',
          size: CONSTANT.DEFAULT_PAGE_SIZE,
          sort: 'occuredDate,' + CONSTANT.SORT_DIRECTION_DESC
        }
      },
      deleteSymptomStatement: {
        method: 'DELETE',
        params: {
          symptomStatementOid: '@symptomStatementOid'
        },
        url: urlBuilder.build('symptomStatements/:symptomStatementOid')
      }
    });
  }
})();
