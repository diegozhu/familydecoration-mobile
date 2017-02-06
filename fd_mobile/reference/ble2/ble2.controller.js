(function() {
  'use strict';

  angular
    .module('fdmobile.reference.ble2')
    .controller('BleController2', BleController2);

  BleController2.$inject = ['CONSTANT', '$cordovaLocalNotification', '$filter', '$timeout', '$cordovaBLE', '$log', '$interval'];

  function BleController2(CONSTANT, $cordovaLocalNotification, $filter, $timeout, $ble, $log, $interval) {
    var vm = this,
      HARDCODE = 12,
      Int8Array = window['Int8Array'];
    vm.scanning = false;
    vm.logs = [];
    vm.devices = [];
    vm.devicesIds = {};
    vm.data = [];
    vm.device = {};
    vm.time = new Date();
    vm.record = false;
    vm.bpData = new Int8Array(0);

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

    vm.readData = function() {
      // window.bluetoothSerial.read( function(res) {
      //   $log.log('read success');
      //   $log.log(res);
      // }, function(res) {
      //   vm.log(res);
      // });
      // vm.data = [];
      // vm.log('reading data from ' + device.id);
      // device.readingBpData = true;
      // window.fdBle.getBPData(device.id, function(res) {
      //   vm.log('finish readData:' + res);
      //   var data = res.split('\n');
      //   data.every(function(str) {
      //     if (str !== undefined && str !== '') {
      //       var d = str.split('\\');
      //       vm.data.push({
      //         high: d[0],
      //         low: d[1],
      //         m: d[2],
      //         other: d[3],
      //         date: d[4]
      //       });
      //     }
      //     return true;
      //   });
      //   device.readingBpData = false;
      // }, function(res) {
      //   vm.log('finish readData:' + res);
      //   device.readingBpData = false;
      // });
      // vm.log('end readData from ' + device.id);
    };

    function processData(pack) {
      var bloodPresureData = pack_Blood(pack);
      var mData_blood = [];
      for (var i = 1; i <= HARDCODE; ++i) {
        mData_blood.push([
          bloodPresureData[i * 14 + 1],
          bloodPresureData[i * 14 + 2],
          bloodPresureData[i * 14 + 3],
          bloodPresureData[i * 14 + 4],
          bloodPresureData[i * 14 + 5],
          bloodPresureData[i * 14 + 6],
          bloodPresureData[i * 14 + 7],
          bloodPresureData[i * 14 + 9],
          bloodPresureData[i * 14 + 10],
          bloodPresureData[i * 14 + 11],
          bloodPresureData[i * 14 + 12],
          bloodPresureData[i * 14 + 13]
        ]);
      }
      return mData_blood;
    }

    function pack_Blood(pBlood) {
      var j, i;
      for (j = 3; j < 14; ++j) {
        pBlood[j] = (pBlood[j] & (pBlood[2] << ( j < 10 ? 10 : 14 ) - j | 127));
      }
      for (j = 0; j < HARDCODE; ++j) {
        for (i = ( j + 1 ) * 14 ; i < ( j + 1 ) * 14 + 8 ; ++ i) {
          pBlood[i] = (pBlood[i] & (pBlood[( j + 1 ) * 14] << 14 + j * 14 + 8 - i | 127));
        }
        for (i = ( j + 1 ) * 14 + 8; i < ( j + 1 ) * 14 + 14; ++i) {
          pBlood[i] = (pBlood[i] & (pBlood[14 + j * 14 + 8] << 14 + j * 14 + 8 + 6 - i | 127));
        }
      }
      return pBlood;
    }

    vm.getBloodPressureData = function() {
      var res = '', i;
      window.d = vm.bpData;
      var data = new Int8Array(vm.bpData.length - 4);
      for (i = 0; i < vm.bpData.length - 4; i++ ) {
        data[i] = vm.bpData[i + 4];
      }
      data = processData(data);
      for (i = 0 ; i < data.length ; i++) {
        var _res = data[i];
        var hiPre = ((_res[0] << 8) | (_res[1] & 0xff)) & 0xffff;// 高压
        var lowPre = _res[2] & 0xff;// 低压
        var pulseRate = _res[3];
        var meanPressure = _res[4];
        var year = '20' + _res[5];
        var month = (_res[6] > 9 ? '' : '0') + _res[6];
        var day = (_res[7] > 9 ? '' : '0') + _res[7];
        var hour = (_res[8] > 9 ? '' : '0') + _res[8];
        var minute = (_res[9] > 9 ? '' : '0') + _res[9];
        var second = (_res[10] > 9 ? '' : '0') + _res[10];
        var datetime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        res += '<br />\n' +  hiPre + '\\' + lowPre + '\\' + pulseRate + '\\' + meanPressure + '\\' + datetime;
      }
      $log.log(res);
      vm.log(res);
      return res;
    };

    vm.connect = function(device) {
      //window.bluetoothSerial.connect(device.id, function(res) {

        // var handshake = new Int8Array(6);
        // handshake[0] = 0x42;
        // handshake[1] = 0x8f;
        // handshake[2] = 0xFF;
        // handshake[3] = 0xFE;
        // handshake[4] = 0xFD;
        // handshake[5] = 0xFC;

        // var data = new Int8Array(6);
        // data[0] = 0x43;
        // data[1] = 0x42;
        // data[2] = 0x01;
        // data[3] = 0x07;
        // data[4] = 0x05;
        // data[5] = 0x00;

        // $log.log('connect success');
        // vm.bpData = new Int8Array(0);

        // window.bluetoothSerial.write(handshake.buffer, function() {
        //   $log.log('write handshake ok success');

        //   window.bluetoothSerial.write(data.buffer, function(res) {
        //     $log.log('write bloodpresure success');
        //     $log.log(res);
            // window.bluetoothSerial.subscribe('\n', function(data) {
            //   $log.log(data);
            // });
            // window.bluetoothSerial.subscribeRawData(function(data) {
            //   $log.log('[raw]');
            //   var d = new Int8Array(data), i;
            //   var res = '';
            //   var tmp = vm.bpData;
            //   vm.bpData = new Int8Array(tmp.length + data.byteLength);
            //   for (i = 0; i < tmp.length; i++) {
            //     vm.bpData[i] = tmp[i];
            //   }
            //   for (i = 0; i < d.length; i++) {
            //     vm.bpData[tmp.length + i] = d[i];
            //     res += ' ' + d[i].toString();
            //   }
            //   vm.log(res);
            //   $log.log(res);
            // });
        //   }, function(res) {
        //     vm.log(res);
        //   });

        // }, function(res) {
        //   vm.log(res);
        // });

      vm.device = device;
      vm.log('connect clicked ' + device.id);
      $ble.connect(device.id).then(function(res) {
        vm.log('connect success');
        $log.log(res);
        // var data = new Int8Array(6);
        // data[0] = 0x43;
        // data[1] = 0x42;
        // data[2] = 0x01;
        // data[3] = 0x07;
        // data[4] = 0x05;
        // data[5] = 0x00;
        // $ble.write(device.id, '00001101-0000-1000-8000-00805F9B34FB', characteristic_uuid, data.buffer, function(res) {
        //   $log.log($res);
        // }, function(res) {
        //   vm.log(res);
        // });
        device.isConnected = true;
        var heartRate = {
          service: '180d',
          measurement: '2a37'
        };
        vm.log('start startNotification.');
        $ble.startNotification(device.id, heartRate.service, heartRate.measurement, function(res) {
          vm.log('success');
          $log.log(res);
        }, function(res) {
          vm.log(res);
        });

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
