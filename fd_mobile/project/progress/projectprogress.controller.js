(function() {
  'use strict';

  angular.module('fdmobile.project.progress').controller('ProjectProgressController', function(
    planItems,
    projectPeriod,
    projectService,
    $log,
    $fdPopup,
    $scope,
    planService,
    planEditService,
    $filter,
    $fdToast,
    $stateParams,
    ionicDatePicker,
    $ionicModal,
    $timeout,
    $ionicLoading
  ) {
    var vm = this;

    vm.addProgressVm = {
      title: ''
    };

    $ionicModal.fromTemplateUrl('project/progress/progressdetail.modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
    });

    $ionicModal.fromTemplateUrl('project/progress/addprogress.modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.addmodal = modal;
    });

    angular.extend($scope, {
      projectName: $stateParams.projectName
    });

    if (planItems.data) {
      vm.planItems = planItems.data;
    }
    else {
      planItems.then(function(res) {
        vm.planItems = res.data;
      }, function(res) {
        $log.log(res.errMsg);
      });
    }

    // this is used to clean template cached pictures when next time popping up window.
    function _cleanCachedPics() {
      var
        ct = document.querySelector('.camera_category'),
        pics = document.querySelectorAll('.camera_category>.photo');
      if (ct) {
        angular.forEach(pics, function(pic) {
          ct.removeChild(pic);
        });
      }
    }

    vm.getPicture = function() {
      function onSuccess(imageData) {
        var
          img = document.createElement('img'),
          ct = document.querySelector('.camera_category');
        img.setAttribute('src', 'data:image/jpeg;base64,' + imageData);
        img.setAttribute('width', 134);
        img.setAttribute('height', 75);
        img.setAttribute('class', 'photo');
        img.setAttribute('ng-click', function() {
          vm.showImages();
        });
        ct.appendChild(img);
      }

      function onFail(msg) {
        alert('failed message: ' + msg);
      }

      var config = {
        quality: 50,
        destinationType: 0,
        saveToPhotoAlbum: true
        // sourceType: 1 // 0: library; 1: camera
      };

      $fdPopup.show({
        iconClass: 'ion-star',
        title: '询问',
        template: '请选择图片来源',
        buttons: [
          {
            text: '拍摄',
            type: 'button-positive',
            onTap: function() {
              navigator.camera.getPicture(onSuccess, onFail, angular.extend(config, {
                sourceType: 1
              }));
            }
          },
          {
            text: '相册',
            type: 'button-stable',
            onTap: function() {
              navigator.camera.getPicture(onSuccess, onFail, angular.extend(config, {
                sourceType: 0
              }));
            }
          }
        ]
      });
    };

    vm.doRefresh = function() {
      return projectService.getProjectProgress({
        projectId: $stateParams.projectId
      }).then(function(res) {
        vm.planItems = res.data;
        vm.planItem && vm.planItems.every(function(planItem) {
          if (planItem.id !== vm.planItem.id) {
            return true;
          }
          planItem.practicalProgress.every(function(ele) {
            ele.content = ele.content.replace(/\n/gi, '<br>');
            return true;
          });
          planItem.supervisorComment.every(function(ele) {
            ele.content = ele.content.replace(/\n/gi, '<br>');
            return true;
          });
          vm.planItem = planItem;
          return false;
        });
      });
    };

    vm.addprogress = function() {
      var temp = vm.addProgressVm.content;
      $ionicLoading.show({
        template: '正在提交...'
      });
      var action = vm.addProgressVm.type === 'comment' ? 'createNewSupervisorComment' : 'createNewProgress';
      projectService[action]({
        '@itemId': vm.planItem.id,
        '@content': temp
      }).finally(function() {
        $ionicLoading.show({
          template: '提交成功'
        });
        vm.doRefresh();
        $timeout(function() {
          vm.addmodal.hide();
          $ionicLoading.hide();
        }, 500);
      });
      vm.addProgressVm.content = '';
    };

    vm.openAddSupervisorCommentModal = function() {
      vm.addmodal.show();
      vm.addProgressVm.type = 'comment';
      vm.addProgressVm.title = '新增监理意见';
      vm.addProgressVm.placeholder = '监理内容';
      vm.addProgressVm.content = '';
      _cleanCachedPics();
    };

    vm.openAddPracticalProgressModal = function() {
      vm.addmodal.show();
      vm.addProgressVm.type = 'progress';
      vm.addProgressVm.title = '新增工程进度';
      vm.addProgressVm.content = '';
      vm.addProgressVm.placeholder = '工程进度';
      _cleanCachedPics();
    };

    vm.showProgressDetail = function(planItem) {
      vm.planItem = planItem;
      planItem.practicalProgress.every(function(ele) {
        ele.content = ele.content.replace(/\n/gi, '<br>');
        return true;
      });
      planItem.supervisorComment.every(function(ele) {
        ele.content = ele.content.replace(/\n/gi, '<br>');
        return true;
      });
      vm.modal.show();
    };
  });

})();
