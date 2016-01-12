'use strict';

angular.module('aurora.common').controller('mediaCtrl', ['$sce', '$scope', function ($sce, $scope) {
	var mediaType = 'video/mp4';
	if ($scope.type == 'Audio') {
		mediaType = 'audio/mpeg';
	}
	
	$scope.$watch(function(scope) {
		return scope.url;
	}, function(newValue, oldValue) {
		if (newValue != oldValue) {
			$scope.config = {
			  preload: "none",
			  sources: [{src: $sce.trustAsResourceUrl(newValue), type: mediaType }],
			  theme: {url: "bower_components/videogular-themes-default/videogular.css"}
			};
		}
	});
}]);