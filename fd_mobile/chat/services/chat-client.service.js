(function() {
  'use strict';

  angular
    .module('fdmobile.chat')
    .factory('chatClientService', chatClientService);

  function chatClientService($log, $timeout, chatUtilityService) {
    var AV = window.AV;
    var clientId = 'fd'; // hard-code the owner for test
    var imClient;
    var clientIsReady = false;
    var errorMsg = '';
    var lastRefreshAt = new Date();
    var hisConversationLimit = 20;
    var conversationList = [];
    // start and monitor
    heartbeat();
    refreshConverstaionList();
    // define service members
    var service = {
      getClientId: getClientId,
      getImClient: getImClient,
      getClientStatus: getClientStatus,
      getConversationList: getConversationList,
      getErrorMsg: getErrorMsg,
      getLastRefreshTime: getLastRefreshTime
    };
    return service;

    // =========================================

    function getClientStatus() {
      return clientIsReady;
    }

    function getImClient() {
      if (clientIsReady) {
        return imClient;
      }
      return null;
    }

    function getConversationList() {
      return conversationList;
    }

    function getClientId() {
      return clientId;
    }

    function getErrorMsg() {
      return errorMsg;
    }

    function getLastRefreshTime() {
      return lastRefreshAt;
    }

    function heartbeat() {
      $timeout(heartbeat, 3000);
      $log.debug('client heartbeat...');
      if (!clientIsReady) {
        initClient();
      }
    }

    function initClient() {
      $log.debug('初始化LeanCloud API...');
      var Realtime = AV.Realtime;
      var realtime = new Realtime({
        appId: 'a7722WJjRqpbSOQprmljvReW-gzGzoHsz',
        region: 'cn', //美国节点为 "us"
      });
      // 用自己的名字作为 clientId，获取 IMClient 对象实例
      realtime.createIMClient(clientId).then(function(clientObj) {
        $log.debug('[', clientId, ']登录成功！');
        errorMsg = '';
        lastRefreshAt = new Date();
        imClient = clientObj;
        clientIsReady = true;
        // add event
        realtime.on('disconnect', function() {
          errorMsg = '网络连接已断开!';
          clientIsReady = false;
          lastRefreshAt = new Date();
          $log.debug(errorMsg);
        });
        realtime.on('schedule', function(attempt, delay) {
          $log.debug(delay + 'ms 后进行第' + (attempt + 1) + '次重连');
        });
        realtime.on('retry', function(attempt) {
          $log.debug('正在进行第' + attempt + '次重连');
        });
        realtime.on('reconnect', function() {
          $log.debug('网络连接已恢复');
        });
      }).catch(function(err) {
        errorMsg = '初始化失败，请检查网络！(' + err.message + ')';
        clientIsReady = false;
        lastRefreshAt = new Date();
        $log.debug(errorMsg);
      });
    }

    function refreshConverstaionList() {
      if (!clientIsReady) {
        lastRefreshAt = new Date();
        conversationList = [];
        $timeout(refreshConverstaionList, 100);
        return;
      }
      $timeout(refreshConverstaionList, 3000);
      $log.debug('查询最近的会话列表...');
      imClient.getQuery()
        .limit(hisConversationLimit)
        .containsMembers([clientId])
        .find()
        .then(function(conversations) {
          lastRefreshAt = new Date();
          conversationList = [];
          for (var i = 0; i < conversations.length; i++) {
            conversationList.push(chatUtilityService.composeConversation(conversations[i], clientId));
          }
        }).catch(function(err) {
          lastRefreshAt = new Date();
          conversationList = [];
          errorMsg = '查询最近的会话列表失败！(' + err.message + ')';
          $log.debug(errorMsg);
        });
    }
  }
})();
