'use strict';

angular
	.module('aurora.common')
		.factory('$jQCustom', [function() {
			var utilsService = {};

			utilsService.hasClass = function(element, className) {
				return element.className && new RegExp("(^|\\t|\\s)" + className + "(\\s|\\t|$)").test(element.className);
			};

			return utilsService;
		}]);