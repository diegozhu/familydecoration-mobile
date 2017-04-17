(function() {
  'use strict';

  angular
    .module('fdmobile.profile')
    .factory('profileService', profileService);

  function profileService($resource, urlBuilder, transformService) {
    return $resource(urlBuilder.build('mobiles'), null, {
      getmobileBaseInfo: {
        method: 'GET',
        url: urlBuilder.build('mobiles')
      },
      getmobileDiseaseInfo: {
        method: 'GET',
        url: urlBuilder.build('encounters/mobile/:mobileOid/profile')
      },
      getCurrentUserInfo: {
        method: 'GET',
        url: urlBuilder.build('./libs/user.php?action=getUserByName'),
        params: {
          name: ''
        },
        transformResponse: transformService.transformResponse
      }
    });
  }
})();
