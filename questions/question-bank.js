/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */


'use strict';

angular.module('aurora.questions')
    .controller('questionBankController', ['$sce', '$scope', '$uibModal', '$uibModalInstance', 'list', '$api', '$filter', '$timeout', 'uiGridConstants', '$templateRequest', '$compile', '$loading','$questionTypes','$user','$translate',
        function ($sce, $scope, $uibModal, $uibModalInstance, list, $api, $filter, $timeout, uiGridConstants, $templateRequest, $compile, $loading, $questionTypes ,$user ,$translate) {

            $translate(['quiz.view','quiz.creator','quiz.id','quiz.quesHeader','quiz.type']).then(function(t){
                $scope.view=t['quiz.view'];
                $scope.creator=t['quiz.creator'];
                $scope.id=t['quiz.id'];
                $scope.quesHeader=t['quiz.quesHeader'];
                $scope.type = t['quiz.type']



                $scope.gridOptions.columnDefs = [
                    {width :70, displayName: $scope.view, field: 'id', cellTemplate: '<div class="ui-grid-cell-contents"><button class="btn btn-default" type="button" ng-click="grid.appScope.go(COL_FIELD)">{{"quiz.view"|translate}}</button></div>' },
                    //{ name: 'Id', cellTemplate: 'components/questions/templates/button-view.html' },
                    {displayName: $scope.id, field :"id" },
                    {displayName: $scope.type, field: "data.viewModel.type.name"},
                    {displayName: $scope.quesHeader, field: "data.header"},
                    // {displayName: "Question Content", field: "data.content"},
                    {displayName: $scope.creator, field: "data.viewModel.user.name", cellTemplate: '<div class="ui-grid-cell-contents" ng-show="COL_FIELD != $root.user.name">{{COL_FIELD}}</div>'}
                ];

            });

            $scope.allQuestion = [];
            $scope.mySelections = [];
            function initScope(scope) {
                $scope.myFile = {};
                $scope.url = '';
                $scope.tab = 1;
                $scope.selectedQuestion = {};
                $scope.questionsPerPage = 10;
                $scope.subjects = [];
                $scope.grades = [];

                $scope.types = $questionTypes.getTypesArray();
                $scope.subjects = $api.subjects.query();
                $scope.grades = $api.grades.query({by_school_id: $user.school_id});

                $timeout(function () {
                    $scope.subjects.unshift({name : "lessons.anySubject", id: null});
                    $scope.grades.unshift({name : "lessons.anyGrade", id: null});
                    $scope.types.unshift({name : "lessons.anyType", id: null});
                }, 2000);

                $scope.dates = [
                    { id: null,name : 'lessons.anyTime'},
                    { id: 1, name: 'lessons.today'},
                    { id: 7, name: 'lessons.last_week'},
                    { id: 30, name: 'lessons.last_month'},
                ];

                $scope.gridOptions = {
                    enableRowSelection: true,
                    enableSelectAll: false,
                    enableFullRowSelection: true,
                    enableRowHeaderSelection: false,
                    //selectionRowHeaderWidth: 35,
                    infiniteScrollRowsFromEnd: 1,
                    infiniteScrollUp: false,
                    infiniteScrollDown: true,
                    rowHeight: 45,
                    showGridFooter: true,
                    selectedItems: $scope.mySelections,
                    multiSelect: true
                };

            }

            $scope.close = function () {
                $uibModalInstance.close();
            };


            $scope.addSelectedQuestions = function () {
                var selections = [];
                var selectedRows = $scope.gridApi.selection.getSelectedRows();
                for(var i = 0; i < selectedRows.length; i++){
                    selectedRows[i].data.fromQuestionBank = true;
                    selectedRows[i].data.viewModel = {};
                    selectedRows[i].data.viewModel.type = $questionTypes.getType(selectedRows[i].data.typeId);;
                    selectedRows[i].data.viewModel.user = selectedRows[i].user;
                    selectedRows[i].data.id = selectedRows[i].id;
                    selections.push(selectedRows[i].data)
                }
                //$modalInstance.close({selectedQuestions: angular.toJson(selectedRows)});
                $uibModalInstance.close( selections );
            };

            initScope($scope);

            $scope.to_tt = function (html) {
                return $sce.trustAsHtml(html);
            }

            $scope.go = function (questionId) {
                angular.forEach($scope.allQuestion, function (item, index) {
                    var data = item.data;
                    if (item.id == questionId) {
                        $scope.question =  data;
                        $scope.gridOptions.expandableRowTemplate = $scope.question.viewModel.type.answerTemplate;
                         console.log($scope.question.viewModel.type.answerTemplate);
                         var modalInstance = $uibModal.open({
                           templateUrl: $scope.question.viewModel.type.answerTemplate,
                        //   controller: $scope.question.type.controller,//'questionPreviewController',
                        //   backdrop: 'static',
                           size: 'lg',
                           scope: $scope
                         });
                    }
                });
            }

            $scope.gridOptions.onRegisterApi = function (gridApi) {
                gridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.getDataDown);
                $scope.gridApi = gridApi;

                //console.log($scope.gridOptions);
                //gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                //    // expandableRowTemplate
                //    if (row.isExpanded) {
                //        $scope.question = row.entity.data;
                //        $scope.gridOptions.expandableRowTemplate = $scope.question.type.answerTemplate;
                //       // console.log($scope.question.type.answerTemplate);
                //       // var modalInstance = $modal.open({
                //       //   templateUrl: $scope.question.type.answerTemplate,
                //       ////   controller: $scope.question.type.controller,//'questionPreviewController',
                //       ////   backdrop: 'static',
                //       //   size: 'lg',
                //       //   scope: $scope
                //       // });
                //    }
                //});
            };

            $scope.canScrollDown = true;
            $scope.getDataDown = function() {
                if($scope.canScrollDown){
                    $loading.start('more_loading');
                    $scope.currentPage++;
                    $scope.filterQuestions(true);
                }
            };

            // $scope.gridOptions.onRegisterApi = function (gridApi) {
            //     $scope.gridApi = gridApi;
            //     gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
            //         if (row.isExpanded) {
            //             console.log(row.entity);
            //             $scope.question = row.entity;
            //             $templateRequest($scope.question.data.type.answerTemplate)
            //                 .then(function (response) {
            //                     $scope.tpl = response;
            //                     $timeout(function () {
            //                         var $elem = $compile($scope.tpl)($scope);
            //                         var elem = document.getElementById("expandable_" + $scope.question.id);
                                    
            //                         console.log($elem[0].innerHTML);
            //                         elem.innerHTML = $elem[0].innerHTML;
            //                         $scope.$digest();
            //                     }, 1000);
            //                     //console.log($elem);
            //                 });
            //         }
            //     });
            // };
            $scope.questionsPerPage = 10;
            $scope.currentPage = 1;

            $scope.filterQuestions = function(loadMore) {

                for (var i = 0; i < list.length; i++) {
                    if (list[i].id)
                        list[i] = list[i].id;
                }

                if(angular.isDefined($scope.types.selected)){
                    var typeId = $scope.types.selected.id;
                }
                if(!loadMore){
                    $loading.start('modal_loading');
                    $scope.currentPage = 1;
                }
                var questions = $api.contents.query({
                    "exclude[]": list,
                    'per': $scope.questionsPerPage,
                    'page': $scope.currentPage,
                    'by_subject_id': $scope.subjects.selected,
                    'by_content_type': "Question",
                    'by_grade_id': $scope.grades.selected,
                    'by_question_type': typeId,
                    'by_date': $scope.dates.selected,
                    'by_name': $scope.keywords
                },
                function (data) {
                    console.log(data);
                    for(var i = 0; i < data.length; i++){
                        data[i].data.fromQuestionBank = true;
                        data[i].data.viewModel = {};
                        data[i].data.viewModel.type = $questionTypes.getType(data[i].data.typeId);;
                        data[i].data.viewModel.user = data[i].user;
                        data[i].data.id = data[i].id;
                        //data[i].push(selectedRows[i].data)
                    }
                    $scope.allQuestion = data;
                    if(loadMore){
                        if(data.length != 0){
                            $scope.gridOptions.data = $scope.gridOptions.data.concat(data);
                        }else {
                            humane.log("No more questions");
                            $scope.canScrollDown = false;
                        }
                        $scope.gridApi.infiniteScroll.dataLoaded($scope.currentPage < 4);
                        $scope.gridApi.infiniteScroll.saveScrollPercentage();
                        $loading.finish('more_loading');
                    } else{
                        $scope.currentPage = 1;
                        $scope.canScrollDown = true;
                        $scope.gridOptions.data = data;
                        $loading.finish('modal_loading');
                    }
                    $scope.gridOptions.selectedItems = $scope.mySelections;

                });
            }

        }]);
