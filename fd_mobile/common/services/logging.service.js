(function() {
  'use strict';

  angular
    .module('fdmobile.logging', [])
    .factory('traceService', function() {
      return {
        trace: window.StackTrace
      };
    })
    .provider('$exceptionHandler', {
      $get: function(loggingService) {
        return loggingService;
      }
    })
    .factory('loggingService', loggingService);

  function loggingService($log, CONSTANT) {
    function error(exception) {
      $log.log(exception);
      if (CONSTANT.LOGGER === 'ON') {
        //var trace = traceService.trace;
        //
        // trace
        //   .report(exception.stack, urlBuilder.build('log/save'))
        //   .catch(function(err) {
        //     $log.error(err.message);
        //   });
      }

      $log.error.apply($log, arguments);
    }

    return error;
  }
})();
