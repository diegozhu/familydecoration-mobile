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
    $ionicLoading,
    $q,
    urlBuilder
  ) {
    var vm = this;

    vm.imgurl = '';
    vm.addProgressVm = {
      title: ''
    };

    $ionicModal.fromTemplateUrl('project/progress/progressdetail.modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
    });

    $ionicModal.fromTemplateUrl('project/progress/img.modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.imgModal = modal;
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

    var dataWeave = function(data) {
      angular.forEach(data, function(item) {
        if (item.supervisorComment) {
          angular.forEach(item.supervisorComment, function(obj) {
            if (obj.pics) {
              obj.pics = obj.pics.split('>>><<<');
            }
          });
        }
      });
      return data;
    };

    if (planItems.data) {
      vm.planItems = dataWeave(planItems.data);
    }
    else {
      planItems.then(function(res) {
        vm.planItems = dataWeave(res.data);
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
      vm.pics = [];
    }

    function _clearCache() {
      navigator.camera && navigator.camera.cleanup();
    }

    vm.pics = [];

    vm.getPicture = function() {
      function onSuccess(fileURI) {
        var
          img = document.createElement('img'),
          ct = document.querySelector('.camera_category');
        vm.pics.push(fileURI);
        img.setAttribute('src', fileURI + '?' + Math.random());
        img.setAttribute('width', 134);
        img.setAttribute('height', 75);
        img.setAttribute('class', 'photo');
        ct.appendChild(img);
      }

      function onFail(msg) {
        if (msg === 'no image selected') {
          return ;
        }
        alert('failed message: ' + msg);
      }

      var config = {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
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
                sourceType: 1,
                correctOrientation: true,
                encodingType: navigator.camera.EncodingType.PNG
              }));
            }
          },
          {
            text: '相册',
            type: 'button-stable',
            onTap: function() {
              navigator.camera.getPicture(onSuccess, onFail, angular.extend(config, {
                sourceType: 0,
                correctOrientation: true,
                encodingType: navigator.camera.EncodingType.PNG
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
        vm.planItems = dataWeave(res.data);
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
      var
        content = vm.addProgressVm.content,
        defs = [],
        promise;
      function _upload(pics) {
        $ionicLoading.show({
          template: '正在提交...',
          delay: 0
        });
        var action = vm.addProgressVm.type === 'comment' ? 'createNewSupervisorComment' : 'createNewProgress';
        var params = {
          '@itemId': vm.planItem.id,
          '@content': content
        };
        if (vm.addProgressVm.type === 'comment' && pics !== false) {
          angular.extend(params, {
            '@pics': pics
          });
        }
        projectService[action](params).finally(function() {
          $ionicLoading.show({
            template: '提交成功',
            delay: 0
          });
          vm.doRefresh();
          $timeout(function() {
            vm.addmodal.hide();
            $ionicLoading.hide();
          }, 500);
        });
        vm.addProgressVm.content = '';
        vm.addProgressVm.type === 'comment' && _cleanCachedPics();
      }
      if (vm.addProgressVm.type === 'comment') {
        angular.forEach(vm.pics, function(fileURI) {
          var
            defer = $q.defer(),
            win = function(r) {
              _clearCache();
              if (r.response.trim() === '0') {
                defer.resolve(0); // this one failed.
              }
              else {
                defer.resolve(r.response); // this one passed.
              }
            },
            fail = function(err) {
              _clearCache();
              $fdToast.show({
                text: 'upload error source ' + err.source + '; upload error target ' + err.target
              });
              defer.resolve(0);
            };
          /*global FileUploadOptions */
          var
            options = new FileUploadOptions();
          options.fileKey = 'photo';
          options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
          options.mimeType = 'image/png';
          options.params = {}; // if we need to send parameters to the server request
          /*global FileTransfer */
          var ft = new FileTransfer();
          ft.upload(fileURI, encodeURI(urlBuilder.build('libs/upload_progress_pic.php')), win, fail, options);
          defs.push(defer.promise);
        });
        promise = $q.all(defs);
        promise.then(function(result) {
          try {
            var res = JSON.parse(result);
            if (res.status === 'failing') {
              $log.log(res);
              window.res = res;
              return false;
            }

          } catch (e) {
            $log.log(e);
          }
          var
            pics = [],
            failed = [];
          angular.forEach(result, function(res) {
            res = JSON.parse(res);
            var details = res.details;
            if (details[0] && details[0].success) {
              pics.push(details[0].file);
            }
            else {
              failed.push(details[0].msg);
            }
          });
          if (pics.length > 0) {
            pics = pics.join('>>><<<');
          }
          else {
            pics = false;
          }
          _upload(pics);
        })
        .catch(function(error) {
          $log.log(error);
          _cleanCachedPics();
        });
      }
      else if (vm.addProgressVm.type === 'progress') {
        _upload(false);
      }
    };

    vm.openAddSupervisorCommentModal = function() {
      vm.addmodal.show();
      vm.addProgressVm.type = 'comment';
      vm.addProgressVm.title = '新增监理意见';
      vm.addProgressVm.placeholder = '监理内容';
      vm.addProgressVm.content = '';
      _cleanCachedPics();
      _clearCache();
    };

    vm.openAddPracticalProgressModal = function() {
      vm.addmodal.show();
      vm.addProgressVm.type = 'progress';
      vm.addProgressVm.title = '新增工程进度';
      vm.addProgressVm.content = '';
      vm.addProgressVm.placeholder = '工程进度';
      _cleanCachedPics();
      _clearCache();
    };

    vm.parseImgUrl = function(picUrl) {
      return urlBuilder.build(picUrl);
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

    vm.showBigPic = function(picUrl) {
      vm.imgurl = picUrl;
      vm.imgModal.show();
    };
  });

})();
