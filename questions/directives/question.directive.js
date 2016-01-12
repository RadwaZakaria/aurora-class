'use strict';


angular.module('aurora.questions').directive('question', function ($compile, $controller) {
    var linker = function (scope, element, attrs, controller) {
        scope.$parent.$watch(attrs.question, function (newValue, oldValue) {
            scope.question =   scope.$parent['currentQuestion'];
        });
    };
    return {
        restrict: 'E',
        link: linker,
        scope: {question : '='},
        templateUrl: function(elem, attrs) {
            return attrs.template;
        },
        controller: "@",
        name : "controllerName"

    };
});
