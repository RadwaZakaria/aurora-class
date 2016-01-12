
angular.module('aurora.quizzes')
.controller('quizResults', function ($scope, $uibModal, $http, $rootScope, $loading, $timeout, $translate, $stateParams, $state) {

    $translate(['quiz.results','quiz.names' , 'quiz.score' , 'quiz.correct' , 'quiz.inCorrect' , 'quiz.partial', 'quiz.pending' , 'quiz.skip']).then(function (t) {
        console.log(t);
        $rootScope.pageTitle = t['quiz.results'];
        $scope.names=t['quiz.names'];
        $scope.score= t['quiz.score'];
        $scope.correct = t['quiz.correct'];
        $scope.inCorrect = t['quiz.inCorrect'];
        $scope.partial = t ['quiz.partial'],
        $scope.pending = t['quiz.pending'];
        $scope.skip = t ['quiz.skip'];

        $scope.headercolumns = [
            $scope.names,
            $scope.score,
            $scope.correct,
            $scope.inCorrect,
            $scope.partial,
            $scope.pending,
            $scope.skip,
        ];
    });
        console.log($stateParams);
  $scope.quizId = $stateParams.id;
  $scope.quizName = $stateParams.name;

  $scope.loadChart = function (){
        $scope.component = {};
        $scope.component.labels = [];
        $scope.component.colors = [];
        $scope.component.data = [];
        $scope.component.legend = true;
        if(!$rootScope.user.is_student){
          var data = $api.quizzes.reports({ id: $scope.quizId }, function () {
              $scope.quizName = data.quiz.name;
              //$scope.totalScore = data.reports.score;
             // $scope.quizInfo = "Quiz: " + $scope.quiz_name + ", Total Score: " + $scope.score;
              if ((!data.reports.correct_answers && !data.reports.incorrect_answers && !data.reports.partial_answers && !data.reports.skipped_answers && !data.reports.pending_answers)) {
                  humane.log('you can\'t show results for a quiz without being answered by any student');
                  $state.go('quizzes.index');
              }
              if(data.reports.correct_answers != 0){
                $scope.component.data.push(data.reports.correct_answers);
                $scope.component.colors.push("#6ab45f");
                $scope.component.labels.push($scope.correct);
              }
              if (data.reports.incorrect_answers != 0) {
                $scope.component.data.push(data.reports.incorrect_answers);
                $scope.component.colors.push("#cd460e");
                $scope.component.labels.push($scope.inCorrect);
              }
              if (data.reports.partial_answers != 0) {
                $scope.component.data.push(data.reports.partial_answers);
                $scope.component.colors.push("#eaba3c");
                $scope.component.labels.push($scope.partial);
              }
              if (data.reports.skipped_answers != 0) {
                $scope.component.data.push(data.reports.skipped_answers);
                $scope.component.colors.push("#252525");
                $scope.component.labels.push($scope.skip);
              }
              if (data.reports.pending_answers != 0) {
                  $scope.component.data.push(data.reports.pending_answers);
                  $scope.component.colors.push("#757575");
                  $scope.component.labels.push( $scope.pending);
              }
            $loading.finish('loading');
          });
        }
  };
  $scope.loadChart();
  // $scope.component.data = [36, 9, 43,12];
  $scope.quizId = $stateParams.id;
  //$scope.headercolumns = [
  //  $scope.names,
  //  "Score",
  //  "Correct",
  //  "Incorrect",
  //  "Partial",
  //  "Pending",
  //  "Skipped",
  //];

  $scope.gridOptions = {
    enableSorting: true,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
    }
  };

  $scope.questionMap = {};

  //$scope.quizId
  var scoresheetsdata = $api.quizzes.scoresheets({ id: $scope.quizId }, function () {
      if(!$rootScope.user.is_student) {
          $scope.totalScore = scoresheetsdata.scoresheets[0].result.total_score
      }
    $loading.finish('modal_loading');
    $loading.finish('loading');
      //$scope.quiz_name = data.quiz.name;
      //$scope.score = data.reports.score;
    if (scoresheetsdata.scoresheets.length > 0) {
      for (var i = 0; i < scoresheetsdata.scoresheets[0].result.answers.length; i++) {          
        $scope.headercolumns.push( "Q" + (1+i));
      }

      // build map of {question_id -> questionObject} 
      // ** FOR PENDING QUESTIONS ONLY **
      for (var i = 0; i < scoresheetsdata.scoresheets.length; i++) {
        for (var j = 0; j < scoresheetsdata.scoresheets[i].result.answers.length; j++) {
          if (scoresheetsdata.scoresheets[i].result.answers[j].status == "pending") {
            $api.contents.get({id: scoresheetsdata.scoresheets[i].result.answers[j].question_id},
            function (response) {
              $scope.questionMap[response.id] = response;
            });
          }
        }
      }
    }
    if($rootScope.user.is_student) {
      //console.log(scoresheetsdata.scoresheets[0].result.statistics.score);
      //console.log(scoresheetsdata.scoresheets[0].result.total_score);
        $scope.totalScore = scoresheetsdata.scoresheets[0].result.total_score;
        if (scoresheetsdata.scoresheets[0].result.statistics.correct_answers != 0) {
            $scope.component.data.push(scoresheetsdata.scoresheets[0].result.statistics.correct_answers);
            $scope.component.colors.push("#6ab45f");
            $scope.component.labels.push($scope.correct);
        }
        if (scoresheetsdata.scoresheets[0].result.statistics.incorrect_answers != 0) {
            $scope.component.data.push(scoresheetsdata.scoresheets[0].result.statistics.incorrect_answers);
            $scope.component.colors.push("#cd460e");
            $scope.component.labels.push($scope.inCorrect);
        }
        if (scoresheetsdata.scoresheets[0].result.statistics.partial_answers != 0) {
            $scope.component.data.push(scoresheetsdata.scoresheets[0].result.statistics.partial_answers);
            $scope.component.colors.push("#eaba3c");
            $scope.component.labels.push($scope.partial);
        }
        if (scoresheetsdata.scoresheets[0].result.statistics.skipped_answers != 0) {
            $scope.component.data.push(scoresheetsdata.scoresheets[0].result.statistics.skipped_answers);
            $scope.component.colors.push("#252525");
            $scope.component.labels.push($scope.skip);
        }
        if (scoresheetsdata.scoresheets[0].result.statistics.pending_answers != 0) {
            $scope.component.data.push(scoresheetsdata.scoresheets[0].result.statistics.pending_answers);
            $scope.component.colors.push("#757575");
            $scope.component.labels.push( $scope.pending);
        }
    }
      //console.log(scoresheetsdata);
    $scope.gridOptions.data = scoresheetsdata.scoresheets;
    $scope.gridOptions.columnDefs = $scope.columns;

    $scope.scoresheets = scoresheetsdata.scoresheets;
      $scope.withoutScoresheets = scoresheetsdata.without_scoresheets;
      console.log( $scope.withoutScoresheets[0]);
      console.log( $scope.scoresheets[0]);
  });

  $scope.showQuestion = function (questionId, answer, scoresheet, index) {
      if(!angular.isDefined($scope.questionMap[questionId]))
      {
          $state.go('quizzes.showUserAnswer',{quizId :$scope.quizId , scoresheetId :scoresheet.id ,questionId : questionId })
      }
      if ($scope.questionMap[questionId].data.typeId == 2) {
          var templateURL = "components/quizzes/show-essay-question.html", templateController = "quizEssayQuestion";
      }
    if ($scope.questionMap[questionId].data.typeId == 10) {
      templateURL = "components/quizzes/show-attachment-question.html", templateController = "attachment-question-quiz";
    }

    var modalInstance = $uibModal.open({
      scope: this,
      templateUrl: templateURL,
      controller: templateController,
      size: 'lg',
      windowClass: 'modal fade',
      resolve: {
        obj: function () {
            //@param answerScore :object to set score to
            //@param userAnswer : object holding the usr answer to render
          return { questionId: questionId, answerScore: answer, userAnswer: scoresheet.answers[index].answer}
        }
      }
    });

    modalInstance.result.then(function (userScore) {
        if (userScore >= 0) {
            var assessment = {
                question_id: questionId,
                score: userScore,
                status: 'partial'
            };
            var response = $api.scoresheets.assess({ id: scoresheet.id }, assessment,
                function () {
                    answer.score = userScore;
                    scoresheet.result.answers[index].score = userScore;
                    for(scoresheetOne in $scope.scoresheets){
                        if($scope.scoresheets[scoresheetOne].id == scoresheet.id){
                            $scope.scoresheets[scoresheetOne] = response;
                        }
                    }
                    $scope.loadChart();
                }
            );
      }

    });
  };

        $scope.newScoreSheet = function(student){
            $loading.start('loading');
            var userAnswers = [];
            $scope.quiz = $api.quizzes.get({id: $scope.quizId}, function (data) {
                for (var i = 0; i < data.questions.length; i++) {
                    data.questions[i].userAnswer = '';
                    userAnswers.push({question_id: data.questions[i].id, answer: data.questions[i].userAnswer});
                }
                $scope.scoresheet = $api.scoresheets.create({
                    scoresheet: {
                        quiz_id: $scope.quizId,
                        user_id: student,
                        answers: userAnswers
                    }
                },function(data){
                    for (var j = 0 ; j < data.result.answers.length ; j++){
                        data.result.answers[j].score = 0 ;
                    }
                    $scope.scoresheets.push(data);
                    $loading.finish('loading');
                });
                for(var s = 0 ; s < $scope.withoutScoresheets.length ; s++)
                {
                    if($scope.withoutScoresheets[s].id == student)
                    {
                        $scope.withoutScoresheets.shift($scope.withoutScoresheets[s])
                    }
                }

            });


        }


});
