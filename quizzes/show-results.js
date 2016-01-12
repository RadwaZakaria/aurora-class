'use strict';

angular.module('aurora.quizzes')
	.controller('showQuizResults', ['$scope', '$state', '$uibModalInstance', '$timeout', '$uibModal', function ($scope, $state, $uibModalInstance, $filter, $timeout, $uibModal) {
		
		$scope.close = function() {
			$uibModalInstance.close();
			$state.go('quizzes.index');
		};

		$scope.data = $uibModalInstance.data;

	}])