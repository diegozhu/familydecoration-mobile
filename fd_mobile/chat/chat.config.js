(function() {
  'use strict';

  angular
    .module('fdmobile.chat')
    .config(logConfig);

  function logConfig($logProvider) {
    $logProvider.debugEnabled(false);
  }
})();
