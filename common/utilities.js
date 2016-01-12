'use strict';

angular.
  module('utilities', [])
  .factory('$utils', [function() {
    var utilsService = {};

    utilsService.indexOf = function (array, object) {
      for (var i = 0; i < array.length; i++) {
        if (angular.equals(array[i], object)) {
          return i;
        }
      };
      return -1;
    }
    utilsService.shuffleArray = function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }

    utilsService.isEmptyArray = function(array) {
      if(array.length <= 0){
        return true;
      }
      return false;
    }

    utilsService.arrayContains = function (array, obj) {
      var i = array.length;
      while (i--) {
        if (array[i].value == obj) {
          return true;
        }
      }
      return false;
    }
    return utilsService;
  }]);
