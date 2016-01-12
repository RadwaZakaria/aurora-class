'use strict';


angular.module('aurora.questions').directive('questionPreview', function ($compile, $controller, $templateRequest, $utils, $uibModal ) {
    var linker = {
        pre: function (scope, elem, attr) {
            /*            if(scope.question.typeId == 4 ) {
             scope.dummyContent = scope.question.content;
             }*/
            if(angular.isDefined(scope.question.userAnswer) && $utils.isEmptyArray(scope.question.userAnswer)){
                scope.question.userAnswer = [];
            }
            $templateRequest(attr.template)
                .then(function (response) {
                    var tpl = response;
                    var $elem = $compile(tpl)(scope);
                    //console.log($elem);
                    elem.append($elem);
                });
        },
        post: function (scope, elem, attr){
            if(angular.isUndefined(scope.question.userAnswer)){
                scope.question.userAnswer = [];
            }
            scope.random = function (){
                return  Math.random();
            };

            // attachment-question
            if (scope.question.typeId == 10) {
                scope.attachAnswerFile = function () {

                    var modalInstance = $uibModal.open({
                        templateUrl: 'components/common/library.html',
                        controller: 'librarycontroller',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            selectedObj: function () {
                                return null;
                            },
                            searchType: function () {
                                return '';
                            }, data: function () {
                                return { subject_id: scope.question.subject_id, grade_id: scope.question.grade_id }
                            }
                        }
                    });

                    modalInstance.result.then(function (details) {
                        if (details) {
                            var imgHTML = '<div style="width:200px ;height:200px;left:200px;" id="videoPreview">' +
                                '<media-player uid="' + details.asset.uid + '" type="' + details.asset.type + '" url="' +
                                details.asset.attachment.url + '" class="videogular-container"></media-player>' + '</div>';

                            scope.question.userAnswer = [];
                            scope.question.userAnswer[0] = {uid: details.asset.uid, name: removeHyphenFromFileName(details.asset.attachment.name)};
                        }
                    });
                };
            }
            if(scope.question.typeId == 6 ) {
                scope.$watch('question.userAnswer', function (newValue, oldValue) {
                    if(angular.isDefined(newValue) ){
                        for (var i = 0; i < newValue.length; i++) {
                            if(angular.isDefined(newValue[i].value))
                                newValue[i].value = newValue[i].value.toLowerCase();
                        }
                    }
                },true);
            };
            if(scope.question.typeId == 4 ) {
                scope.addAnswer = function ($event){
                    var answer = {HTMLid: "", id: "", value: ""};
                    if($event.target.nodeName == "SPAN"){
                        var textId = $event.target.id.split("SPAN")[1];
                        answer.id = 'txt'+textId;
                        answer.value = $event.target.innerText;
                        answer.HTMLid = $event.target.id;
                    }else if ($event.target.firstElementChild != null && $event.target.firstElementChild.nodeName == "SPAN"){
                        var textId = $event.target.firstElementChild.id.split("SPAN")[1];
                        answer.id = 'txt' + textId;
                        answer.value = $event.target.firstElementChild.innerText;
                        answer.HTMLid = $event.target.firstElementChild.id;
                    } else {
                        answer.id = $event.target.id;
                        answer.value = $event.target.innerText;
                        answer.HTMLid = '';
                    }
                    if($event.target.classList.contains("badge") || ($event.target.nodeName == 'SPAN' && $event.target.parentNode.classList.contains("badge"))) {
                        if ($event.target.nodeName != "SPAN") {
                            $event.target.classList.remove('badge');
                        }else {
                            $event.target.parentNode.classList.remove('badge');
                        }
                        //removeAnswer
                        for(var userAnswer in scope.question.userAnswer){
                            if(angular.equals(answer,scope.question.userAnswer[userAnswer])){
                                scope.question.userAnswer.splice(userAnswer, 1);
                            }
                        }
                    } else {
                        if ($event.target.nodeName != "SPAN") {
                            $event.target.classList.add("badge");
                        }else {
                            $event.target.parentNode.classList.add("badge");
                        }
                        scope.question.userAnswer.push(answer);
                    }
                };

                scope.splitIntoWords = function (div) {
                    function removeEmptyStrings(k) {
                        return k !== '';
                    }
                    if(div != ""){
                        var output = [];
                        var rWordBoundary = /[\s\n\t]+/; // Includes space, newline, tab
                        var node = div;
                        var words = node.split(rWordBoundary).filter(removeEmptyStrings);
                        for (var j = 0; j < words.length; j++) {
                            var addClass = false;
                            if(angular.isDefined(scope.question.userAnswer)){
                                for(var y = 0; y <  scope.question.userAnswer.length; y++){
                                    if( scope.question.userAnswer[y].id == (words.length)*(j+1) &&  scope.question.userAnswer[y].value == words[j]){
                                        addClass = true;
                                        break;
                                    }
                                }
                            }
                            if(addClass)
                                words[j] = "<a id='"+(words.length)*(j+1)+"' class='badge' ng-click='addAnswer($event)'>" + words[j] + "</a>";
                            else
                                words[j] = "<a id='"+(words.length)*(j+1)+"' ng-click='addAnswer($event)'>" + words[j] + "</a>";
                        }
                        if (words.length) {
                            output.push.apply(output, words);
                        }
                        output.push("<br/>");
                        return output.join(' ');

                    }
                }

            }

            function removeHyphenFromFileName(name) {
                return name.substring(name.indexOf('-') + 1, name.length);
            };

            scope.previewSortableOptions = {
                orderChanged: function (event) {
                    scope.question.userAnswer = scope.question.content;
                }
            };

            scope.previewMatchingSortableOptions = {
                orderChanged: function (event) {
                    scope.question.userAnswer = [];
                    $utils.shuffleArray(scope.question.userAnswer);
                    for(var i = 0; i < Math.min(scope.question.content.questionList1.length, scope.question.content.questionList2.length); i++ ){
                        scope.question.userAnswer.push({'list1Item' : scope.question.content.questionList1[i], 'list2Item' : scope.question.content.questionList2[i]});
                    }
                },
                accept: function (sourceItemHandleScope, destSortableScope) {
                    return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                },
                itemMoved: function (event) {
                    event.source.itemScope.modelValue.status = event.dest.sortableScope.$parent.item;
                }
            };
        }
    };
    return {
        restrict: 'E',
        link: linker,
        scope: {question : '='}
    };
});
