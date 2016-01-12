angular.module('aurora.quizzes').controller('quizEssayQuestion',
      function ($scope, $uibModalInstance , $loading,obj) {

          $loading.start('loading-more');
          $scope.questionId = obj.questionId;
          $scope.userScore = 0;
        //  $scope.questionId = obj.questionId;
          var questions = $api.contents.get({id:obj.questionId},
                   function (data) {
                       $scope.questionId = obj.questionId;
                       $scope.userAnswer = obj.userAnswer;

                       $scope.questionContent = data.data.content;
                       $scope.questionImage = data.data.image;
                       $scope.questionAduio = data.data.audio;
                       $scope.questionVideo = data.data.video;
                       $scope.questionScore = data.data.points;
                       $scope.questionHeader = data.data.header;
                       $loading.finish('modal_loading');
                       console.log(data);
                   });

          $scope.done = function () {
              if (!this.essayForm.$valid) {
                  return false;
              } else {

                  $uibModalInstance .close($scope.userScore
                      //questionId: $scope.questionId
                     // answerObjIndex: $scope.answerObjIndex,
                     // userObjIndex: $scope.userObjIndex
                  );
              }
          };

          $scope.close =function(){
              $uibModalInstance .close();
          }
      });