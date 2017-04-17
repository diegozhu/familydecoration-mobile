(function() {
  'use strict';

  angular
    .module('fdmobile.profile')
    .factory('profileService', profileService);

  function profileService($resource, urlBuilder) {
    return $resource(urlBuilder.build('mobiles'), null, {
      getmobileBaseInfo: {
        method: 'GET',
        url: urlBuilder.build('mobiles')
      },
      getmobileDiseaseInfo: {
        method: 'GET',
        url: urlBuilder.build('encounters/mobile/:mobileOid/profile')
      },
      getUserProfileImage: {
        method: 'GET',
        url: urlBuilder.build('./libs/user.php?action=')
      }
    });
  }
})();
