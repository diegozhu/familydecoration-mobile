(function() {
  'use strict';

  angular
    .module('fdmobile.main')
    .factory('educationmainingService', educationmainingService);

  // Injecting necessary dependentencies in this way for improve optimization
  educationmainingService.$inject = ['$resource', 'urlBuilder'];

  function educationmainingService($resource, urlBuilder) {

    return $resource(urlBuilder.build('integration'), {}, {
      getEducationResource: {
        method: 'GET',
        url: urlBuilder.build('integration/knowledgebase/maining-plan/mobile/package/cards')
      },
      domainTask: {
        method: 'POST',
        url: urlBuilder.build('maining-fd/domainTask')
      }
    });

  }
})();
