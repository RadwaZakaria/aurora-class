'use strict';
    
angular.module('aurora.common').directive('componentStatusChart', ['$log', '$compile','$rootScope', function ($log, $compile, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            component: '=?',
            list:'=?'
        },
        templateUrl: 'components/common/component-status-chart.html',
        link: function(scope, element, attrs) {
            scope.onclick = function($event){
              //console.log("sss sss");
               // console.log( $event);
            };

            if (scope.component) {
                if (angular.isUndefined(scope.component.options)) {
                    scope.component.options = {
                        //Boolean - Whether we should show a stroke on each segment
                        segmentShowStroke: true,
                        //String - The colour of each segment stroke
                        segmentStrokeColor: "#fff",
                        //Number - The width of each segment stroke
                        segmentStrokeWidth: 2,
                        //Number - The percentage of the chart that we cut out of the middle
                        percentageInnerCutout: 60, // This is 0 for Pie charts
                        //Number - Amount of animation steps
                        animationSteps: 100,
                        //String - Animation easing effect
                        animationEasing: "easeOut",
                        //Boolean - Whether we animate the rotation of the Doughnut
                        animateRotate: true,
                        //Boolean - Whether we animate scaling the Doughnut from the centre
                        animateScale: true,
                        //String - A legend template
                        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
                    };

                }
                if (angular.isUndefined(scope.component.colors)) {
                    scope.component.colors = ["#757575", "#41D7E8", "#ED4514", "#6AB45F"];
                }
            }
        }
    }
}]);
