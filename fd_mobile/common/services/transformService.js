(function() {
  'use strict';

  angular.module('fdmobile').factory('transformService', function() {
    return {
      transformRequest: function(data) {
        var s = [];
        for (var d in data) {
          s.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        }
        return s.join('&');
      },
      transformResponse: function(jsonData) {
        var obj = {},
          data = angular.fromJson(jsonData);
        if (data.status === 'failing') {
          obj = data;
        }
        else {
          obj.data = data;
          obj.total = data.length;
        }
        return obj;
      }
    };
  });
})();
