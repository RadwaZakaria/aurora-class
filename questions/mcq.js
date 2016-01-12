'use strict';

angular.module('aurora.questions')
    .controller('mcqController', function ($scope, $document, $uibModal ,$translate ,$rootScope) {

        $translate(['quiz.quizzes','quiz.mcqHeader']).then(function(t){
            //$rootScope.pageTitle = t['quiz.quizzes'];
            $scope.mcq = t['quiz.mcqHeader'];
        });

        $scope.answers = [];
        var temp = new Answer($scope.answers.length);
        $scope.answers.push(temp);
        temp = new Answer($scope.answers.length);
        $scope.answers.push(temp);
        $scope.isCorrect = true;

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
            if (!newValue.header) {
                $scope.question.header = $scope.mcq ;
            }
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
        }, true);


        $scope.setCorrectAnswer = function (answer) {
            for(var answerId in $scope.answers){
                delete $scope.answers[answerId].isCorrect;
            }
            answer.isCorrect = true;
        };

        $scope.addAnswer = function () {
            var temp = new Answer($scope.answers.length);
            $scope.answers.push(temp)
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
        }


    });

var Answer = function (id) {
    this.id = id;
    this.isCorrect = false;
    this.value = "";
}
