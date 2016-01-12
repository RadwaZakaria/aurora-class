'use strict';

angular.module('aurora.common').directive('dynamicContent', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {

            scope.$watch(attrs.dynamic, function (html) {
                //if (attrs.mediasource) {
                //    var obj = angular.fromJson(attrs.mediasource);
                //    obj.HTMLComponent = obj.HTMLComponent.replace(new RegExp('&amp;', 'g'), '&');
                //    obj.HTMLComponent = obj.HTMLComponent.replace('editable-div', 'force-absolute');
                //    html = obj.HTMLComponent;
                //}

                if (attrs.mediasource) {
                    var html = attrs.mediasource
                    html = html.replace(new RegExp('&amp;', 'g'), '&');
                    html = html.replace('editable-div', 'force-absolute');
                }
                if (html != '') {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                }
            });
        }
    };
});;
