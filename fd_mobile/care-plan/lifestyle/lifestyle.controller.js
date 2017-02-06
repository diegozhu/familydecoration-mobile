(function() {
  'use strict';

  angular
    .module('fdmobile.lifestyle')
    .controller('LifeStyleController', LifeStyleController);

  function LifeStyleController($scope, $ionicModal, educationCoachingService, $sce) {
    var vm = this;

    angular.extend(vm, {
      openModal: openModal,
      closeModal: closeModal
    });

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    init();

    function init() {
      vm.coachData = [];

      onLoad();
    }

    function onLoad() {
      educationCoachingService.getEducationResource().$promise.then(function(response) {
        vm.coachData = response.data;
      });
      //TO REMOVE
      // vm.coachData = [
      //   {
      //     'endDay': 13,
      //     'packageId': 1,
      //     'planId': 3,
      //     'selfUrl': 'http://161.92.142.80:5000/cards?name=单硝酸异山梨酯片',
      //     'startDay': 7,
      //     'title': '单硝酸异山梨酯片'
      //   },
      //   {
      //     'endDay': 13,
      //     'packageId': 1,
      //     'planId': 3,
      //     'selfUrl': 'http://161.92.142.80:5000/cards?name=关于冠心病人的康复指南',
      //     'startDay': 7,
      //     'title': '关于冠心病人的康复指南'
      //   }
      // ];
      // educationCoachingService.getEducationResource().$promise.then(function(response) {
        // vm.coachData = response.data;
      // });

    }

    function openModal(card) {
      var modalTemplate = 'care-plan/lifestyle/modal/card-detail.modal.html';
      $scope.card = card;
      $ionicModal.fromTemplateUrl(modalTemplate, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        vm.modal = modal;
        vm.modal.show();
      });
    }

    function closeModal() {
      vm.modal.hide();
    }
    // var lifeStyleDataModel = {
    //   "success": true,
    //     "status": 200,
    //     "data": [
    //         {
    //             "title": "放了支架不代表“万事大吉”",
    //             "planId": "1",
    //             "packageId": "1",
    //             "startDay": 0,
    //             "endDay": 6,
    //             "selfUrl": "http://161.92.142.80:5000/cards?name=放了支架不代表“万事大吉”"
    //         },
    //         {
    //             "title": "单硝酸异山梨酯片",
    //             "planId": "2",
    //             "packageId": "1",
    //             "startDay": 0,
    //             "endDay": 6,
    //             "selfUrl": "http://161.92.142.80:5000/cards?name=单硝酸异山梨酯片"
    //         }
    //    ]
    // };
  }
})();
