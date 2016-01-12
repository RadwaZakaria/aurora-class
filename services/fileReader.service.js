angular.module('fileReader', [])
    .service('$fileReader', function($http, $q) {
    var _this = this;

    this.promiseToHaveData = function() {
        var defer = $q.defer();

        $http.get('samples/quiz.json')
            .success(function(data) {
                angular.extend(_this, data);
                defer.resolve();
            })
            .error(function() {
                defer.reject('could not find someFile.json');
            });

        return defer.promise;
    }
});
