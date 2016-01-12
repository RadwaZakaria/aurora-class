'use strict';

// Declare app level module which depends on views, and components
angular.module('auroraClass', [
      'utilities',
      'ui.bootstrap',
      'ui.utils',
      'picardy.fontawesome',
      'interactjs',
      'ngSanitize',
      'ui.router',
      'pascalprecht.translate',
      'aurora.quizzes',
      'aurora.common',
      'darthwade.dwLoading',
      'LocalStorageModule',
      'sanavigationguard',
      'fsCordova',
], function($httpProvider){
    FastClick.attach(document.body);
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


angular.module('auroraClass').
  config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'localStorageServiceProvider', function($stateProvider, $urlRouterProvider, $locationProvider, localStorageServiceProvider) {
    // This is our home page
    $urlRouterProvider.otherwise('quizzes/');
    localStorageServiceProvider.setPrefix('aurora-client-class');
    localStorageServiceProvider.setStorageType('sessionStorage');
  }])
  .run([ '$location', '$rootScope', '$state', '$loading', '$translate', '$uibModalStack', '$cordovaService',
        function( $location, $rootScope, $state, $loading, $translate, $uibModalStack, $cordovaService ) {

    $cordovaService.ready.then(function() {
        //TODO handle mobile actions
    });

    $rootScope.is_teacher= window.is_teacher;
    $rootScope.is_student= window.is_student;
    FastClick.attach(document.body);

    $rootScope.$on('$stateNotFound', function (event) {
        console.log(event);
      $rootScope.sidebarVisible = false;
      console.log('No route matched...');
    });


    $rootScope.$on('$stateChangeSuccess', function (event, toState, fromState) {
        console.log(toState);
        $loading.finish('loading');
      $rootScope.sidebarVisible = false;
      $rootScope.pageClasses = '';
      FastClick.attach(document.body);
    });


    $rootScope.$on('$stateChangeError', function (event) {
        console.log(event);
      event.preventDefault();
      $rootScope.sidebarVisible = false;
    });

    
    $rootScope.toggleSidebar = function () {
      $rootScope.sidebarVisible = !$rootScope.sidebarVisible;
    };

  }]);

