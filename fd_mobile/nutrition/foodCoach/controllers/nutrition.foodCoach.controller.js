(function() {
  angular
    .module('fdmobile.nutrition')
    .controller('NutritionfoodCoachController', NutritionfoodCoachController);

  NutritionfoodCoachController.$inject = ['$scope', '$state', '$fdPopup', '$translate', '$ionicModal', '$filter',
    '$location', '$anchorScroll', '$ionicLoading', 'nutritionService', 'nutritionDataService', 'nutritionPopupService'
  ];

  function NutritionfoodCoachController($scope, $state, $fdPopup, $translate, $ionicModal, $filter,
    $location, $anchorScroll, $ionicLoading, nutritionService, nutritionDataService, nutritionPopupService) {
    var vm = this;

    angular.extend(vm, {
      openCartModal: openCartModal,
      closeCartModal: closeCartModal,
      openEducationCardModal: openEducationCardModal,
      closeEducationCardModal: closeEducationCardModal,
      addToCart: addToCart,
      deleteFromCart: deleteFromCart,
      gotoNutritionPage: gotoNutritionPage,
      setFoodKind: setFoodKind,
      loadFoodLibrary: loadFoodLibrary
    });

    var foodCategory = {
      grain: $translate.instant('GRAIN'),
      cereal: $translate.instant('CEREAL'),
      potato: $translate.instant('POTATO'),
      porridge: $translate.instant('PORRIDGE'),
      protein: $translate.instant('PROTETIN'),
      fish: $translate.instant('FISH'),
      meat: $translate.instant('MEAT'),
      egg: $translate.instant('EGG'),
      vegetable: $translate.instant('VEGETABLE'),
      milk: $translate.instant('MILK'),
      fruit: $translate.instant('FRUIT'),
      grease: $translate.instant('GREASE'),
      bean: $translate.instant('BEAN'),
      mast: $translate.instant('MAST')
    };
    var foodKindValue = {
      grain: null,
      protein: null,
      vegetable: null,
      milk: null,
      fruit: null,
      grease: null
    };
    var allFoods = null;

    init();

    function init() {
      if ($location.url() === '/nutrition/list/grain') {
        var contentList = '<div class="nutrition-list-pop"><p>{{"LIST_SUBTITLE" | translate}}</p>' +
          '<div class="row"><div class="col-33"><img src="assets/images/nutrition/smile.png">' +
          '<img src="assets/images/nutrition/star.png"></div>' +
          '<div class="col-50">{{"SUGGEST_EATING" | translate}}</div></div>' +
          '<div class="row"><div class="col-33"><img src="assets/images/nutrition/smile.png"></div>' +
          '<div class="col-50">{{"COULD_EATING" | translate}}</div></div>' +
          '<div class="row"><div class="col-33"><img src="assets/images/nutrition/XMLID_97_.png"></div>' +
          '<div class="col-50">{{"LESS_EATING" | translate}}</div></div>' +
          '<div class="row"><div class="col-33"><img src="assets/images/nutrition/cry.png"></div>' +
          '<div class="col-50">{{"NOT_EATING" | translate}}</div></div></div>';
        nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', contentList, 'NUTRITION_POPUP_TIP_BTN');

        loadFoodLibrary();
      }

      vm.foodKind = foodCategory.grain;
      vm.plateButtonIsShown = true;
      vm.foodDetailBtn = true;
      vm.creatDishLoading = true;

      vm.selectNumber = 0;

      vm.activity = '';
      vm.pieData = [];
      vm.sortSelectFoods = [];
      vm.foodCategory = foodCategory;

      // vm.foodKindValue = foodKindValue.grain;
      // vm.subKind = ['谷类', '薯类', '杂豆', '粥类'];

      vm.subCagetoryComments = {};
      vm.subCagetoryComments[foodCategory.cereal] = $translate.instant('ATLEAST_TWO');
      vm.subCagetoryComments[foodCategory.potato] = $translate.instant('ATLEAST_ONE');
      vm.subCagetoryComments[foodCategory.porridge] = $translate.instant('ATLEAST_ONE');
      vm.subCagetoryComments[foodCategory.fish] = $translate.instant('ATLEAST_ONE');
      vm.subCagetoryComments[foodCategory.meat] = $translate.instant('ATLEAST_ONE');
      vm.subCagetoryComments[foodCategory.egg] = $translate.instant('ATLEAST_ONE');
      vm.subCagetoryComments[foodCategory.bean] = $translate.instant('ATLEAST_ONE');
      vm.subCagetoryComments[foodCategory.mast] = $translate.instant('ATLEAST_ONE');

      creatCartModal();

      creatEducationCardModal();
    }
    /**
    type - 0 : add food to cart
           1 : switch main category tab
           2 : final click and next
    */
    function checkAll() {
      var tipContent;
      if (!vm.sortSelectFoods) {
        tipContent = $translate.instant('CEREAL_CHOSE') + $translate.instant('CONTINUE_TO_CHOSE');
        nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
        return false;
      }
      if (checkGrain('', '2') &&
        checkProtein('', '2') &&
        checkVegetable('', '2') &&
        checkMilk('', '2') &&
        checkFruit('', '2') &&
        checkGrease('', '2')) {
        return true;
      }
      return false;
    }
    /**
    type - 0 : add food to cart
           1 : switch main category tab
           2 : final click and next
    */
    function checkGrain(subCategory, type) {
      var tipContent;
      var grainLength = $filter('filter')(vm.sortSelectFoods, {
        mainCategory: foodCategory.grain
      }).length;
      var cerealLength = $filter('filter')(vm.sortSelectFoods, {
        subCategory: foodCategory.cereal
      }).length;
      var potatoLength = $filter('filter')(vm.sortSelectFoods, {
        subCategory: foodCategory.potato
      }).length;
      var porridgeLength = $filter('filter')(vm.sortSelectFoods, {
        subCategory: foodCategory.porridge
      }).length;

      // check logic when add to cart
      if (type === '0') {
        if (grainLength === 4) {
          tipContent = $translate.instant('GRAIN_CHOSE_MORE') + $translate.instant('CAN_NOT_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }

        if (potatoLength === 1 && subCategory === foodCategory.potato) {
          tipContent = $translate.instant('POTATO_CHOSE') + $translate.instant('CAN_NOT_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }

        if (porridgeLength === 1 && subCategory === foodCategory.porridge) {
          tipContent = $translate.instant('PORRIDGE_CHOSE') + $translate.instant('CAN_NOT_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }
      }

      // check logic when switch tab and click "next"
      if (type === '1' || type === '2') {
        if (cerealLength < 2) {
          tipContent = $translate.instant('CEREAL_CHOSE') + $translate.instant('CONTINUE_TO_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }
      }
      return true;
    }
    /**
    type - 0 : add food to cart
           1 : switch main category tab
           2 : final click and next
    */
    function checkProtein(subCategory, type) {
      var tipContent;
      var proteinLength = $filter('filter')(vm.sortSelectFoods, {
        mainCategory: foodCategory.protein
      }).length;
      var fishLength = $filter('filter')(vm.sortSelectFoods, {
        subCategory: foodCategory.fish
      }).length;
      var meatLength = $filter('filter')(vm.sortSelectFoods, {
        subCategory: foodCategory.meat
      }).length;
      var eggLength = $filter('filter')(vm.sortSelectFoods, {
        subCategory: foodCategory.egg
      }).length;


      // check logic when add to cart
      if (type === '0') {
        if (fishLength === 1 && subCategory === foodCategory.fish) {
          tipContent = $translate.instant('FISH_CHOSE') + $translate.instant('CAN_NOT_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }
        if (meatLength === 1 && subCategory === foodCategory.meat) {
          tipContent = $translate.instant('MEAT_CHOSE') + $translate.instant('CAN_NOT_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }
        if (eggLength === 1 && subCategory === foodCategory.egg) {
          tipContent = $translate.instant('EGG_CHOSE') + $translate.instant('CAN_NOT_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }
      }

      // check logic when switch tab and click "next"
      if (type === '1' || type === '2') {
        if (proteinLength < 2) {
          tipContent = $translate.instant('PROTETIN_CHOSE_LESS') + $translate.instant('CONTINUE_TO_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }
      }
      return true;
    }

    /**
    type - 0 : add food to cart
           1 : switch main category tab
           2 : final click and next
    */
    function checkVegetable(subCategory, type) {
      var tipContent;
      var vegetableLength = $filter('filter')(vm.sortSelectFoods, {
        mainCategory: foodCategory.vegetable
      }).length;

      // check logic when add to cart
      if (type === '0') {
        if (vegetableLength === 5) {
          tipContent = $translate.instant('VEGETABLE_CHOSE_MORE') + $translate.instant('CAN_NOT_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }
      }
      // check logic when switch tab and click "next"
      if (type === '1' || type === '2') {
        if (vegetableLength < 3) {
          tipContent = $translate.instant('VEGETABLE_CHOSE_LESS') + $translate.instant('CONTINUE_TO_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }
      }
      return true;
    }
    /**
    type - 0 : add food to cart
           1 : switch main category tab
           2 : final click and next
    */
    function checkMilk(subCategory, type) {
      var tipContent;
      var milkLength = $filter('filter')(vm.sortSelectFoods, {
        mainCategory: foodCategory.milk
      }).length;

      // check logic when add to cart
      if (type === '0') {
        if (milkLength === 1) {
          tipContent = $translate.instant('MILK_CHOSE_MORE') + $translate.instant('CAN_NOT_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }

      }
      // check logic when switch tab and click "next"
      if (type === '1' || type === '2') {
        if (milkLength !== 1) {
          tipContent = $translate.instant('MILK_CHOSE_LESS') + $translate.instant('CONTINUE_TO_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }
      }
      return true;
    }

    /**
      type - 0 : add food to cart
             1 : switch main category tab
             2 : final click and next
      */
    function checkFruit(subCategory, type) {
      var tipContent;
      var fruitLength = $filter('filter')(vm.sortSelectFoods, {
        mainCategory: foodCategory.fruit
      }).length;

      // check logic when add to cart
      if (type === '0') {
        if (fruitLength === 2) {
          tipContent = $translate.instant('FRUIT_CHOSE_MORE') + $translate.instant('CAN_NOT_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }
      }
      // check logic when switch tab and click "next"
      if (type === '1' || type === '2') {
        if (fruitLength !== 2) {
          tipContent = $translate.instant('FRUIT_CHOSE_LESS') + $translate.instant('CONTINUE_TO_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }
      }
      return true;
    }
    /**
    type - 0 : add food to cart
           1 : switch main category tab
           2 : final click and next
    */
    function checkGrease(subCategory, type) {
      var tipContent;
      var greaseLength = $filter('filter')(vm.sortSelectFoods, {
        mainCategory: foodCategory.grease
      }).length;
      var beanLength = $filter('filter')(vm.sortSelectFoods, {
        subCategory: foodCategory.bean
      }).length;
      var mastLength = $filter('filter')(vm.sortSelectFoods, {
        subCategory: foodCategory.mast
      }).length;

      // check logic when add to cart
      if (type === '0') {
        if (beanLength === 1 && subCategory === foodCategory.bean) {
          tipContent = $translate.instant('BEAT_CHOSE') + $translate.instant('CAN_NOT_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }
        if (mastLength === 1 && subCategory === foodCategory.mast) {
          tipContent = $translate.instant('MAST_CHOSE') + $translate.instant('CAN_NOT_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }
      }
      // check logic when switch tab and click "next"
      if (type === '1' || type === '2') {
        if (greaseLength < 1) {
          tipContent = $translate.instant('GREASE_CHOSE_LESS') + $translate.instant('CONTINUE_TO_CHOSE');
          nutritionPopupService.showTip('NUTRITION_POPUP_TIP_TITLE', tipContent, 'NUTRITION_POPUP_TIP_BTN');
          return false;
        }
      }
      return true;
    }

    function getEducationCardContent() {
      $ionicLoading.show({
        template: '<div class="nutrition-loading-icon"><ion-spinner></ion-spinner></div>' + '加载中...',
      });
      vm.innerHtml = '';
      nutritionService.educationCard({
        foodName: vm.foodDetailName
      }, function(result) {
        $ionicLoading.hide();
        vm.innerHtml = result.data.data;
      }, function() {
        $ionicLoading.hide();
        $ionicLoading.show({
          template: '对不起，找不到详细信息',
          duration: 2500
        });
      });
    }

    function loadFoodImage() {
      // var foodsTemp = angular.copy(vm.foods);
      nutritionService.foodImage({}, function(result) {
        angular.forEach(allFoods, function(item) {
          var keepGoing = true;
          item.src = 'assets/images/medication/123.jpg';
          angular.forEach(result.data, function(it) {
            if (keepGoing && it.picInfo && it.foodOid === item.oid) {
              item.src = it.picInfo.url;
              keepGoing = false;
            }
          });
        });
        foodKindValue.grain = $filter('filter')(allFoods, {
          mainCategory: foodCategory.grain
        });
        vm.foodKindValue = foodKindValue.grain;
        foodKindValue.protein = $filter('filter')(allFoods, {
          mainCategory: foodCategory.protein
        });
        foodKindValue.vegetable = $filter('filter')(allFoods, {
          mainCategory: foodCategory.vegetable
        });
        foodKindValue.milk = $filter('filter')(allFoods, {
          mainCategory: foodCategory.milk
        });
        foodKindValue.fruit = $filter('filter')(allFoods, {
          mainCategory: foodCategory.fruit
        });
        foodKindValue.grease = $filter('filter')(allFoods, {
          mainCategory: foodCategory.grease
        });
      });
    }

    function loadFoodLibrary() {
      nutritionService.mobileInfo().$promise.then(function(res) {
        vm.mobileInfo = res;

        nutritionService.foodLibrary(res, function(result) {
          allFoods = result.data.foodList;
          vm.foodKindValue = $filter('filter')(allFoods, {
            mainCategory: foodCategory.grain
          });
          loadFoodImage();
        });
      });
    }

    function gotoNutritionPage(url) {
      switch (url) {
        case 'nutrition.dailyDish':
          if (checkAll()) {
            nutritionDataService.setSelectFood(vm.sortSelectFoods, vm.mobileInfo);
            $state.go(url);
          }
          break;
        default:
          $state.go(url);
          break;
      }
    }

    function setFoodKind(foodId) {
      var checkCart = false;
      if (vm.foodKind === foodCategory.grain && foodId !== '0') {
        checkCart = checkGrain('', '1');
      } else if (vm.foodKind === foodCategory.protein && foodId !== '5') {
        checkCart = checkProtein('', '1');
      } else if (vm.foodKind === foodCategory.vegetable && foodId !== '1') {
        checkCart = checkVegetable('', '1');
      } else if (vm.foodKind === foodCategory.milk && foodId !== '4') {
        checkCart = checkMilk('', '1');
      } else if (vm.foodKind === foodCategory.fruit && foodId !== '2') {
        checkCart = checkFruit('', '1');
      } else if (vm.foodKind === foodCategory.grease && foodId !== '3') {
        checkCart = checkGrease('', '1');
      }
      if (checkCart) {
        switch (foodId) {
          case '0':
            if (vm.foodKind !== foodCategory.grain) {
              vm.foodKindValue = foodKindValue.grain;
              $state.go('nutrition.list.grain');
              vm.foodKind = foodCategory.grain;
            }
            break;
          case '1':
            if (vm.foodKind !== foodCategory.vegetable) {
              vm.foodKindValue = foodKindValue.vegetable;
              vm.foodKind = foodCategory.vegetable;
              $state.go('nutrition.list.vegetable');
            }
            break;
          case '2':
            if (vm.foodKind !== foodCategory.fruit) {
              vm.foodKindValue = foodKindValue.fruit;
              $state.go('nutrition.list.fruit');
              vm.foodKind = foodCategory.fruit;
            }
            break;
          case '3':
            if (vm.foodKind !== foodCategory.grease) {
              vm.foodKindValue = foodKindValue.grease;
              $state.go('nutrition.list.bean');
              vm.foodKind = foodCategory.grease;
            }
            break;
          case '4':
            if (vm.foodKind !== foodCategory.milk) {
              vm.foodKindValue = foodKindValue.milk;
              $state.go('nutrition.list.milk');
              vm.foodKind = foodCategory.milk;
            }
            break;
          case '5':
            if (vm.foodKind !== foodCategory.protein) {
              vm.foodKindValue = foodKindValue.protein;
              $state.go('nutrition.list.protein');
              vm.foodKind = foodCategory.protein;
            }
            break;
          default:
            $state.go('nutrition.list');
            break;
        }
      }
    }

    function addSortField(data) {
      switch (data.mainCategory) {
        case foodCategory.grain:
          data.sortId = 1;
          break;
        case foodCategory.protein:
          data.sortId = 2;
          break;
        case foodCategory.vegetable:
          data.sortId = 3;
          break;
        case foodCategory.milk:
          data.sortId = 4;
          break;
        case foodCategory.fruit:
          data.sortId = 5;
          break;
        case foodCategory.grease:
          data.sortId = 6;
          break;
        default:
          data.sortId = 0;
          break;
      }
      return data;
    }

    var selectFoods = [];

    function addToCart(oid, flag) {
      var res = null;
      var bKeepGoing = true;
      angular.forEach(allFoods, function(data) {
        if (bKeepGoing && data.oid === oid) {
          bKeepGoing = false;
          var checkCart = false;
          if (data.mainCategory === foodCategory.grain) {
            checkCart = checkGrain(data.subCategory, '0');
          } else if (data.mainCategory === foodCategory.protein) {
            checkCart = checkProtein(data.subCategory, '0');
          } else if (data.mainCategory === foodCategory.vegetable) {
            checkCart = checkVegetable(data.subCategory, '0');
          } else if (data.mainCategory === foodCategory.milk) {
            checkCart = checkMilk(data.subCategory, '0');
          } else if (data.mainCategory === foodCategory.fruit) {
            checkCart = checkFruit(data.subCategory, '0');
          } else if (data.mainCategory === foodCategory.grease) {
            checkCart = checkGrease(data.subCategory, '0');
          }
          if (checkCart) {
            vm.selectNumber = parseInt(vm.selectNumber) + 1;
            res = addSortField(data);
            selectFoods.push(res);
            var BtnName = 'addButton' + oid;
            vm[BtnName] = true;
            if (flag) {
              nutritionPopupService.showToast($translate.instant('SUCCESS_ADD_CART'));
              vm.foodDetailBtn = false;
            }
            vm.sortSelectFoods = $filter('orderBy')(selectFoods, 'sortId');

          }
        }
      });
    }

    function deleteFromCart(oid, flag) {
      vm.selectNumber = parseInt(vm.selectNumber) - 1;
      var BtnName = 'addButton' + oid;
      vm[BtnName] = false;

      angular.forEach(selectFoods, function(data, index) {
        if (data.oid === oid) {
          selectFoods.splice(index, 1);
          vm.sortSelectFoods = $filter('orderBy')(selectFoods, 'sortId');
        }
      });
      if (flag) {
        nutritionPopupService.showToast($translate.instant('SUCCESS_REMOVE_CART'));
        vm.foodDetailBtn = true;
      }
      if (vm.sortSelectFoods.length === 0) {
        vm.myCartModal.hide();
      }
    }

    function creatCartModal() {
      $ionicModal.fromTemplateUrl('nutrition/foodCoach/modal/cart-list-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        vm.myCartModal = modal;
      });
    }

    function creatEducationCardModal() {
      $ionicModal.fromTemplateUrl('nutrition/foodCoach/modal/nutrition-educationCard-modal.html', {
        scope: $scope
      }).then(function(modal) {
        vm.educationCardModal = modal;
      });
    }

    function openEducationCardModal(param) {
      vm.foodDetailName = param.name;
      vm.foodDetailOid = param.oid;
      vm.educationCardBtn = false;
      var flag = true;
      angular.forEach(vm.sortSelectFoods, function(data) {
        if (data.oid === param.oid) {
          flag = false;
          vm.foodDetailBtn = false;
        }
      });
      if (flag) {
        vm.foodDetailBtn = true;
      }
      getEducationCardContent();
      if (param.judge === -2) {
        vm.educationCardBtn = true;
      }
      vm.educationCardModal.show();
    }

    function closeEducationCardModal() {
      vm.educationCardModal.hide();
    }

    function openCartModal() {
      var scrollToHash = function() {
        var showType = '';
        switch (vm.foodKind) {
          case foodCategory.grain:
            showType = 'cartFood1';
            break;
          case foodCategory.protein:
            showType = 'cartFood2';
            break;
          case foodCategory.vegetable:
            showType = 'cartFood3';
            break;
          case foodCategory.milk:
            showType = 'cartFood4';
            break;
          case foodCategory.fruit:
            showType = 'cartFood5';
            break;
          case foodCategory.grease:
            showType = 'cartFood6';
            break;
          default:
            showType = '';
            break;
        }
        $location.hash(showType);
        $anchorScroll();
      };
      vm.plateButtonIsShown = false;
      vm.myCartModal.show();
      scrollToHash();
    }

    function closeCartModal() {
      vm.myCartModal.hide();
      setTimeout(function() {
        vm.plateButtonIsShown = true;
      }, 30);
    }
    $scope.$on('modal.hidden', function() {
      setTimeout(function() {
        vm.plateButtonIsShown = true;
      }, 30);
    });

  }
})();
