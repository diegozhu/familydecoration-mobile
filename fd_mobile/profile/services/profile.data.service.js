(function() {
  'use strict';

  angular
    .module('fdmobile.profile')
    .factory('profileDataService', profileDataService);

  function profileDataService() {
    var factory = {
      mobileInfo: null,
      setmobileInfo: setmobileInfo,
      getmobileInfo: getmobileInfo
    };
    return factory;

    function setmobileInfo(value) {
      factory.mobileInfo = value;
    }

    function getmobileInfo() {
      return factory.mobileInfo;
    }

  }
})();
