(function() {
  'use strict';

  angular
    .module('fdmobile.symptomStatement')
    .controller('SymptomStatementListController', SymptomStatementListController);

  function SymptomStatementListController($scope, $state, symptomStatementService, symptomService, symptomCarePlanService, $ionicModal, CONSTANT, $fdPopup, $translate) {
    var vm = this;

    vm.symptomStatementsList = [];
    vm.currentPage = {
      number: 0
    };

    angular.extend(vm, {
      loadMoreSymptomStatements: loadMoreSymptomStatements,
      isCompletedLoaded: isCompletedLoaded,
      newSymptomStatement: newSymptomStatement,
      deleteSymptomStatement: deleteSymptomStatement,
      showPopup: showPopup
    });

    symptomService.setViewAndModel(vm);

    function loadMoreSymptomStatements() {
      symptomStatementService.listSymptomStatements({
        page: vm.currentPage.number
      }, function(result) {
        vm.symptomStatementsList = vm.symptomStatementsList.concat(result.data.content);
        vm.symptomStatementsList = updatePicture(vm.symptomStatementsList, CONSTANT.REPORT_IMAGE_THUMBNAIL_WEIGHT,
          CONSTANT.REPORT_IMAGE_THUMBNAIL_HEIGHT, CONSTANT.REPORT_IMAGE_THUMBNAIL_RESOLUTION);

        // Assign symptom name to every list.
        // symptomCarePlanService.getSymptomCarePlan().$promise.then(function(response) {
        //   var symptomCarePlan = response.data,
        //     //Only one activity
        //     symptomDicts = symptomCarePlan.activities[0].symptomOrder.symptoms,
        //     symptomTags = [];

        //   angular.forEach(symptomDicts, function(symptomDict) {
        //     var symptomTag = {};
        //     symptomTag.symptomCode = symptomDict.code;
        //     symptomTag.name = symptomDict.label;
        //     symptomTags.push(symptomTag);
        //   });

        //   angular.forEach(vm.symptomStatementsList, function(symptomStatement) {
        //     var symptomCode;
        //     if (symptomStatement.symptom) {
        //       symptomCode = symptomStatement.symptom.code;
        //     }

        //     symptomStatement.dateAsserted = dateFormat(symptomStatement.dateAsserted);

        //     if (symptomCode && symptomTags) {
        //       var arr = symptomTags.filter(function(symptomTag) {
        //         return symptomCode === symptomTag.symptomCode;
        //       });
        //       if (arr && arr.length > 0) {
        //         symptomStatement.name = arr[0].name;
        //       }
        //     }
        //   });
        // });
        // // Assign symptom name to every list.

        vm.currentPage = buildPage(result.data);
        if (!vm.currentPage.last) {
          vm.currentPage.number++;
        }

        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }

    function updatePicture(symptomStatementsList, width, height, resolution) {
      angular.forEach(symptomStatementsList, function(symptomStatement) {
        var pictures = symptomStatement.pictureName;
        if (!angular.isUndefined(pictures) && pictures !== null) {
          var pictureArray = pictures.split(',');
          var imgs = [];
          if (pictureArray && pictureArray.length > 0) {
            angular.forEach(pictureArray, function(pic) {
              var picture = pic.substring(0, pic.indexOf('.jpeg')) + '_' + width + 'x' + height + resolution + '.jpeg';
              imgs.push(picture);
            });
          }
        }
        symptomStatement.imglist = imgs;
      });
      return symptomStatementsList;
    }

    function showBigImage(imgUrl, width, height, resolution) {
      var pictureUrl = imgUrl.substring(0, imgUrl.indexOf('_'));
      var picture = pictureUrl + '_' + width + 'x' + height + resolution + '.jpeg';
      $scope.Url = picture;
    }

    $scope.showImages = function(imgUrl, width, height, resolution) {
      showBigImage(imgUrl, width, height, resolution);
      $scope.showModal('my-data/symptom-statement/modal/image-popover.modal.html');
    };
    $scope.showModal = function(templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };
    // Close the modal
    $scope.closeModalPopover = function() {
      $scope.modal.hide();
      $scope.modal.remove();
    };

    /*
     * Check the results satisfied with condition whether is completed loaded.
     */
    function isCompletedLoaded() {
      if (vm.currentPage.last) {
        return true;
      } else {
        return false;
      }
    }

    /*
     * Covert the number to the date object, for example:
     * "dateAsserted": 1470575807000 --> new Date(1470575807000)   date formate task
     */
    // function dateFormat(value) {
    //   var date = new Date(parseInt(value));

    //   return date.toLocaleDateString('en-GB', {
    //     day: 'numeric',
    //     month: 'short',
    //     year: 'numeric',
    //     hour: '2-digit',
    //     minute: '2-digit'
    //   }).split(',').join(' ');
    // }

    /*
     * This method is to build Page according to the response.   // move
     */
    function buildPage(data) {
      var page = {
        first: data.first,
        last: data.last,

        totalElements: data.totalElements,
        totalPages: data.totalPages,
        number: data.number,
        size: data.size,
        sort: data.sort,
        numberOfElements: data.numberOfElements
      };

      if (page.number) {
        if (!page.last) {
          page.nextNumber = parseInt(page.number) + 1;
        }
        if (!page.first) {
          page.preNumber = parseInt(page.number) - 1;
        }
      }

      return page;
    }

    function newSymptomStatement() {
      symptomService.openModal($scope);
    }

    function showPopup(symptomStatementOid) {
      $fdPopup.show({
        iconClass: 'ion-star',
        //title: $translate.instant('SYMPTOM_STATEMENT_DELETE_TITLE'),
        subTitle: $translate.instant('SYMPTOM_STATEMENT_DELETE_SUB_TITLE'),
        template: $translate.instant('SYMPTOM_STATEMENT_DELETE_CONFIRM'),
        buttons: [{
          text: $translate.instant('SYMPTOM_STATEMENT_DELETE_CONFIRMED'),
          type: 'button-positive',
          onTap: function() {
            deleteSymptomStatement(symptomStatementOid);
          }
        }, {
          text: $translate.instant('SYMPTOM_STATEMENT_DELETE_CANCEL'),
          type: 'button-stable',
          onTap: function() {
            //e.preventDefault();
          }
        }]
      });
    }

    function deleteSymptomStatement(symptomStatementOid) {
      symptomStatementService.deleteSymptomStatement({
        symptomStatementOid: symptomStatementOid
      }, function() {
        vm.symptomStatementsList = [];
        loadMoreSymptomStatements();
      });
    }
  }
})();
