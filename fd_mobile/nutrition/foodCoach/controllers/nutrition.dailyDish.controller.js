(function() {
  angular
    .module('fdmobile.nutrition')
    .controller('NutritionDailyDishController', NutritionDailyDishController);

  NutritionDailyDishController.$inject = ['$scope', '$state', '$translate', '$filter',
    '$location', '$ionicLoading', 'nutritionService', 'nutritionDataService', 'nutritionPopupService'
  ];

  function NutritionDailyDishController($scope, $state, $translate, $filter,
    $location, $ionicLoading, nutritionService, nutritionDataService, nutritionPopupService) {
    var vm = this;

    vm.screenShot = screenShot;
    init();

    function init() {
      vm.creatDishLoading = true;
      vm.pieData = [];
      getFoodVolume();
      $scope.$on('$ionicView.beforeLeave', function(event) {
        event.preventDefault();
        $state.go('home.nutrition');
      });
    }

    function getFoodVolume() {
      vm.creatDishLoading = false;
      vm.loadingSuccess = true;
      var mobileInfo = {};
      var sortSelectFoods = null;

      var obj = nutritionDataService.getValue();

      mobileInfo = obj.mobileInfo;
      mobileInfo.mobileBasicInfoModel.weight = parseFloat(obj.weight);
      mobileInfo.mobileBasicInfoModel.height = parseFloat(obj.height);
      mobileInfo.mobileBasicInfoModel.pal = obj.activity;

      sortSelectFoods = obj.selectFood;

      var pieData = [];
      var foodListArray = [];

      window.ImgCache.init(function() {
        angular.forEach(sortSelectFoods, function(data) {
          window.ImgCache.cacheFile(data.src);
        });
      }, function() {
        alert('ImgCache init: error! Check the log for errors');
      });
      angular.forEach(sortSelectFoods, function(data) {
        foodListArray.push(data.displayName);
      });

      mobileInfo.foodList = foodListArray;

      nutritionService.getFoodVolume(mobileInfo, function(result) {
        vm.creatDishLoading = true;
        pieData = [];
        pieData.push(result.data.result.proportionRatio.cho);
        pieData.push(result.data.result.proportionRatio.pro);
        pieData.push(result.data.result.proportionRatio.fat);
        vm.pieData = pieData;
        vm.drugList = result.data.drugList;
        vm.noticeList = result.data.noticeList;
        vm.acturalEnergy = result.data.result.actualEnergy;

        angular.forEach(sortSelectFoods, function(item) {
          var keepGoing = true;
          if (result.data.result.foodList.porridge) {
            if (result.data.result.foodList.porridge.porridgeName === item.displayName) {
              result.data.result.foodList.porridge.src = item.src;
            }
          }
          angular.forEach(result.data.result.foodList.nonPorridge, function(it) {
            if (keepGoing && it.ingredient === item.displayName) {
              it.src = item.src;
              it.sortId = item.sortId;
              keepGoing = false;
            }
          });
        });
        result.data.result.foodList.nonPorridge = $filter('orderBy')(result.data.result.foodList.nonPorridge, 'sortId');
        vm.volumeFoods = result.data.result.foodList;
        vm.micro = result.data.result.micronutrientWeight;
      }, function() {
        vm.loadingSuccess = false;
        $ionicLoading.show({
          template: $translate.instant('CALCULATE_ERROR'),
          duration: 800
        });
      });
    }

    function screenShot() {
      var $ = window.jQuery;
      $('#domToImage').remove();
      var tempEle = $('<div></div>');
      tempEle.attr('id', 'domToImage');
      tempEle.appendTo('body');

      $('.dailyDish').clone().prependTo('#domToImage');
      window.html2canvas($('#domToImage'), {
        'allowTaint': true,
        onrendered: function(canvas) {
          var dataURL = canvas.toDataURL();
          window.open(dataURL);
          window.canvas2ImagePlugin.saveImageDataToLibrary(
            function() {},
            function() {},
            canvas
          );
          $('#domToImage').remove();
          nutritionPopupService.showToast($translate.instant('CANVAS_ERROR'));
          window.ImgCache.clearCache();
        }
      });

    }
  }
})();
