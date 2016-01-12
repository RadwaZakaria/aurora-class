'use strict';

angular.module('aurora.questions').controller('essayController', ['$scope', '$rootScope', '$uibModal','$translate', function ($scope, $rootScope, $uibModal ,$translate ) {
    $translate(['quiz.quizzes','quiz.essayHeader']).then(function(t){
        //$rootScope.pageTitle = t['quiz.quizzes'];
        $scope.essay = t['quiz.essayHeader'];

        $scope.$watch('question', function (newValue, oldValue) {
            if (!newValue.header) {
                $scope.question.header = $scope.essay;
            }

        });
    });

}]);

