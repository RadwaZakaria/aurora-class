'use strict';

angular.module('aurora.common', [
    'ngTouch',
    'ui.bootstrap',
    'darthwade.dwLoading',
    'ui.tinymce',
    'ngSanitize',
    'ui.select',
    'ui.sortable',
    'file-data-url',
    'colorpicker.module',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'fsCordova'
]);

angular.module('aurora.common').filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);
