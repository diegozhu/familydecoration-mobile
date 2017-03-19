(function() {
  'use strict';

  angular
    .module('fdmobile.intake')
    .factory('intakeService', intakeService);

  intakeService.$inject = ['$resource', 'urlBuilder'];

  function intakeService($resource, urlBuilder) {
    return $resource(urlBuilder.build('medication-intake'), null, {
      getDetails: {
        method: 'POST',
        url: urlBuilder.build('medication-administration/medication-intake-details')
      },
      save: {
        method: 'POST',
        url: urlBuilder.build('medication-administration/medication-intake-list')
      }
    });
    //return $resource('my-data/intake/data.json');
  }
})();
