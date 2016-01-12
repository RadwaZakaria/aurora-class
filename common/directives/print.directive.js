'use strict';

angular.module('aurora.common').directive('ngPrint',function () {

        var printSection = document.getElementById('printSection');
        if (!printSection) {
            printSection = document.createElement('div');
            printSection.id = 'printSection';
            document.body.appendChild(printSection);
        }



        function printElement(elem) {
            var domClone = elem.cloneNode(true);
            printSection.innerHTML = '';
            printSection.appendChild(domClone);
            window.print();
        }

        return {
            restrict: 'A',
            link:  function (scope, element, attrs) {
                element.on('click', function () {
                    var elemToPrint = document.getElementById(attrs.printElementId);
                    if (elemToPrint) {
                        printElement(elemToPrint);
                    }
                });
                window.onafterprint = function () {
                    printSection.innerHTML = '';
                }
            }

        };
});