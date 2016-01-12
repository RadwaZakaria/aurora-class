'use strict';

angular.module('aurora.common')
  .directive('auroraWizard', [ '$api', '$rootScope', '$loading', function( $api, $rootScope, $loading) {
  return {
      restrict: 'E',
    scope: {
      wizard: '=config'
    },
    templateUrl: 'components/common/aurora-wizard.html'
  }
}]);
