(function() {
  'use strict';

  angular
    .module('fdmobile.measurements')
    .factory('measurementsService', measurementsService);

  function measurementsService($resource, urlBuilder, CONSTANT, $ionicModal, $filter, $cordovaBLE, $log, $timeout, $translate) {
    var vm = {}, $scope,
      modalTemplateUrls = {};
    modalTemplateUrls[CONSTANT.HEART_RATE_CODE] = 'plan/measurements/modal/add-heart-rate.modal.html';
    modalTemplateUrls[CONSTANT.BLOOD_PRESSURE_CODE] = 'plan/measurements/modal/add-blood-pressure.modal.html';
    modalTemplateUrls[CONSTANT.FASTING_BLOOD_GLUCOSE_CODE] = 'plan/measurements/modal/add-fasting-blood-glucose.modal.html';
    modalTemplateUrls[CONSTANT.MEASUREMENT_CHOSE_CODE] = 'plan/measurements/modal/chose-manual-or-auto.modal.html';
    modalTemplateUrls[CONSTANT.MEASUREMENT_BLUETOOTH_CODE] = 'plan/measurements/modal/add-blood-pressure-and-heart-rate-auto.modal.html';
    modalTemplateUrls[CONSTANT.POSTPRANDIAL_BLOOD_GLUCOSE_CODE] = 'plan/measurements/modal/add-prandial-blood-glucose.modal.html';
    modalTemplateUrls[CONSTANT.WEIGHT_CODE] = 'plan/measurements/modal/add-weight.modal.html';

    function initMeasurementDateTime() {
      var date = new Date(),
        millisecondsOfThirtyDay = 60 * 60 * 24 * 29 * 1000,
        millisecondsOfCurrent = date.getTime(),
        minDate = millisecondsOfCurrent - millisecondsOfThirtyDay;

      return {
        date: date,
        time: date,
        maxDate: date.getTime(),
        maxTime: date.getTime(),
        minDate: minDate
      };
    }

    function setViewAndModel(viewAndModel, scope) {
      if (typeof viewAndModel === 'undefined' || typeof scope === 'undefined') {
        throw 'need vm as first argument, and scope as second.';
      }
      vm = viewAndModel;
      if (typeof vm.choseAndOpenModal !== 'undefined') {
        throw 'vm already have field called \'choseAndOpenModal\'';
      }
      if (typeof vm.bleScanning !== 'undefined') {
        throw 'vm already have field called \'bleScanning\'';
      }
      if (typeof vm.bleScanFailed !== 'undefined') {
        throw 'vm already have field called \'bleScanFailed\'';
      }
      if (typeof vm.btnErrorMsgTxt !== 'undefined') {
        throw 'vm already have field called \'btnErrorMsgTxt\'';
      }
      if (typeof vm.btnBleDetailMsg !== 'undefined') {
        throw 'vm already have field called \'btnBleDetailMsg\'';
      }
      if (typeof vm.btnShowDetailMsg !== 'undefined') {
        throw 'vm already have field called \'btnShowDetailMsg\'';
      }
      if (typeof vm.bleDevice !== 'undefined') {
        throw 'vm already have field called \'bleDevice\'';
      }
      if (typeof vm.bleData !== 'undefined') {
        throw 'vm already have field called \'bleData\'';
      }
      if (typeof vm.btnShowDetailMsgClick !== 'undefined') {
        throw 'vm already have field called \'btnShowDetailMsgClick\'';
      }
      if (typeof vm.scanAndReadBleDevices !== 'undefined') {
        throw 'vm already have field called \'scanAndReadBleDevices\'';
      }
      if (typeof vm.stopScanBleDevices !== 'undefined') {
        throw 'vm already have field called \'stopScanBleDevices\'';
      }
      if (typeof vm.closeObservationModal !== 'undefined') {
        throw 'vm already have field called \'closeObservationModal\'';
      }
      vm.choseAndOpenModal = choseAndOpenModal;
      vm.bleScanning = false;
      vm.bleScanFailed = false;
      vm.btnErrorMsgTxt = '';
      vm.btnBleDetailMsg = [];
      vm.btnShowDetailMsg = 0;   // if > 5 , show msg.
      vm.bleDevice = null;
      vm.bleData = [];
      vm.btnShowDetailMsgClick = btnShowDetailMsgClick;
      vm.scanAndReadBleDevices = scanAndReadBleDevices;
      vm.stopScanBleDevices = stopScanBleDevices;
      vm.closeObservationModal = closeModal;
      $scope = scope;

      vm.validator = true;
      $scope.$on('validator', function($event, valid) {
        vm.validator = valid;
      });
    }

    function stopScanBleDevices() {
      vm.bleScanning = false;
      vm.bleScanFailed = false;
      closeModal();
      vm.invokeId = null;
    }

    function btnShowDetailMsgClick() {
      vm.btnShowDetailMsg ++;
      if (vm.btnShowDetailMsg > 6) {
        vm.btnShowDetailMsg = 0;
      }
    }

    function log(str) {
      var a = new Date();
      var timestamp = a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds() + ',' + a.getMilliseconds();
      vm.btnBleDetailMsg.push('[' + timestamp + '] ' + str);
    }

    function scanAndReadBleDevices() {
      vm.bleData = [];
      vm.bleScanning = true;
      vm.bleScanFailed = false;
      vm.invokeId = (new Date()).getTime() + '-' + parseInt(Math.random() * 1000);
      vm.btnBleDetailMsg = [];
      //此处用闭包。解决问题：如果正在扫描，读取蓝牙，点取消，再此扫描读取蓝牙，因为现在的取消是假取消，若第一次成功，第二次失败，会导致分别触发
      //success函数和fail函数，因此，每次点击扫描的时候，vm上绑定一个随机数invokeId，将其通过闭包传进去，success和fail函数根据自己闭包上下文中保
      //存的invokeId和vm中的invokeId相比较，若一致则说明没有点取消，可以正常触发回调。若不一致，说明回调执行时，已经有并行的扫描点击回调了，不用
      //执行当前已过期的了。另外还可以通过手动维护任务队列去做。暂时这样处理简单点。
      _scanAndReadBleDevices((function(id) {
        //success function
        return function(bleData) {
          $log.log('success-id:' + id + ',invokeId:' + vm.invokeId);
          if (vm.invokeId !== id) {
            return ;
          }
          $scope.$apply(function() {
            vm.bleData = bleData;
            vm.observationModel.dyastolicBloodPressure = parseInt(bleData[0].high);
            vm.observationModel.systolicBloodPressure = parseInt(bleData[0].low);
            vm.observationModel.heartRate = parseInt(bleData[0].m);
            vm.dateTimePicker.date = new Date(bleData[0].date);
            vm.bleScanning = false;
            vm.bleScanFailed = false;
          });
        };
      })(vm.invokeId), (function(id) {
        //error function
        return function(errorMsg) {
          //possible errorMsg:
          // User did not enable Bluetooth
          // could not find device
          // error read failed, socket might closed or timeout, read ret: -1
          // bt socket closed, read return : -1
          $log.log('error-id:' + id + ',invokeId:' + vm.invokeId);
          if (vm.invokeId !== id) {
            return ;
          }
          vm.bleScanning = false;
          vm.bleScanFailed = true;
          $log.log(errorMsg);
          if (errorMsg.contains('User did not enable Bluetooth')) {
            vm.btnErrorMsgTxt = $translate.instant('ERROR_USER_NOT_ENABLE_BLE');
          } else if (errorMsg.contains('could not find device')) {
            vm.btnErrorMsgTxt = $translate.instant('ERROR_COULD_NOT_FIND_DEVICE');
          } else if (errorMsg.contains('closed') || errorMsg.contains('timeout')) {
            vm.btnErrorMsgTxt = $translate.instant('ERROR_READ_TIMEOUT');
          } else {
            vm.btnErrorMsgTxt = errorMsg;
          }
          log(errorMsg);
          log(vm.btnErrorMsgTxt);
          try {
            $scope.$digest();
          } catch (e) {
            //$log.log(e);
          }
        };
      })(vm.invokeId), (function(id) {
        //progress function
        return function(msg) {
          $log.log('error-id:' + id + ',invokeId:' + vm.invokeId);
          if (vm.invokeId !== id) {
            return ;
          }
          $log.log(msg);
          log(msg);
          try {
            $scope.$digest();
          } catch (e) {
            //$log.log(e);
          }
        };
      })(vm.invokeId));
    }

    function getViewAndModel() {
      return vm;
    }

    function choseAndOpenModal(measurementType, cfgValue) {
      localStorage.setItem('settings.devices.model', cfgValue);
      _openModal(CONSTANT[measurementType], $scope);
      if (measurementType === 'MEASUREMENT_BLUETOOTH_CODE') {
        vm.scanAndReadBleDevices();
      }
    }

    function openModal(measurementType) {
      var measurementCode = CONSTANT[measurementType],
        cfg = localStorage.getItem('settings.devices.model') || 'CHOSE';

      vm.measurementType = measurementType;
      if (measurementType === 'HEART_RATE_CODE' || measurementType === 'BLOOD_PRESSURE_CODE') {
        if (cfg === 'AUTO') {
          measurementCode = CONSTANT.MEASUREMENT_BLUETOOTH_CODE;
        } else if (cfg === 'CHOSE') {
          measurementCode = CONSTANT.MEASUREMENT_CHOSE_CODE;
        }
      }
      _openModal(measurementCode, $scope);
      if (measurementCode === CONSTANT.MEASUREMENT_BLUETOOTH_CODE) {
        vm.scanAndReadBleDevices();
      }
    }

    function _openModal(measurementCode, scope) {
      closeModal();
      var modalTemplateUrl = modalTemplateUrls[measurementCode],
        viewAndModel = getViewAndModel();

      viewAndModel.dateTimePicker = initMeasurementDateTime();

      var modal = $ionicModal.fromTemplateUrl(modalTemplateUrl, {
        scope: scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        viewAndModel.observationModel = modal;
        modal.show();
        scope.$on('$destroy', function() {
          if (viewAndModel.observationModel) {
            viewAndModel.observationModel.remove();
          }
        });
      });
      return modal;
    }

    function _scanAndReadBleDevices(callback, errorCallback, onProgressCallBack) {
      $cordovaBLE.isEnabled().then(function() {
        $log.log('Bluetooth is enabled');
        onProgressCallBack('Bluetooth is enabled');
        var timeoutPromise = $timeout(function() {
          $cordovaBLE.stopScan();
          errorCallback('could not find device.');
        }, 5000 );
        onProgressCallBack('starting scan');
        $cordovaBLE.startScan([], function(device) {
          $log.log('find device: ' + device.name + '(' + device.id + ')');
          if (!device.id || !device.name || !device.name.startsWith('NIBP')) {
            onProgressCallBack('find device: ' + device.name + '(' + device.id + '), pass');
            return ;
          }
          onProgressCallBack('find device: ' + device.name + '(' + device.id + '), reading data.');
          $timeout.cancel(timeoutPromise);
          $cordovaBLE.stopScan();
          $log.log(device);
          $log.log('reading data from:' + device.id);
          window.fdBle.getBPData(device.id, callback, errorCallback);
        }, errorCallback);
      }).catch(function() {
        onProgressCallBack('bluetooth not enabled, enabling.');
        $cordovaBLE.enable().then(function() {
          scanAndReadBleDevices(callback, errorCallback, onProgressCallBack);
        }).catch(errorCallback);
      });
    }

    function closeModal() {
      var viewAndModel = getViewAndModel();
      if (viewAndModel && viewAndModel.observationModel) {
        viewAndModel.observationModel.hide();
      }
    }

    function buildObservationModels(observationCode) {
      var viewAndModel = getViewAndModel(),
        obserTime = viewAndModel.dateTimePicker.date,
        model = viewAndModel.observationModel,
        observations = [];

      switch (observationCode) {
        case CONSTANT.MEASUREMENT_BLUETOOTH_CODE:
          observations.push(buildSingleObservationModel(CONSTANT.SYSTOLIC_BLOOD_PRESSURE_CODE, obserTime, model.systolicBloodPressure));
          observations.push(buildSingleObservationModel(CONSTANT.DIASTOLIC_BLOOD_PRESSURE_CODE, obserTime, model.dyastolicBloodPressure));
          observations.push(buildSingleObservationModel(CONSTANT.HEART_RATE_CODE, obserTime, model.heartRate));
          break;
        case CONSTANT.BLOOD_PRESSURE_CODE:
          observations.push(buildSingleObservationModel(CONSTANT.SYSTOLIC_BLOOD_PRESSURE_CODE, obserTime, model.systolicBloodPressure));
          observations.push(buildSingleObservationModel(CONSTANT.DIASTOLIC_BLOOD_PRESSURE_CODE, obserTime, model.dyastolicBloodPressure));
          break;
        default:
          observations.push(buildSingleObservationModel(observationCode, obserTime, model.value));
          break;
      }
      return observations;
    }

    function buildSingleObservationModel(observationCode, obserDate, value) {
      var observationModel = {
        code: observationCode,
        dateAsserted: new Date(),
        obserDate: obserDate,
        value: value
      };
      if (observationCode === CONSTANT.SYSTOLIC_BLOOD_PRESSURE_CODE || observationCode === CONSTANT.DIASTOLIC_BLOOD_PRESSURE_CODE) {
        // The blood pressure observed in the morning or evening.
        if (6 <= obserDate.getHours() && obserDate.getHours() < 9) {
          obserDate.conditionCode = CONSTANT.MEASUREMENT_CONDITION_MORNING_CODE;
        }
        if (18 <= obserDate.getHours() && obserDate.getHours() < 21) {
          obserDate.conditionCode = CONSTANT.MEASUREMENT_CONDITION_EVENING_CODE;
        }
      }
      return observationModel;
    }

    function getResource() {
      return $resource(urlBuilder.build('observation/save'), null, {
        addMeasurementsService: {
          method: 'POST'
        },
        addMeasurementsBatch: {
          method: 'POST',
          url: urlBuilder.build('observation/batchSave')
        },
        getLastObservationPerDay: {
          url: urlBuilder.build('observation/lastObservationPerDay'),
          method: 'GET',
          params: {
            code: '@code',
            conditionCode: '@conditionCode',
            dateFrom: '@dateFrom',
            dateEnd: '@dateEnd'
          }
        },
        displayMeasurementsService: {
          method: 'GET',
          url: urlBuilder.build('observation/:code'),
          params: {
            code: '@code'
          }
        },
        doMeasurementTask: {
          method: 'POST',
          url: urlBuilder.build('observation/task/:taskOid/completion'),
          params: {
            taskOid: '@taskOid'
          }
        }
      });
    }

    function completeMeasurementTask(observationTasks) {
      var lastPromise;
      observationTasks.every(function(task) {
        var taskOid = task.oid;
        lastPromise = getResource().doMeasurementTask({ taskOid: taskOid }, task);
        return true;
      });
      return lastPromise;
    }

    return {
      getResource: getResource,
      openModal: openModal,
      scanAndReadBleDevices: scanAndReadBleDevices,
      closeModal: closeModal,
      buildObservationModels: buildObservationModels,
      setViewAndModel: setViewAndModel,
      completeMeasurementTask: completeMeasurementTask
    };
  }
})();
