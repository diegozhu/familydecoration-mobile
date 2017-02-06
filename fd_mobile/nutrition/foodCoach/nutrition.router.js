'use strict';

(function() {
  angular
    .module('fdmobile.nutrition')
    .config(nutritionRoute);

  nutritionRoute.$inject = ['$stateProvider'];

  function nutritionRoute($stateProvider) {
    $stateProvider
      .state('home.carePlan.nutrition', {
        url: '/nutrition',
        cache: false,
        views: {
          'tab-nutrition': {
            templateUrl: 'nutrition/nutrition-home.html'
          }
        }
      })
      .state('nutrition', {
        abstract: true,
        url: '/nutrition',
        cache: false,
        templateUrl: 'nutrition/foodCoach/nutrition.html'
      })
      .state('nutrition.config', {
        abstract: true,
        url: '/config',
        cache: false,
        views: {
          'nutrition-data': {
            templateUrl: 'nutrition/foodCoach/nutrition.config.html',
            controller: 'NutritionBaseInfoController as vm'
          }
        }
      })
      .state('nutrition.config.bmi', {
        url: '/bmi',
        cache: false,
        views: {
          'nutrition-config': {
            templateUrl: 'nutrition/foodCoach/nutrition-bmi.html'
          }
        }
      })
      .state('nutrition.config.activity', {
        url: '/activity',
        cache: false,
        views: {
          'nutrition-config': {
            templateUrl: 'nutrition/foodCoach/nutrition-activity.html'
          }
        }
      })
      .state('nutrition.list', {
        abstract: true,
        url: '/list',
        cache: false,
        views: {
          'nutrition-data': {
            templateUrl: 'nutrition/foodCoach/tabs.html',
            controller: 'NutritionfoodCoachController as vm'
          }
        }
      })
      .state('nutrition.list.grain', {
        url: '/grain',
        cache: false,
        views: {
          'nutrition-grain': {
            templateUrl: 'nutrition/foodCoach/nutrition-list.html'
          }
        }
      })
      .state('nutrition.list.vegetable', {
        url: '/vegetable',
        cache: false,
        views: {
          'nutrition-vegetable': {
            templateUrl: 'nutrition/foodCoach/nutrition-list.html'
          }
        }
      })
      .state('nutrition.list.fruit', {
        url: '/fruit',
        cache: false,
        views: {
          'nutrition-fruit': {
            templateUrl: 'nutrition/foodCoach/nutrition-list.html'
          }
        }
      })
      .state('nutrition.list.bean', {
        url: '/bean',
        cache: false,
        views: {
          'nutrition-bean': {
            templateUrl: 'nutrition/foodCoach/nutrition-list.html'
          }
        }
      })
      .state('nutrition.list.milk', {
        url: '/milk',
        cache: false,
        views: {
          'nutrition-milk': {
            templateUrl: 'nutrition/foodCoach/nutrition-list.html'
          }
        }
      })
      .state('nutrition.list.protein', {
        url: '/protein',
        cache: false,
        views: {
          'nutrition-protein': {
            templateUrl: 'nutrition/foodCoach/nutrition-list.html'
          }
        }
      })
      .state('nutrition.dailyDish', {
        url: '/dish',
        cache: false,
        views: {
          'nutrition-data': {
            templateUrl: 'nutrition/foodCoach/nutrition-dailyDish.html',
            controller: 'NutritionDailyDishController as vm'
          }
        }
      });
  }
})();
