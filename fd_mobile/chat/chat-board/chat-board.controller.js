(function() {
  'use strict';

  angular
    .module('fdmobile.chatBoard')
    .controller('chatBoardController', chatBoardController);

  function chatBoardController($scope, $state, $log, $timeout, chatClientService, Analytics) {
    var vm = this;
    vm.owner = 'fd'; // hard-code the owner for test
    vm.chatMembers = [];
    vm.conversationId = $state.params.conversationId;
    vm.membersPlainText = $state.params.membersPlainText;
    vm.unreadMessagesCount = $state.params.unreadMessagesCount;
    vm.apiNotReady = true; // if the leancloud API is ready to send message
    vm.txtMsg = '';
    vm.errorMsg = '';
    vm.msgList = [];
    vm.historyMsgList = [];
    vm.hasHistoryMsg = false;
    vm.hisMessageLimit = 20;
    vm.sendTextMsg = sendTextMsg;

    // ========================================================

    $log.debug('get conversationId:', vm.conversationId);
    $log.debug('get membersPlainText:', vm.membersPlainText);
    $log.debug('get unreadMessagesCount:', vm.unreadMessagesCount);

    Analytics.trackEvent('chat', 'open-conversation',
      'id:' + vm.conversationId + '; owner: ' + vm.owner + '; members: ' + vm.membersPlainText);

    if (vm.unreadMessagesCount > vm.hisMessageLimit) {
      vm.hisMessageLimit = vm.unreadMessagesCount;
    }

    var conversationAPI;
    var AV = window.AV;

    init();
    heartbeat();

    function heartbeat() {
      $timeout(heartbeat, 100);
      if (!chatClientService.getClientStatus()) {
        vm.apiNotReady = true;
      } else {
        vm.apiNotReady = false; // ready for user to send new message
      }
    }

    function init() {
      if (!chatClientService.getClientStatus()) {
        $timeout(init, 100);
        return;
      }
      var imClient = chatClientService.getImClient();
      var conversationPromise;
      if (vm.conversationId && vm.conversationId !== '') {
        // get a exist conversation
        conversationPromise = imClient.getConversation(vm.conversationId);
      } else if (vm.chatMembers && vm.chatMembers.length > 0) {
        // create a new conversation
        conversationPromise = imClient.createConversation({
          members: vm.chatMembers,
          name: vm.chatMembers.join(' & '),
          transient: false,
          unique: true
        });
      } else {
        $state.go('home.chat');
        return;
      }
      conversationPromise.then(function(conv) {
        if (!conv) {
          $state.go('home.chat');
          return;
        }
        conversationAPI = conv;
        // 注册接受消息事件
        imClient.on('message', receiveMsg);
        // 标记已读
        conversationAPI.markAsRead().then(function(conversation) {
          $log.log('对话已标记为已读:', conversation.id);
        }).catch();
        // 获取未读消息或者最近的消息
        conversationAPI.queryMessages({
          limit: vm.hisMessageLimit, // limit 取值范围 1~1000，默认 20
        }).then(function(messages) {
          $log.log('获取最近的', vm.hisMessageLimit, '条消息');
          $scope.$apply(function() {
            for (var i = 0; i < messages.length; i++) {
              vm.historyMsgList.push(composeMsg(messages[i]));
              vm.hasHistoryMsg = true;
            }
          });
        }).catch(function(err) {
          vm.errorMsg = '查询最近的消息记录失败！(' + err.message + ')';
          $log.log(vm.errorMsg);
        });
      });
    }

    function sendTextMsg() {
      if (vm.txtMsg === '') {
        return;
      }
      conversationAPI.send(new AV.TextMessage(vm.txtMsg)).then(function(message) {
        $log.log(vm.owner + ' send Message: ' + vm.txtMsg);
        vm.txtMsg = '';
        $scope.$apply(function() {
          vm.msgList.push(composeMsg(message));
        });
      }).catch(function(err) {
        vm.errorMsg = '发送消息失败！(' + err.message + ')';
        $log.log(vm.errorMsg);
      });
    }

    function receiveMsg(message, conversation) {
      $scope.$apply(function() {
        if (conversation.id === vm.conversationId) {
          vm.msgList.push(composeMsg(message));
          conversation.markAsRead().then(function(c) {
            $log.log('对话已标记为已读:', c.id);
          }).catch();
        }
      });
    }

    function composeMsg(message) {
      var msg = {
        hasImage: false
      };
      msg.id = message.id;
      msg.from = message.from;
      msg.isReceiver = !(msg.from === vm.owner);
      msg.text = '[' + msg.from + ']: ' + message.text;

      var file;
      switch (message.type) {
        case AV.TextMessage.TYPE:
          //$log.log('收到文本消息， text: ' + message.getText() + ', msgId: ' + message.id);
          break;
        case AV.FileMessage.TYPE:
          file = message.getFile(); // file 是 AV.File 实例
          //$log.log('收到文件消息，url: ' + file.url() + ', size: ' + file.metaData('size'));
          break;
        case AV.ImageMessage.TYPE:
          file = message.getFile();
          //$log.log('收到图片消息，url: ' + file.url() + ', width: ' + file.metaData('width'));
          msg.messageImageUrl = file.url();
          msg.hasImage = true;
          break;
        case AV.AudioMessage.TYPE:
          file = message.getFile();
          //$log.log('收到音频消息，url: ' + file.url() + ', width: ' + file.metaData('duration'));
          break;
        case AV.VideoMessage.TYPE:
          file = message.getFile();
          //$log.log('收到视频消息，url: ' + file.url() + ', width: ' + file.metaData('duration'));
          break;
        case AV.LocationMessage.TYPE:
          //var location = message.getLocation();
          //$log.log('收到位置消息，latitude: ' + location.latitude + ', longitude: ' + location.longitude);
          break;
        default:
          $log.log('收到未知类型消息');
      }
      return msg;
    }
  }
})();
