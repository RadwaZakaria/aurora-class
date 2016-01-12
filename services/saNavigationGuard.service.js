'use strict';

angular.module('sanavigationguard',[]).factory('$guard', ['$window', function ($window) {
  var guardians = 0;

    var fun = function () {
    return 'You have unsaved work, Are you sure you want to leave now ?'
  };

  var onBeforeUnloadHandler = function (event) {
    var message;
    if (guardians) {
      !!(message = fun());
      (event || $window.event).returnValue = message;
      return message;
    } else
      $window.removeEventListener('beforeunload', onBeforeUnloadHandler );
  }

  var registerGuardian = function () {
    guardians = 1;
  };

  var unregister = function () {
    guardians = 0;
  }

  if ($window.addEventListener) {
    $window.addEventListener('beforeunload', onBeforeUnloadHandler);
  } else {
    $window.onbeforeunload = onBeforeUnloadHandler;
  }

  return {
    registerGuardian: registerGuardian,
    unregister: unregister
  };
}]);