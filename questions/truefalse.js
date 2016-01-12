'use strict';

angular.module('aurora.questions')
    .controller('trueFalseController', function ($scope, $uibModal,$translate ,$rootScope) {

        $translate(['quiz.quizzes','quiz.trueHeader']).then(function(t){
            //$rootScope.pageTitle = t['quiz.quizzes'];
            $scope.trueFalse = t['quiz.trueHeader'];

            $scope.$watch('question', function (newValue, oldValue) {
                //if(newValue.idealAnswers){
                //    scope.answers.selected = newValue.idealAnswers;
                //}
                 if (!newValue.header) {
                    $scope.question.header = $scope.trueFalse;
                }
            });
        });

        function initScope(scope) {
            $scope.$watch('question', function (newValue, oldValue) {
                if(newValue.idealAnswers){
                    scope.answers.selected = newValue.idealAnswers;
                }
                // if (!newValue.header) {
                //    $scope.question.header = $scope.trueFalse;
                //}
            });
            $scope.$watch('answers.selected', function (newValue, oldValue) {
                if($scope.answers.selected)
                    $scope.question.idealAnswers = $scope.answers.selected;
            });
        }

        $scope.answers = [
            { text: 'False', value: '0' },
            { text: 'True', value: '1' },
        ];

        initScope($scope);

    })
