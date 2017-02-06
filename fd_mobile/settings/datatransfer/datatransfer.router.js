(function() {
  'use strict';

  angular
    .module('fdmobile.datatransfer')
    .config(datatransfer);

  datatransfer.$inject = ['$stateProvider'];

  function datatransfer($stateProvider) {
    $stateProvider
      .state('settings-datatransfer', {
        url: '/settings/datatransfer',
        cache: false,
        templateUrl: 'settings/datatransfer/datatransfer.html',
        controller: 'DatatransferController as vm'
      });
  }
})();
