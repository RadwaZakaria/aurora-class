'use strict';

angular.module('aurora.common')
.directive('auroraButton', function ($timeout) {
    return {
        restrict: 'AE',
        scope: {
            classbuttonclass: '@classbuttonclass',
            translatebutton: '@translatebutton',
            clicksubmit: '@clicksubmit',
            isdisabled: '@isdisabled',
            buttonngclick: '@buttonngclick'
        },
        template: ' <button  class="{{classbuttonclass}}" translate="{{translatebutton}}" clicksubmit="{{clicksubmit}}"  ng-click="{{buttonngclick}}" >{{textLoading}}</button>',
        link: function (scope, element, attrs) {
            var replacementText = attrs.clicksubmit;

            element.bind('click', function () {
                $timeout(function () {
                    if (replacementText) {
                        if (scope.clicksubmit!='')
                        //scope.textLoading = scope.clicksubmit;
                        //element.html(replacementText);
                        element[0].children[0].innerHTML = scope.clicksubmit;
                    }
                    
                    element[0].children[0].setAttribute('disabled', true);
                }, 0);
            });
        }
    }
});