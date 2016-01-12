angular.module('aurora.common')
  .directive('file', function() {
    return {
      restrict: 'AE',
      scope: {
        file: '@'
      },
      link: function(scope, el, attrs){
        el.bind('change', function(event){
          var files = event.target.files;
          scope.files = files;
          scope.$parent.files = files;
          scope.$apply();
        });
      }
    };
});
