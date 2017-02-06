(function() {
  'use strict';

  angular
    .module('fdmobile.coach')
    .factory('educationCoachingService', educationCoachingService);

  // Injecting necessary dependentencies in this way for improve optimization
  educationCoachingService.$inject = ['$resource', 'urlBuilder'];

  function educationCoachingService($resource, urlBuilder) {

    return $resource(urlBuilder.build('integration'), {}, {
      getEducationResource: {
        method: 'GET',
        url: urlBuilder.build('integration/knowledgebase/coaching-plan/mobile/package/cards')
      },
      doCoachTask: {
        method: 'POST',
        url: urlBuilder.build('coaching-fd/doCoachTask')
      }
    });

  }
})();
