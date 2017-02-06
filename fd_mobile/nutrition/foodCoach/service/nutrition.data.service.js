/**
 ***************************** BMIService *****************************
 *
 * This service is for save weight and height.
 *
 */
'use strict';

(function() {
  angular
    .module('fdmobile.nutrition')
    .factory('nutritionDataService', nutritionDataService);

  function nutritionDataService() {
    var height = 0.0;
    var weight = 0.0;
    var activity = '';
    var selectFood = null;
    var mobileInfo = null;

    var service = {
      setValue: setValue,
      getValue: getValue,
      setSelectFood: setSelectFood
    };
    return service;


    function setValue(value) {
      height = value.height;
      weight = value.weight;
      activity = value.activity;
    }

    function setSelectFood(foods, mobile) {
      selectFood = foods;
      mobileInfo = mobile;
    }

    function getValue() {
      var baseInfo = {};
      baseInfo.height = height;
      baseInfo.weight = weight;
      baseInfo.activity = activity;
      baseInfo.selectFood = selectFood;
      baseInfo.mobileInfo = mobileInfo;
      return baseInfo;
    }
  }
})();
