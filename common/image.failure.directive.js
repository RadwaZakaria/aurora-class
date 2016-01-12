'use strict';
/*
* To be used instead of
*
* <code> onerror="if (this.src != 'error.jpg') this.src = 'assets/images/1.jpg';"</code>
*
* just add the img tag attr <code>  az-err-src="assets/images/lessons/noImage.png" </code>
*
* */
angular.module('aurora.common').directive('azErrSrc', function() {
    return {

        //TODO need to set a default image here, it is not needed to pass the image uri to the azErrsrc attr (it may be optional)
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src != attrs.azErrSrc) {
                    attrs.$set('src', attrs.azErrSrc);
                }
            });

            attrs.$observe('ngSrc', function(value) {
                if (!value && attrs.azErrSrc) {
                    attrs.$set('src', attrs.azErrSrc);
                }
            });
        }
    }
});