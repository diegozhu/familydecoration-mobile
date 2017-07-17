(function() {
  'use strict';

  angular
    .module('fdmobile')
    .factory('urlBuilder', urlBuilder);

  urlBuilder.$inject = ['CONSTANT'];

  function urlBuilder(CONSTANT) {

    var protocol = localStorage.getItem('protocol') || CONSTANT.PROTOCAL,
      host = localStorage.getItem('host') || CONSTANT.HOST,
      port = localStorage.getItem('port') || CONSTANT.PORT,
      baseUrl = localStorage.getItem('baseUrl') || CONSTANT.BASEURI,
      builder = {};

    if (localStorage.getItem('host')) {
      localStorage.removeItem('host');
      localStorage.removeItem('port');
      localStorage.removeItem('protocol');
      localStorage.removeItem('baseUrl');
    }

    builder.build = build;
    builder.protocol = protocol;
    builder.host = host;
    builder.port = port;
    builder.baseUrl = baseUrl;

    function build(uri) {
      return protocol + host + ':' + port + baseUrl + uri;
    }

    return builder;
  }
})();
