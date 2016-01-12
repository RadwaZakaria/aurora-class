angular.module('aurora.questions').controller('matchingController', ['$scope', '$utils', '$uibModal', '$translate','$rootScope', function ($scope, $utils, $uibModal,$translate ,$rootScope) {

    $translate(['quiz.quizzes','quiz.matchHeader']).then(function(t){
        //$rootScope.pageTitle = t['quiz.quizzes'];
        $scope.match = t['quiz.matchHeader'];


        $scope.$watch('question', function (newValue, oldValue) {
            //if (newValue.content) {
            //    $scope.questionList1 = $scope.question.content.questionList1;
            //    $scope.questionList2 = $scope.question.content.questionList2;
            //    $scope.answers = $scope.question.idealAnswers;
            //}else {
            //    newValue.content = {'questionList1' :[], 'questionList2' : []};
            //}
            if (!newValue.header) {
                $scope.question.header =  $scope.match;
            }
        });
    });


    $scope.questionList1 = [];
    $scope.questionList2 = [];
    $scope.answers = [];

    $scope.txt = "";
    $scope.txt1 = "";

    $scope.handleAnswersChange = function () {
        $scope.question.content.questionList1 = $scope.questionList1;
        var arr = [];
        angular.copy($scope.questionList2, arr);
        $utils.shuffleArray(arr);
        $scope.question.content.questionList2 = arr;
        $scope.answers = [];
        for(var i = 0; i < Math.min($scope.questionList1.length, $scope.questionList2.length); i++ ){
            $scope.answers.push({'list1Item' : $scope.questionList1[i], 'list2Item' : $scope.questionList2[i]});
        }
    };

    $scope.addItem = function ( id) {
        if(id == 1){
            if($scope.questionList1.indexOf($scope.txt) < 0 && item.length >0) {
                $scope.questionList1.push($scope.txt);
                $scope.handleAnswersChange();
                $scope.txt = "";
            }
            else{
                    humane.log("you could not duplicate answers or questions");
                }
        }
             else if(id==2) {
                 if($scope.questionList2.indexOf($scope.txt1) < 0 && item.length >0) {
                    $scope.questionList2.push($scope.txt1);
                    $scope.handleAnswersChange();
                    $scope.txt1 = "";
                 }
                 else{
                         humane.log("you could not duplicate answers or questions");
                     }
            }
    };

    $scope.handleKeyDown = function ($event,id){
        if ($event.keyCode == 13) {
            if(id == 1){
            $scope.addItem(1);
        }else if(id==2){
           $scope.addItem(2);
        }}
    };

    $scope.removeListItem = function ( list, item) {
        var index = list.indexOf(item);
        list.splice(index, 1);
        $scope.handleAnswersChange();
    };
     

    $scope.questionListSortableOptions = {
        orderChanged: function (event) {
            $scope.question.content.questionList1 = $scope.questionList1;
            var arr = [];
            angular.copy($scope.questionList2, arr);
            $utils.shuffleArray(arr);
            $scope.question.content.questionList2 = arr;
            $scope.answers = [];
            for(var i = 0; i < Math.min($scope.questionList1.length, $scope.questionList2.length); i++ ){
                $scope.answers.push({'list1Item' : $scope.questionList1[i], 'list2Item' : $scope.questionList2[i]});
            }
        },
         accept: function (sourceItemHandleScope, destSortableScope) {
         return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
     },
     itemMoved: function (event) {
      event.source.itemScope.modelValue.status = event.dest.sortableScope.$parent.item;
    }
         
    };

    function initScope(scope) {
        $scope.$watch('question', function (newValue, oldValue) {
            if (newValue.content) {
                $scope.questionList1 = $scope.question.content.questionList1;
                $scope.questionList2 = $scope.question.content.questionList2;
                $scope.answers = $scope.question.idealAnswers;
            }else {
                newValue.content = {'questionList1' :[], 'questionList2' : []};
            }
            //if (!newValue.header) {
            //    $scope.question.header =  $scope.match;
            //}
        });
        $scope.$watch('answers', function (newValue, oldValue) {
            $scope.question.idealAnswers = $scope.answers;
        });
    }

    initScope($scope);

}]);
