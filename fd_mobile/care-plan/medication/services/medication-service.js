/**
 ***************************** MedicationService *****************************
 *
 * MedicationService is used to interact with the RESTful web webserice.
 *
 */
'use strict';

(function() {
  angular
    .module('fdmobile.medication')
    .factory('MedicationService', MedicationService);

  // Injecting necessary dependentencies in this way for improve optimization
  MedicationService.$inject = ['$resource', 'urlBuilder'];

  function MedicationService($resource, urlBuilder) {

    return $resource(urlBuilder.build('medications'), {}, {
      getAllMedicationDict: {
        method: 'GET'
      },
      getMedicationByCode: {
        method: 'GET',
        params: {code: '@code'},
        url: urlBuilder.build('medications/:code')
      },
      searchByPinyinOrChar: {
        method: 'GET',
        params: {querydata: '@querydata'},
        url: urlBuilder.build('medications/select/:querydata')
      }

    });
  }
})();
