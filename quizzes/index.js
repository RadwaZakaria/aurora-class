'use strict';

angular.module('aurora.quizzes')
    .controller('quizzesIndex', function ($scope, $rootScope, $loading, $timeout, $translate) {

        $scope.subjects = [];
        $scope.groups = [];
        $scope.grades = [];
        $scope.quizzes = [];
        $scope.quizzesPerPage = 5;
        $scope.currentPage = 1;

        $scope.dates = [
            { id: null, name : 'Any time'},
            { id: 1, name: 'Today'},
            { id: 7, name: 'Last week'},
            { id: 30, name: 'Last month'},
        ];

        //$scope.subjects = $api.subjects.query();
        $scope.grades = $api.grades.query({by_school_id: $user.school_id});
        $scope.groups = $api.groups.query();

        $timeout( function(){
           // $scope.subjects.unshift({name : "Any Subject", id: null});
            $scope.grades.unshift({name : "Any Grade", id: null});
            $scope.groups.unshift({name : "Any Group", id: null});
        }, 2000);

        $translate('quiz.quzzies').then(function (t) {
            $rootScope.pageTitle = t;
        });

        $scope.getQuizzes = function(append) {
            if(!append){
                $loading.start('loading');
            }else {
                $loading.start('loading-more');
            }
            var append = append;
            var quizzes = $api.quizzes.query({
                    'per': $scope.quizzesPerPage,
                    'page': $scope.currentPage,
                    //'by_subject_id': $scope.subjects.selected,
                    'by_group_id': $scope.groups.selected,
                    'by_grade_id': $scope.grades.selected,
                    'by_date': $scope.dates.selected
                },
                function () {
                    if (quizzes.length >= $scope.quizzesPerPage) {
                        $scope.enableMoreButton = true;
                    } else {
                        $scope.enableMoreButton = false;
                    }
                    if (append) {
                        $scope.quizzes = $scope.quizzes.concat(quizzes);
                        $loading.finish('loading-more');
                    } else {
                        $scope.quizzes = quizzes;
                        $loading.finish('loading');
                    }
                });
        };

        //-----fire when load More Button click
        $scope.OnLoadMoreButtonClick = function () {
            $scope.currentPage += 1;
            $scope.getQuizzes(true);
        }

        //-- load all lessons for first time
        $scope.getQuizzes();
    });
