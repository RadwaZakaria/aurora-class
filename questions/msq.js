'use strict';

angular.module('aurora.questions')
    .controller('msqController', function ($scope, $uibModal,$translate,$rootScope) {

        $translate(['quiz.quizzes','quiz.msqHeader']).then(function(t){
            //$rootScope.pageTitle = t['quiz.quizzes'];
            $scope.msq = t['quiz.msqHeader'];


            $scope.$watch('question', function (newValue, oldValue) {
                //if(newValue.idealAnswers && newValue.options){
                //    angular.copy(newValue.options, $scope.answers);
                //    for(var i = 0; i < newValue.idealAnswers.length; i++){
                //        for(var j = 0; j < $scope.answers.length; j++){
                //            if(newValue.idealAnswers[i].value ==  $scope.answers [j].value && newValue.idealAnswers[i].id ==  $scope.answers [j].id){
                //                $scope.answers[j].isCorrect = true;
                //            }
                //        }
                //    }
                //}
                if (!newValue.header) {
                    $scope.question.header = $scope.msq;
                }
            });
        });

        $scope.answers = [];
        $scope.currentanswer = null;

        initScope($scope);

        function initScope(scope) {
            $scope.$watch('question', function (newValue, oldValue) {
                if(newValue.idealAnswers && newValue.options){
                    angular.copy(newValue.options, $scope.answers);
                    for(var i = 0; i < newValue.idealAnswers.length; i++){
                        for(var j = 0; j < $scope.answers.length; j++){
                            if(newValue.idealAnswers[i].value ==  $scope.answers [j].value && newValue.idealAnswers[i].id ==  $scope.answers [j].id){
                                $scope.answers[j].isCorrect = true;
                            }
                        }
                    }
                }
                //if (!newValue.header) {
                //    $scope.question.header = $scope.msq;
                //}
            });
            $scope.$watch('answers', function (newValue, oldValue) {
                var arr = [];
                $scope.question.idealAnswers = [];
                $scope.question.options = [];
                angular.copy($scope.answers, arr);
                for(var i = 0; i < arr.length; i++){
                    if(arr[i].isCorrect){
                        $scope.question.idealAnswers.push(arr[i]);
                    }
                    delete arr[i].isCorrect;
                    $scope.question.options.push(arr[i]);
                }
                //$scope.question.answers = $scope.answers;
            }, true);
            var temp = new Answer(scope.answers.length);
            scope.answers.push(temp);
            temp = new Answer(scope.answers.length);
            scope.answers.push(temp);
            scope.currentanswer = scope.answers[0];
        }

        $scope.addAnswer = function () {
            var temp = new Answer($scope.answers.length);
            $scope.answers.push(temp);
        }

        $scope.removeAnswer = function (container) {
            if ($scope.answers.length > 2) {
                var index = $scope.answers.indexOf(container.answer);
                if (index === -1) {
                    return false;
                }
                $scope.answers.splice(index, 1);
            } else {
                alert('Sorry,it must be at least 2 answers')
            }
        };
    })

var Answer = function (id) {
    this.id = id;
    this.isCorrect = false;
    this.value = "";
}