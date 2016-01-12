//Interactjs wrapper for angular, this should be a dependent module for where we may use interact

angular.module('interactjs',[]).factory('azInteract', function ($window) {
    //Simply grab moment off window, then delete moment off window
    var azInteract = $window.interact;
    try {
     delete $window.interact;
    } catch (e) {
     $window.interact = undefined; /*<IE8 doesn't do delete of window vars*/
    }
    return azInteract;
});