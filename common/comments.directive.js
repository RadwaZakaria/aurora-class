'use strict';

angular.module('aurora.common')
    .directive('auroraComments', ['$api', '$rootScope', '$loading', '$compile', function ($api, $rootScope, $loading, $compile) {
      return {
        restrict: 'E',
        scope: {
          objectType: '=',
          objectId: '@',
          canComment: '='
        },
        controller: function ($scope) {
          var observe;
          if (window.attachEvent) {
            observe = function (element, event, handler) {
              element.attachEvent('on' + event, handler);
            };
          }
          else {
            observe = function (element, event, handler) {
              element.addEventListener(event, handler, false);
            };
          }

          $scope.init = function () {
            var text = document.getElementById('text');
            var resize = function () {
              text.style.height = 'auto';
              text.style.height = text.scrollHeight + 'px';
            }
            /* 0-timeout to get the already changed text */
            var delayedResize = function () {
              window.setTimeout(resize, 0);
            }
            observe(text, 'change', resize);
            observe(text, 'cut', delayedResize);
            observe(text, 'paste', delayedResize);
            observe(text, 'drop', delayedResize);
            observe(text, 'keydown', delayedResize);

            resize();
          }

          var camelModelToLower = $scope.objectType.toLowerCase().concat('s');
          var flag = 0;
          $scope.userNames = [];
          $scope.allIds = [];


          $scope.updateBody = [];
          $scope.toggleArea = [];

          var model = $api[camelModelToLower].get({id: $scope.objectId}, function () {
            if (!flag) {
              if (model.comments) {
                for (var i = 0; i < model.comments.length; i++) {
                  $scope.toggleArea[i] = 0;
                  $scope.updateBody[i] = model.comments[i].body;
                  var user_id = model.comments[i].user_id;
                  var index = $scope.allIds.indexOf(user_id);
                  if (index > -1) {
                    $scope.userNames.push($scope.userNames[index]);
                    $scope.allIds.push(user_id);
                  } else {
                    var user = $api.users.get({id: user_id});
                    $scope.userNames.push(user);
                    $scope.allIds.push(user_id);
                  }
                }
              }
              flag ^= 1;
            }
            $scope.list = model;
            if (!$scope.list.comments) {
              $scope.list.comments = [];
            }
          })


          $scope.body = "";


          var addUserName = function (comment) {
            var user_id = comment.user_id;
            var index = $scope.allIds.indexOf(user_id);
            if (index > -1) {
              $scope.userNames.push($scope.userNames[index]);
              $scope.allIds.push(user_id);
            } else {
              var user = $api.users.get({id: user_id});
              $scope.userNames.push(user);
              $scope.allIds.push(user_id);
            }
          }

          $scope.isTheOwner = function (comment) {
            return comment.user_id !== $rootScope.user.id;
          }

          $scope.saveComment = function () {
            if ($scope.body == "") return;

            var newComment = {
              body: $scope.body,
              user_id: $rootScope.user.id,
              commentable_id: $scope.objectId,
              commentable_type: $scope.objectType,
              created_at: Date.now()
            };


            $scope.userNames.push($rootScope.user);
            $scope.allIds.push(newComment.user_id);
            $scope.list.comments.push(newComment);
            $scope.body = "";
            $loading.start('loading-more');

            var comment = $api.comments.create(
                {
                  comment: newComment
                }, function () {

                  var index = $scope.list.comments.indexOf(newComment);
                  var model = $api[camelModelToLower].get({id: $scope.objectId}, function () {
                    if (model.comments) {
                      for (var i = 0; i < model.comments.length; i++) {
                        if (!$scope.list.comments[i].id) {
                          addUserName(model.comments[i]);
                          $scope.list.comments[i].id = model.comments[i].id;
                          $scope.updateBody[i] = model.comments[i].body;
                        }
                      }
                    }
                    $loading.finish('loading-more');
                  }, function () {

                  });
                }, function () {
                  $scope.list.comments.splice($scope.list.comments.length - 1, 1);
                  $scope.userNames.splice($scope.list.comments.length - 1, 1);
                  $scope.allIds.splice($scope.list.comments.length - 1, 1);
                });
          }

          $scope.updateComment = function (comment, index) {
            if ($scope.updateBody[index] == "") return;

            var index = $scope.list.comments.indexOf(comment);

            var upComment = comment;
            upComment.body = $scope.updateBody[index];
            $scope.list.comments[index] = upComment;
            $scope.toggle(index);


            var updatedComment = $api.comments.update({id: comment.id}, {
              comment: upComment
            }, function () {

            }, function () {
              $scope.list.comments[index] = comment;
            });
          }

          $scope.toggle = function (index) {
            $scope.toggleArea[index] ^= 1;
          }

          $scope.deleteComment = function (comment) {
            var index = $scope.list.comments.indexOf(comment);
            $scope.list.comments.splice(index, 1);
            var name = $scope.userNames[index];
            var lastState = $scope.toggleArea[index];
            var lastComment = $scope.updateBody[index];
            $scope.userNames.splice(index, 1);
            $scope.allIds.splice(index, 1);
            $scope.toggleArea.splice(index, 1);
            $scope.updateBody.splice(index, 1);
            var deletedComment = $api.comments.delete({id: comment.id}, function () {

            }, function () {
              $scope.list.common.splice(index, 0, comment);
              $scope.userNames.splice(index, 0, name);
              $scope.allIds.splice(index, 0, comment.user_id);
              $scope.toggleArea.splice(index, 0, lastState)
              $scope.updateBody.splice(index, 0, lastComment);
            });
          }
        },
        templateUrl: 'components/common/aurora-comments.html'
      }
    }]).directive('enterSubmit', function () {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {

          elem.bind('keydown', function (event) {
            var code = event.keyCode || event.which;

            if (code === 13) {
              if (!event.shiftKey) {
                event.preventDefault();
                scope.$apply(attrs.enterSubmit);
              }
            }
          });
        }
      }
    });
