angular.module('aurora.quizzes').controller('attachment-question-quiz',
      function ($scope, $compile, $uibModalInstance , $loading,obj) {

        console.log(obj);
          $loading.start('loading-more');
          $scope.questionId = obj.questionId;
          $scope.userScore = 0;
        //  $scope.questionId = obj.questionId;
          var questions = $api.contents.get({id:obj.questionId},
            function (data) {
              $scope.questionId = obj.questionId;
              $scope.answerObjIndex = obj.answerObjIndex;
              $scope.userObjIndex = obj.userObjIndex;
              $scope.userAnswer = obj.userAnswer;
              $scope.questionFileUID = data.data.attachmentFileUID;
              $scope.questionScore = data.data.points;
              $scope.questionHeader = data.data.header;
              $loading.finish('modal_loading');

              // generate media player for both files
              var mediaDirective = document.createElement("media-player");
              mediaDirective.setAttribute("type", 'Attachment');
              mediaDirective.setAttribute("url", "");
              mediaDirective.setAttribute("uid", $scope.questionFileUID);

              var ele = document.getElementById("question-container");
              ele.innerHTML = "";
              ele.appendChild(mediaDirective);
              $compile(ele)($scope);

              // generate media player for both files
              var mediaDirective = document.createElement("media-player");
              mediaDirective.setAttribute("type", 'Attachment');
              mediaDirective.setAttribute("url", "");
              mediaDirective.setAttribute("uid", $scope.userAnswer[0].uid);

              var ele = document.getElementById("answer-container");
              ele.innerHTML = "";
              ele.appendChild(mediaDirective);
              $compile(ele)($scope);

            });

          $scope.done = function () {

              if (!this.essayForm.$valid) {

                  return false;
              }
              else {
                $uibModalInstance .close($scope.userScore);
              }
          };
        $scope.close =function(){
          $uibModalInstance .close();
        }
      });
