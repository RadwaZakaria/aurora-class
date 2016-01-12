'use strict';

angular.module('aurora.quizzes', [
    'ui.bootstrap',
    'ng-token-auth',
    'ngTouch',
    'ui.tinymce',
    'uiSwitch',
    'utilities',
    'ngAnimate',
    'timer',
    'aurora.questions',
    'chart.js',
    'ui.grid',
    'ui.grid.pinning',
    'aurora.common',
    'ui.sortable',
    'ui.bootstrap.datetimepicker',
    'mwl.confirm',
    'fileReader'
]).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('quizzes', {
            url: '/quizzes',
            template: '<ui-view/>'
        }).state('quizzes.index', {
            url: '/',
            templateUrl: 'quizzes/index.html'
        }).state('quizzes.take', {
            url: '/take',
            templateUrl: 'quizzes/take.html'
        }).state('quizzes.results', {
            url: '/:id/results',
            templateUrl: 'quizzes/results.html',
            params: {name: null}
        }).state('quizzes.showUserAnswer', {
            url: '/:quizId/:scoresheetId/:questionId/showUserAnswer',
            templateUrl: 'quizzes/question-result.html'
        });
}]);
