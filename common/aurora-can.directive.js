'use strict';

angular.module('aurora.common')
  .directive('auroraCan', [ '$api', '$rootScope', '$loading', function( $api, $rootScope, $loading) {
    return {
      restrict: 'A',
      scope: {
        action: '@action',
        objectType: '@objectType',
        objectId: '@objectId'
      }, 
      link: function($scope, element, attributes) {
        element.addClass('hidden');
        var statement = {}
        statement.verb = $scope.action;
        statement.object_type = $scope.objectType;
        if ($scope.objectId != '') {
          statement.object_id = $scope.objectId;
        }
        var permission = $api.users.can(statement, function () {
          if (permission.granted) {
            element.removeClass('hidden');
          }
        });
      }
    }
  }]);