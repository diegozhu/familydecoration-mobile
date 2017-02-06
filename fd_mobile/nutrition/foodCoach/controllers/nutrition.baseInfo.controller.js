(function() {
  angular
    .module('fdmobile.nutrition')
    .controller('NutritionBaseInfoController', NutritionBaseInfoController);

  NutritionBaseInfoController.$inject = ['$scope', '$state', '$translate', '$location', 'nutritionDataService', 'nutritionPopupService'];

  function NutritionBaseInfoController($scope, $state, $translate, $location, nutritionDataService, nutritionPopupService) {
    var vm = this;

    angular.extend(vm, {
      gotoNutritionPage: gotoNutritionPage,
      addNumber: addNumber,
      deleteNumber: deleteNumber,
    });

    init();

    function init() {

      if ($location.url() === '/nutrition/config/bmi') {
        var contentBmi = $translate.instant('NUTRITION_POPUP_TIP_CONTENT');
        nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', contentBmi, 'NUTRITION_POPUP_TIP_BTN');
      }

      vm.selectNumber = 0;
      var obj = nutritionDataService.getValue();
      vm.height = obj.height;
      vm.weight = obj.weight;
      vm.activity = obj.activity;
    }

    function gotoNutritionPage(url) {
      nutritionDataService.setValue(vm);
      $state.go(url);
    }

    function addNumber(number) {
      if (number < 100) {
        if (vm.weight === 0) {
          vm.weight = number;
        } else if (vm.weight < 100) {
          vm.weight = (parseFloat(vm.weight) + 0.1).toFixed(1);
        }
      } else {
        if (vm.height === 0) {
          vm.height = number;
        } else if (vm.height < 200) {
          vm.height = (parseFloat(vm.height) + 0.1).toFixed(1);
        }
      }
    }

    function deleteNumber(number) {
      if (number === 30) {
        if (vm.weight > 30) {
          vm.weight = (parseFloat(vm.weight) - 0.1).toFixed(1);
        }
      } else {
        if (vm.height > 145) {
          vm.height = (parseFloat(vm.height) - 0.1).toFixed(1);
        }
      }
    }
  }
})();
