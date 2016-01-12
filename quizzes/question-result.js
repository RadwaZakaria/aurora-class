angular.module('aurora.quizzes').controller('QuestionResult',
    function ($scope,  $api, $loading, $stateParams ,$compile, $questionTypes , $translate ,$rootScope ,$state ) {
        $loading.start('loading');
        $translate('quiz.questionResult').then(function (t) {
            $rootScope.pageTitle = t;
        });
        $scope.questionId = $stateParams.questionId;
        $scope.quizId = $stateParams.quizId;
        $scope.scoresheetId = $stateParams.scoresheetId;
        $scope.userAnswer = [];

        $scope.quiz = $api.quizzes.get({id:$scope.quizId}, function(){
            $scope.showResult = false;
            $api.contents.get({id:$scope.questionId},
                function (data) {
                    data.data.id = data.id;
                    data.data.viewModel = {};
                    data.data.viewModel.user = data.user;
                    data.data.viewModel.preview = true;
                    data.data.viewModel.showResult = false;
                   if($scope.quiz.show_correct_answer == true && $scope.quiz.state == 'completed')
                   {
                       data.data.viewModel.showResult = true;
                   }
                    data.data.viewModel.type = $questionTypes.getType(data.data.typeId);
                    $scope.currentQuestion = data.data;
                    $scope.questionImage = data.data.image;
                    $scope.questionAduio = data.data.audio;
                    $scope.questionVideo = data.data.video;
                    var ele = document.getElementById("draggableZone");
                    var questionElement = document.createElement("question");
                    questionElement.setAttribute("question", $scope.currentQuestion[0]);
                    questionElement.setAttribute("controller-name", $scope.currentQuestion.viewModel.type.controller);
                    questionElement.setAttribute("template", $scope.currentQuestion.viewModel.type.template);
                    ele.innerHTML = "";
                    ele.appendChild(questionElement);
                    $compile(ele)($scope);
                    $scope.scoreSheets = $api.scoresheets.get({id:$scope.scoresheetId},
                        function (data ) {
                            $scope.userName = data.user.name;
                            $scope.userImage = data.user.avatar;
                            $scope.userScore = data.result;
                            //$scope.userAnswer = data.answers;
                            for(ans in data.answers) {
                                if ($scope.questionId  == data.answers[ans].question_id) {
                                    $scope.userScore = data.result.answers[ans].score.toFixed(3);
                                    if(data.answers[ans].answer != null){
                                    for (var i = 0; i < data.answers[ans].answer.length; i++) {
                                        if (data.answers[ans].answer[i]) {
                                            if ($scope.currentQuestion.typeId == 3) {
                                                data.answers[ans].answer[i] = angular.fromJson(data.answers[ans].answer[i]);
                                            }
                                            if (data.answers[ans].answer[i].value) {
                                                $scope.userAnswer.push(data.answers[ans].answer[i].value);
                                            } else {
                                                if ($scope.currentQuestion.typeId == 5) {
                                                    $scope.userAnswer.push(data.answers[ans].answer[i] == "1" ? 'True' : 'False');
                                                } else if ($scope.currentQuestion.typeId == 8) {
                                                    $scope.userAnswer.push(data.answers[ans].answer[i]);
                                                } else if ($scope.currentQuestion.typeId == 6) {
                                                    $scope.userAnswer.push("");
                                                } else if ($scope.currentQuestion.typeId == 10) {
                                                    var mediaDirective = document.createElement("media-player");
                                                    mediaDirective.setAttribute("type", 'Attachment');
                                                    mediaDirective.setAttribute("url", "");
                                                    mediaDirective.setAttribute("uid", data.answers[ans].answer[i].uid);

                                                    var ele = document.getElementById("answer-container");
                                                    ele.innerHTML = "";
                                                    ele.appendChild(mediaDirective);
                                                    $compile(ele)($scope);
                                                    //$scope.userAnswer[ans]= data.answers[ans].uid;
                                                } else if (!data.answers[ans].answer[i].value) {
                                                    $scope.userAnswer.push(data.answers[ans].answer[i]);
                                                }
                                            }
                                        }
                                    }
                                    }
                                }
                            }
                            $loading.finish('loading');
                        });

                });
         });


        $scope.done = function () {
            if($scope.userScore <= $scope.currentQuestion.points) {
                var assessment = {
                    question_id: $scope.currentQuestion.id,
                    score: $scope.userScore
                };
                var userNewScore = $api.scoresheets.assess({id: $scope.scoreSheets.id}, assessment , function (){
                    $state.go('quizzes.results',({id:$scope.quizId}));

                });
            }
        };


         //$scope.questionId = $stateParams.questionId;

                //$scope.idealAnswer = $stateParams.idealAnswer;


                //$scope.questionContent = $stateParams.data.content;
                //$scope.questionOptions = $stateParams.options;
                //$scope.questionImage = $stateParams.data.image;
                //$scope.questionAduio = $stateParams.data.audio;
                //$scope.questionVideo = $stateParams.data.video;
                //
    });