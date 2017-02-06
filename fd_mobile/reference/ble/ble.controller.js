(function() {
  'use strict';

  angular
    .module('fdmobile.reference.ble')
    .controller('BleController', BleController);

  BleController.$inject = ['CONSTANT', '$cordovaLocalNotification', '$filter', '$timeout', '$cordovaBLE', '$log', '$interval'];

  function BleController(CONSTANT, $cordovaLocalNotification, $filter, $timeout, $ble, $log, $interval) {
    var vm = this;
    vm.scanning = false;
    vm.logs = [];
    vm.devices = [];
    vm.devicesIds = {};
    vm.data = [];
    vm.device = {};
    vm.time = new Date();

    // vm.devices.push({name: 'aaa', id: 'AA:BB:CC:DD:EE:FF'});
    // vm.devices.push({name: 'aaa', id: 'AA:BB:CC:DD:EE:FF'});
    // vm.devices.push({name: 'aaa', id: 'AA:BB:CC:DD:EE:FF'});
    // vm.devices.push({name: 'aaa', id: 'AA:BB:CC:DD:EE:FF'});
    $interval(function() {
      vm.time = new Date();
    }, 1000);

    $interval(function() {
      //vm.log('refresh devices status.');
      vm.devices.every(function(device) {
        $ble.isConnected(device.id).then(function(ok) {
          //$log.log(device.id + ':' + ok);
          device.isConnected = ok === 'OK';
        }).catch(function() {
          device.isConnected = false;
        });
        return true;  //carry on the loop to iterate all the elements in devices.
      });
    }, 5000);

    $ble.isEnabled().then(function() {
      vm.log('isEnabled:Bluetooth is enabled');
    }).catch(function() {
      vm.log('isEnabled:Bluetooth is *not* enabled');
    });

    $ble.enable().then(function() {
      vm.log('enable:Bluetooth is enabled');
    }).catch(function() {
      vm.log('enable:Bluetooth is *not* enabled');
    });

    vm.clearLog = function() {
      vm.logs = [];
      vm.log('clear');
    };

    vm.log = function(str) {
      $log.log(str);
      vm.logs.unshift({
        text: typeof str === 'object' ? JSON.stringify(str) : str,
        date: new Date()
      });
    };

    vm.isConnected = function(device) {
      vm.log('test is connected for ' + device.id);
      $ble.isConnected(device.id).then(function(ok) {
        vm.log(device.id + ':' + ok);
        device.isConnected = ok === 'OK';
      }).catch(function() {
        device.isConnected = false;
      });
    };

    vm.readData = function(device) {
      vm.data = [];
      vm.log('reading data from ' + device.id);
      device.readingBpData = true;
      window.fdBle.getBPData(device.id, function(res) {
        vm.log('finish readData:' + res);
        var data = res.split('\n');
        data.every(function(str) {
          if (str !== undefined && str !== '') {
            var d = str.split('\\');
            vm.data.push({
              high: d[0],
              low: d[1],
              m: d[2],
              other: d[3],
              date: d[4]
            });
          }
          return true;
        });
        device.readingBpData = false;
      }, function(res) {
        vm.log('finish readData:' + res);
        device.readingBpData = false;
      });
      vm.log('end readData from ' + device.id);
    };

    vm.connect = function(device) {
      vm.device = device;
      vm.log('connect clicked ' + device.id);
      $ble.connect(device.id).then(function() {
        vm.log('connect success');
        device.isConnected = true;
      }).catch(function(res) {
        vm.log(res);
      });
    };

    vm.scan = function() {
      vm.scanning = true;
      vm.devicesIds = {};
      vm.devices = [];
      $timeout(function() {
        $ble.startScan([], function(device) {
          if (device.id && !vm.devicesIds[device.id]) {
            vm.devicesIds[device.id] = true;
            device.isConnected = false;
            vm.devices.push(device);
          } else {
            vm.log('duplicated or null ' + device.id);
          }
        }, function(err) {
          vm.scanning = false;
          vm.log(err);
        });
      }, 0);

      $timeout(function() {
        vm.scanning = false;
        $ble.stopScan();
      }, 5000 );
    };
  }

})();
