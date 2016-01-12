angular.module('aurora.questions').controller('sortingController', ['$scope', '$utils', '$uibModal', '$translate' , '$rootScope', function ($scope, $utils, $uibModal ,$translate ,$rootScope) {
    var tmpList = [];

    $translate(['quiz.quizzes','quiz.sortHeader']).then(function(t){
        //$rootScope.pageTitle = t['quiz.quizzes'];
        $scope.sort = t['quiz.sortHeader'];


        $scope.$watch('question', function (newValue, oldValue) {
            //if (newValue.idealAnswers) {
            //    $scope.answers = newValue.idealAnswers;
            //}
            if (!newValue.header){
                $scope.question.header = $scope.sort ;
            }
        });
    });
console.log($rootScope.user);
    $scope.all = [];
    $scope.answers = [];

    $scope.txt = "";

    $scope.handleAnswersChange = function () {
        $scope.question.idealAnswers = $scope.answers;
        var arr = [];
        angular.copy($scope.answers, arr);
        $utils.shuffleArray(arr);
        $scope.question.content = arr;
    };

    $scope.addItem = function (item) {
        if($scope.answers.indexOf(item) < 0 &&item.length >0){
            $scope.answers.push(item);
            $scope.handleAnswersChange();
            $scope.txt = "";
        }
    };

    $scope.handleKeyDown = function ($event){
        if ($event.keyCode == 13) {
            $scope.addItem($scope.txt);
        }
    };

    $scope.removeListItem = function ( list, item) {
        var index = list.indexOf(item);
        list.splice(index, 1);
        $scope.handleAnswersChange();
    };

    $scope.sortableOptions = {
        orderChanged: function (event) {
/*            $scope.question.answers = $scope.answers;
            var arr = [];
            angular.copy($scope.answers, arr);
            $utils.shuffleArray(arr);
            $scope.question.questionContent = arr;*/
            $scope.handleAnswersChange();
        }
    };
    function initScope(scope) {
        $scope.$watch('question', function (newValue, oldValue) {
            if (newValue.idealAnswers) {
                $scope.answers = newValue.idealAnswers;
            }
            //if (!newValue.header){
            //    $scope.question.header = $scope.sort ;
            //}
        });
        $scope.$watch('answers', function (newValue, oldValue) {
            $scope.question.idealAnswers = $scope.answers;
            $scope.handleAnswersChange();
        }, true);


    };
    initScope($scope);

}]);
