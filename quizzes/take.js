'use strict';

angular.module('aurora.quizzes')
    .controller('takeQuizController', ['$scope', '$state', '$stateParams', '$loading', '$utils', '$rootScope', '$uibModal', '$compile', '$questionTypes', 'localStorageService', '$translate', '$fileReader',
      function ($scope, $state, $stateParams, $loading, $utils, $rootScope, $uibModal, $compile, $questionTypes, localStorageService, $translate, $fileReader) {


        //$scope.questions = questions.viewerQuestions;
        $scope.timerConsole = '';
        $scope.timerType = '';
        $scope.isPreview = false;


        //TODO check if for prview we do not need it, may be needed for teacher
        if ($scope.quizModalInstance && $scope.questions) {
          $scope.isPreview = true;
          $scope.countDownTime = 2000000;
        } else {
          //$scope.user_id = $rootScope.user.id;
          $scope.questions = [];
          $scope.flag = 1;

          $scope.$on('$stateChangeStart', function (event) {
                if ($scope.flag) {
                    var answer = confirm('If you leave the quiz now, your current answers will be submitted!')
                    if (!answer) {
                        event.preventDefault();
                        //TODO Handle the remaining time offline if this will stop the timer
                       /* $api.quizzes.getRemainingTime({ id: $scope.quizId }, function (data) {
                            $scope.can_submit = data.remaining_time.can_submit;
                            $scope.countDownTime = data.remaining_time.remaining_time;
                            $scope.$broadcast('timer-set-countdown', $scope.countDownTime);
                            if (!$scope.can_submit) {
                                $scope.answerTemplate();
                            }
                        });*/
                        $loading.finish('loading');
                    } else {
                        $scope.answerTemplate();
                    }
                }
          });

            $loading.start('loading');
            //TODO Read Quiz form a file instead form the backend

            $fileReader.promiseToHaveData().then(function (){
                $scope.quiz = $fileReader;
                $scope.can_submit = true;
                $scope.countDownTime = $scope.quiz.time_limit;

                    if (angular.isDefined($scope.quiz.questions) && !$utils.isEmptyArray($scope.quiz.questions)) {
                        $scope.questions = [];
                        $scope.orderedQuestions = [];
                        for (var i = 0; i < $scope.quiz.questions.length; i++) {
                            $scope.quiz.questions[i].data.viewModel = {};
                            $scope.quiz.questions[i].data.viewModel.user = $scope.quiz.questions[i].user;
                            $scope.quiz.questions[i].data.viewModel.type = $questionTypes.getType($scope.quiz.questions[i].data.typeId);
                            $scope.quiz.questions[i].data.id = $scope.quiz.questions[i].id;
                            $scope.quiz.questions[i].data.status = "default";
                            $scope.quiz.questions[i].data.grade_id = $scope.quiz.grade.id;
                            $scope.quiz.questions[i].data.subject_id = $scope.quiz.subject.id;
                            $scope.questions.push($scope.quiz.questions[i].data);

                        }
                        angular.copy($scope.questions, $scope.orderedQuestions);
                        if ($scope.quiz.randomise == true) {
                            $utils.shuffleArray($scope.questions);
                        }
                        $scope.questions[0].status = "current";
                    }
                    $scope.$broadcast('timer-set-countdown', $scope.countDownTime);
                    $loading.finish('loading');
            })
                /*

                //1- Get quiz form file
                //2- Not needed to get remaining time for the first time just use the quiz limit time
                //3- maintain remaining time from the angular timer lib
                            $api.quizzes.getRemainingTime({ id: $scope.quizId }, function (data) {
                                $scope.can_submit = data.remaining_time.can_submit;
                                $scope.countDownTime = data.remaining_time.remaining_time;
                                $scope.quiz = $api.quizzes.get({id: $scope.quizId}, function (data) {
                                    if (data.state != 'published') {
                                        humane.log('You can\'t take a quiz which is not published');
                                        $state.go('quizzes.index');
                                    }
                                    $translate('quiz.takeQuiz', { quizName: data.name }).then(function (t) {
                                        $rootScope.pageTitle = t;
                                    });
                                    if (angular.isDefined(data.questions) && !$utils.isEmptyArray(data.questions)) {
                                        $scope.questions = [];
                                        $scope.orderedQuestions = [];
                                        for (var i = 0; i < data.questions.length; i++) {
                                            data.questions[i].data.viewModel = {};
                                            data.questions[i].data.viewModel.user = data.questions[i].user;
                                            data.questions[i].data.viewModel.type = $questionTypes.getType(data.questions[i].data.typeId);
                                            data.questions[i].data.id = data.questions[i].id;
                                            data.questions[i].data.a
                                            data.questions[i].data.status = "default";
                                            data.questions[i].data.grade_id = data.grade.id;
                                            data.questions[i].data.subject_id = data.subject.id;
                                            $scope.questions.push(data.questions[i].data);

                                        }
                                        angular.copy($scope.questions, $scope.orderedQuestions);
                                        if ($scope.quiz.randomise == true) {
                                            $utils.shuffleArray($scope.questions);
                                        }
                                        $scope.questions[0].status = "current";
                                    }
                                    $scope.$broadcast('timer-set-countdown', $scope.countDownTime);
                                    $loading.finish('loading');
                                }, function () {
                                    $loading.finish('loading');
                                    humane.log('You don\'t have access to this page !');
                                    $state.go('quizzes.index')
                                });

                                if (!$scope.can_submit) {
                                    $scope.answerTemplate();
                                }
                            }, function () {
                                $loading.finish('loading');
                                humane.log('Error for quiz timer, Refer to your teacher');
                                $state.go('quizzes.index')
                            });

                */

        }
        $scope.saveAnswer = function () {
          $loading.start('loading');
          $scope.$broadcast('timer-stop');
          $scope.answerTemplate();
        };

        $scope.currentQuestion = 0;

        $scope.isFirstStep = function () {
          if(!$scope.isPreview) {
              $scope.questions[$scope.currentQuestion].status = "current";
          }
          return $scope.currentQuestion === 0;
        };
        $scope.isLastStep = function () {
          return $scope.currentQuestion === ($scope.questions.length - 1);
        };

        $scope.isCurrentStep = function (currentQuestion) {
          if(!$scope.isPreview) {
              $scope.questions[$scope.currentQuestion].status = "current";
          }
          return $scope.currentQuestion === currentQuestion;
        };

        $scope.setCurrentStep = function (currentQuestion) {
            $scope.currentQuestion;
            if(!$scope.isPreview) {
                if ($scope.questions[$scope.currentQuestion].userAnswer.length == 0) {
                    $scope.questions[$scope.currentQuestion].status = "skipped";
                } else {
                    $scope.questions[$scope.currentQuestion].status = "answered";
                    if ($scope.questions[$scope.currentQuestion].typeId == 2) {
                        if(tinyMCE.activeEditor.getBody().innerText.trim() == '') {
                            $scope.questions[$scope.currentQuestion].status = "skipped";
                        }
                    }
                    if ($scope.questions[$scope.currentQuestion].typeId == 6) {
                        for(var s =0 ; s< $scope.questions[$scope.currentQuestion].userAnswer.length ;s++) {
                            if (!angular.isDefined($scope.questions[$scope.currentQuestion].userAnswer[s].value)) {
                                $scope.questions[$scope.currentQuestion].status = "skipped";

                            } else {
                                $scope.questions[$scope.currentQuestion].status = "answered";
                                break;
                            }
                        }
                    }
                    if ($scope.questions[$scope.currentQuestion].typeId == 3) {
                        for(var s =0 ; s< $scope.questions[$scope.currentQuestion].userAnswer.length ;s++) {
                            if ($scope.questions[$scope.currentQuestion].userAnswer[s] == '') {
                                $scope.questions[$scope.currentQuestion].status = "skipped";

                            } else {
                                $scope.questions[$scope.currentQuestion].status = "answered";
                                break;
                            }
                        }
                    }
                }
            }
          if (currentQuestion >= 0){
            $scope.currentQuestion = currentQuestion;
              if(!$scope.isPreview) {
                  $scope.questions[$scope.currentQuestion].status = "current";
              }
          }
        };

        $scope.getCurrentStep = function () {
          return $scope.currentQuestion;
        };

        $scope.getNextLabel = function () {
          return ($scope.isLastStep()) ? 'Submit' : 'Next';
        };

        $scope.handlePrevious = function () {
            if(!$scope.isPreview) {
                if ($scope.questions[$scope.currentQuestion].userAnswer.length == 0) {
                    $scope.questions[$scope.currentQuestion].status = "skipped";
                } else {
                    $scope.questions[$scope.currentQuestion].status = "answered";
                    if ($scope.questions[$scope.currentQuestion].typeId == 2) {
                        if (tinyMCE.activeEditor.getBody().innerText.trim() == '') {
                            $scope.questions[$scope.currentQuestion].status = "skipped";
                        }
                    }
                    if ($scope.questions[$scope.currentQuestion].typeId == 6) {
                        for(var s =0 ; s< $scope.questions[$scope.currentQuestion].userAnswer.length ;s++) {
                            if (!angular.isDefined($scope.questions[$scope.currentQuestion].userAnswer[s].value)) {
                                $scope.questions[$scope.currentQuestion].status = "skipped";
                            } else {
                                $scope.questions[$scope.currentQuestion].status = "answered";
                                break;
                            }
                        }
                    }
                    if ($scope.questions[$scope.currentQuestion].typeId == 3) {
                        for(var s =0 ; s< $scope.questions[$scope.currentQuestion].userAnswer.length ;s++) {
                            if ($scope.questions[$scope.currentQuestion].userAnswer[s] == '') {
                                $scope.questions[$scope.currentQuestion].status = "skipped";
                            } else {
                                $scope.questions[$scope.currentQuestion].status = "answered";
                                break;
                            }
                        }
                    }
                }
            }
          $scope.currentQuestion -= ($scope.isFirstStep()) ? 0 : 1;
          if(!$scope.isPreview) {
            $scope.questions[$scope.currentQuestion].status = "current";
          }
        };

        $scope.handleNext = function () {
          if (!$scope.isLastStep()) {
              if(!$scope.isPreview) {
                  if ($scope.questions[$scope.currentQuestion].userAnswer.length == 0 ) {
                      $scope.questions[$scope.currentQuestion].status = "skipped";
                  } else {
                      $scope.questions[$scope.currentQuestion].status = "answered";
                      if ($scope.questions[$scope.currentQuestion].typeId == 2) {
                          if (tinyMCE.activeEditor.getBody().innerText.trim() == '') {
                              $scope.questions[$scope.currentQuestion].status = "skipped";
                          }
                      }
                      if ($scope.questions[$scope.currentQuestion].typeId == 6) {
                          for(var s =0 ; s< $scope.questions[$scope.currentQuestion].userAnswer.length ;s++) {
                              if (!angular.isDefined($scope.questions[$scope.currentQuestion].userAnswer[s].value)) {
                                  $scope.questions[$scope.currentQuestion].status = "skipped";
                              } else {
                                  $scope.questions[$scope.currentQuestion].status = "answered";
                                  break;
                              }
                          }
                      }
                      if ($scope.questions[$scope.currentQuestion].typeId == 3) {
                          for(var s =0 ; s< $scope.questions[$scope.currentQuestion].userAnswer.length ;s++) {
                              if ($scope.questions[$scope.currentQuestion].userAnswer[s] == '') {
                                  $scope.questions[$scope.currentQuestion].status = "skipped";
                              } else {
                                  $scope.questions[$scope.currentQuestion].status = "answered";
                                  break;
                              }
                          }
                      }

                  }
              }
              $scope.currentQuestion += 1;
              $scope.questions[$scope.currentQuestion].status = "current";
          } else if (!$scope.isPreview) {
            $scope.saveAnswer();
          } else {
            $scope.cancel();

          }
        };

        $scope.timerFinished = function () {
          alert("Time is over, Your answered questions only will be submitted ");
          $scope.answerTemplate();
        };

        $scope.showResults = function (quiz, scoresheet, answers) {
          var modalInstance = $uibModal.open({
            templateUrl: 'components/quizzes/show-results.html',
            controller: 'showQuizResults',
            backdrop: 'static',
            size: 'lg'
          });
          modalInstance.data = {
            quiz: quiz,
            answers: answers,
            scoresheet: scoresheet
          };
        };

        $scope.answerTemplate = function () {
          //console.log($scope.questions);
          if ($scope.questions && !$scope.isPreview) {
            $scope.flag = 0;
            var userAnswers = [];
            var flag = 0;
            for (var i = 0; i < $scope.orderedQuestions.length; i++) {
              for (var j = 0; j < $scope.questions.length; j++) {
                if($scope.orderedQuestions[i].id == $scope.questions[j].id){
                  //usage of angular from json just for the mcq question as result is returned as string and we want to submit it as object
                    if($scope.orderedQuestions[i].typeId == 1)
                        userAnswers.push({question_id: $scope.questions[j].id, answer: angular.fromJson($scope.questions[j].userAnswer)});
                    //Essay question problem on backend as submitted data contains the basic markup form TinyMCE which considered as answer on the backend instead of setting the question status to "skipped"
                    else if($scope.questions[j].typeId == 2 && $scope.questions[j].status == "skipped")
                        userAnswers.push({question_id: $scope.questions[j].id, answer: ''});
                    else if($scope.questions[j].typeId == 6 && $scope.questions[j].status == "skipped")
                        userAnswers.push({question_id: $scope.questions[j].id, answer: ''});
                    else {
                        if($scope.questions[j].typeId == 6){
                            for(var s= 0; s < $scope.questions[j].userAnswer.length ; s++) {
                                if(!angular.isDefined($scope.questions[j].userAnswer[s].value)){
                                   delete $scope.questions[j].userAnswer[s];
                                }
                            }
                            userAnswers.push({question_id: $scope.questions[j].id, answer: $scope.questions[j].userAnswer});
                        } else if($scope.questions[j].typeId == 3){
                            for(var s= 0; s < $scope.questions[j].userAnswer.length ; s++) {
                                if($scope.questions[j].userAnswer[s] == ''){
                                    delete $scope.questions[j].userAnswer[s];
                                }
                            }
                            userAnswers.push({question_id: $scope.questions[j].id, answer: $scope.questions[j].userAnswer});
                        } else
                            userAnswers.push({question_id: $scope.questions[j].id, answer: $scope.questions[j].userAnswer});
                    }
                }
              }
            }

              //TODO create the scoresheet on the students device instead of the backend
/*            var scoresheet = $api.scoresheets.create({
              scoresheet: {
                quiz_id: $scope.quizId,
                user_id: $rootScope.user.id,
                answers: userAnswers
              }
            }, function () {
              $loading.finish('loading');
              if (!flag && $scope.quiz.hide_points == true) {
                $scope.showResults($scope.quiz, scoresheet, userAnswers);
                flag ^= 1;
              }
              else {
                $state.go('quizzes.index');
              }
            }, function (argument) {
              if (argument.status == 422) {
                $loading.finish('loading');
                humane.log("Unable to submit  , This quiz may be taken before or Time may be Finished ");
                $state.go('quizzes.index');
              }
              else {
                $loading.finish('loading');
                humane.log("Unable to Submit , Something went wrong ");
              }
            })*/
          }
        };
        $scope.cancel = function () {
          for (var key in $scope.questions) {
            var question = $scope.questions[key];
            if (question.hasOwnProperty("userAnswer")) {
              delete question["userAnswer"];
              delete question["status"];
            }
          }
          $scope.quizModalInstance.dismiss();
        };

        $scope.clearAnswer=function() {
            console.log($scope.questions[$scope.currentQuestion]);
            $scope.questions[$scope.currentQuestion].userAnswer=[];
            if($scope.questions[$scope.currentQuestion].viewModel.type.name=="Match"){
                $utils.shuffleArray($scope.questions[$scope.currentQuestion].content.questionList2);
            }
            if($scope.questions[$scope.currentQuestion].viewModel.type.name=="Sort"){
                $utils.shuffleArray($scope.questions[$scope.currentQuestion].content);
            }
        };


      }]);



/*
 $scope.$on('timer-tick', function (event, args) {
 //$scope.timerConsole += $scope.timerType  + ' - event.name = '+ event.name + ', timeoutId = ' + args.timeoutId + ', millis = ' + args.millis +'\n';
 //console.log(args.millis);
 //if (localStorageService.isSupported && localStorageService.get($scope.quizId)) {
 //  localStorageService.set($scope.quizId + '.' + $rootScope.user.id, args.millis);
 //}
 //console.log(localStorageService.get($scope.quizId));
 });
 */

//  var userQuizRemainingTime = localStorageService.get($scope.quizId + '.' + $rootScope.user.id);
//  if (angular.isDefined(userQuizRemainingTime) && userQuizRemainingTime != null) {
//  console.log(localStorageService.get($scope.quizId + '.' + $rootScope.user.id));
//  $scope.countDownTime = userQuizRemainingTime / 1000;
//} else {
//  $scope.countDownTime = $scope.quiz.time_limit * 60;
//  if (localStorageService.isSupported) {
//    localStorageService.set($scope.quizId + '.' + $rootScope.user.id, $scope.countDownTime * 1000);
//  }
//}