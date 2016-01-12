angular.module('aurora.questions').controller('attachmentController', ['$scope', '$rootScope', '$uibModal','$translate', function ($scope, $rootScope, $uibModal ,$translate) {
    $translate(['quiz.quizzes','quiz.attachHeader']).then(function(t){
    $rootScope.pageTitle = t['quiz.quizzes'];
    $scope.attach = t['quiz.attachHeader'];
    });
    $scope.$watch('question', function (newValue, oldValue) {
        if (!newValue.header) {
            $scope.question.header = $scope.attach;
    }
});

'use strict';

    if ($scope.$parent.quiz) {
      $scope.subject_id = $scope.$parent.quiz.subject.id;
      $scope.grade_id = $scope.$parent.quiz.grade.id;
    } else if ($scope.$parent.assignment) {
      $scope.subject_id = $scope.$parent.assignment.subject.id;
      $scope.grade_id = $scope.$parent.assignment.grade.id;
    }

    $scope.attachFile = function () {
      var modalInstance = $uibModal.open({
          templateUrl: 'components/common/library.html',
          controller: 'librarycontroller',
          backdrop: 'static',
          size: 'lg',
          resolve: {
              selectedObj: function () {
                  return null;
              },
              searchType: function () {
                  return '';
              }, data: function () {
                  return { subject_id: $scope.subject_id, grade_id: $scope.grade_id }
              }
          }
      });

      modalInstance.result.then(function (details) {
        if (details) {
            var imgHTML = '<div style="width:200px ;height:200px;left:200px;" id="videoPreview">' + 
            '<media-player uid="' + details.asset.uid + '" type="' + details.asset.type + '" url="' + 
            details.asset.attachment.url + '" class="videogular-container"></media-player>' + '</div>';
            $scope.question.fileName = removeHyphenFromFileName(details.asset.attachment.name);
            $scope.question.attachmentFileUID = details.asset.uid;
        }
      });
    };

    function removeHyphenFromFileName(name) {
      return name.substring(name.indexOf('-') + 1, name.length);
    };

}]);

