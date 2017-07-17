(function() {
  'use strict';

  angular
    .module('fdmobile.login')
    .controller('LoginController', LoginController);

  function LoginController($log, $state, CONSTANT, urlBuilder, authenticationService) {
    var vm = this;

    vm.username = '';
    vm.password = '';
    vm.version = CONSTANT.VERSION;
    vm.versionClickTime = 0;

    vm.login = function() {
      authenticationService.login({
        name: vm.username,
        password: vm.password
      });
    };

    //if already fired, will run callback instantly
    document.addEventListener('deviceready', function() {
      $log.log('deviceready');
      authenticationService.checkUpdate().then(function(newVersion) {
        $log.log('checkUpdate');
        if (!newVersion) {
          $log.log('tryAutoLogin');
          authenticationService.tryAutoLogin();
        }
      });
    }, false);

    vm.clickVersion = function() {
      vm.versionClickTime ++;
      if (vm.versionClickTime >= 6) {
        vm.versionClickTime = 0;
        if (!confirm('重新设置一次性服务器地址? 当前:' + urlBuilder.build(''))) {
          return ;
        }
        var all = '', input;
        while (input != 'http' && input != 'https' && input !== null) {
          input = prompt('协议? http or https ? ');
        }
        if (!input) {
          return ;
        }
        localStorage.setItem('protocol', input + '://');
        all += input + '://';
        input = prompt('host?' + all);
        if (!input) {
          return ;
        }
        all += input.replace(/\//gi,'');
        localStorage.setItem('host', input.replace(/\//gi,''));
        input = prompt('port?' + all);
        if (!input) {
          return ;
        }
        all += ':' + input.match(/\d/g).join('');
        localStorage.setItem('port', input.match(/\d/g).join(''));
        input = prompt('baseUrl?' + all);
        if (!input) {
          return ;
        }
        all += ('/' + input + '/').replace(/\/\//gi,'/');
        localStorage.setItem('baseUrl', ('/' + input + '/').replace(/\/\//gi,'/'));
        confirm(all) && location.reload();
      }
    };
  }
})();
