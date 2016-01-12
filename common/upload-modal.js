'use strict';

angular.module('aurora.common')
	.controller('uploadModal', ['$scope', '$uibModalInstance', '$api', '$http', '$timeout', '$uibModal', 'data', function ($scope, $uibModalInstance, $api, $http, $filter, $timeout, $uibModal, data) {
	
		$scope.key = 0;
    $scope.allUploadsDone = 0;  
		$scope.name = "";
		$scope.subject_id = $uibModal.subject_id;
		$scope.grade_id = $uibModal.grade_id;

		$scope.type = $uibModalInstance.type;

		$scope.close = function() {
			if ($scope.key) {
				$uibModalInstance.close({ id: $scope.key, title: $scope.name });
			} else {
				$uibModalInstance.close();
			}
		}

	    //Watch options
		$scope.$watch('allUploadsDone', function (newValue) {
		    if (newValue != 0) {
		        $scope.close();
		    }
		});
		
	}]);
