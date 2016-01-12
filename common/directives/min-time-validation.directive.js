angular.module('aurora.common').directive('minTime', function (){
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elem, attrs, ctrl) {
            var minTime;

            elem.on('focus', function () {
                scope.$watch(attrs.minTime, function(newVal, oldValue) {
                    minTime = newVal;
                    validate();
                });

                scope.$watch(attrs.ngModel, function(newVal, oldValue){
                    if(newVal != oldValue)
                        validate(newVal);
                });
            });

            function validate(value) {
                console.log(ctrl.$modelValue);
                ctrl.$setValidity('minTime', (Date.parse(minTime) < Date.parse(ctrl.$modelValue)));
                return value;
            }
        }
    };
});
