'use strict';

angular.module('aurora.questions').controller('blanksController', function ($scope, $document,$uibModal ,$translate ,$rootScope ) {

    $translate(['quiz.quizzes','quiz.fillHeader']).then(function(t){
        //$rootScope.pageTitle = t['quiz.quizzes'];
        $scope.fill = t['quiz.fillHeader'];
    });

        $scope.answers = [];
        $scope.currentanswer = null;
        $scope.questionData = "";
        $scope.audioLibrary = "";
        $scope.videoLibrary = "";
        $scope.imgLibrary = "";

        $scope.tinymceOptions = {
            trusted: true,
            init_instance_callback: function (editor) {
                var myNodeList = document.querySelectorAll(".mce-tinymce .mce-btn");
                [].forEach.call(myNodeList, function (item) {
                    item.ontouchend = function (event) {
                        event.stopPropagation();
                    };
                    item.ontouchstart = function (event) {
                        event.stopPropagation();
                    };
                });
            },
            inline: false,
            skin_url: 'assets/tinymce-skins/aurora-skin',
            skin: 'aurora-skin',
            theme: 'modern',
            mode: "exact",
            height : 250,
            menubar: false,
            statusbar: false,
            toolbar1: "underline",
            toolbar_items_size: 'large'
        };

        $scope.$watch('question', function (newValue, oldValue) {
            if(newValue.idealAnswers){
                $scope.answers = newValue.idealAnswers;
            }
            if(newValue.content){
                var element = angular.element(newValue.content);
                for (var i = 0; i < element.length; i++) {
                    $scope.handleUnderLinedWords(element[i], true);
                    if(angular.isDefined(element[i].outerHTML))
                        $scope.questionData += element[i].outerHTML;
                }
            }
            if (!newValue.header) {
                $scope.question.header = $scope.fill;
            }

        });

    $scope.$watch('answers', function (newValue, oldValue) {
            for (var i = 0; i < $scope.answers.length; i++) {
                $scope.answers[i].value = $scope.answers[i].value.toLowerCase();
            }
            $scope.question.idealAnswers = $scope.answers;
        });

        $scope.$watch('questionData', function (newValue, oldValue) {
            if(angular.isDefined(newValue) && newValue.indexOf("underline") != -1 ){
                var container = angular.element(newValue);
                $scope.answers = [];
                $scope.question.content = "";
                for (var i = 0; i < container.length; i++) {
                    $scope.handleUnderLinedWords(container[i]);
                }
            } else if(angular.isDefined(newValue) &&  newValue.indexOf("underline") == -1 && angular.isDefined(oldValue) && oldValue.indexOf("underline")!= -1){
                $scope.answers = [];
                $scope.question.content =  $scope.questionData;
            }
        });


        $scope.handleUnderLinedWords = function (container, revertFlag) {

            //TODO should be visited again
            if(revertFlag){
                for (var i = 0; i < container.children.length; i++) {
                    var isInputText = container.children[i].firstElementChild instanceof HTMLInputElement && container.children[i].firstElementChild.type == 'text'
                    if (isInputText) {
                        for (var i = 0; i < $scope.answers.length; i++) {
                            var answer1 = $scope.answers[i];
                            for (var j = 0; j < container.children.length; j++) {
                                if (container.children[j].id === answer1.HTMLid) {
                                    container.children[j].textContent =  answer1.value;
                                    container.children[j].style.textDecoration = 'underline';
                                    container.children[j].removeAttribute("id");
                                    break;
                                }
                            }
                        }

                    }
                }
            }else {
                if (container.children) {
                    for (var i = 0; i < container.children.length; i++) {
                        if (container.children[i].style.textDecoration == 'underline') {
                            //if(!contains($scope.answers, container.children[i].innerHTML)){
                                var temp = new Answer($scope.answers.length);
                                container.children[i].id = container.children[i].tagName + temp.id;
                                console.log(container.children[i].innerText);
                                console.log(container.children[i].innerText.trim());
                            console.log(container.children[i].innerText.trim());
                                temp.value = container.children[i].innerText.trim();
                                temp.HTMLid = container.children[i].id;
                                //container.children[i].innerHTML = ' <input type="text" name="name"  style="width:50px" placeholder="" id="txt' + temp.id + '"> </input>';
                                container.children[i].style.textDecoration = 'none';
                                temp.id = 'txt' + temp.id;
                                $scope.answers.push(temp);
                            //}
                        }
                        if (container.children[i].children.length > 0) {
                            $scope.handleUnderLinedWords(container.children[i].children);
                        }
                    }
                    if(angular.isDefined(container.outerHTML) && container.outerHTML != "") {
                        for (var i = 0; i < $scope.answers.length; i++) {
                            var answer1 = $scope.answers[i];
                            var elms = container.getElementsByTagName("span");
                            for (var j = 0; j < elms.length; j++) {
                                if (elms[j].id === answer1.HTMLid) {
                                    var elm = elms[j];
                                    elm.innerHTML = '<input type="text" spellcheck="false" class="form-control blanks-input" ng-model="question.userAnswer[' + i + '].value"  ng-init="question.userAnswer[' + i + '].HTMLid = \'' + answer1.HTMLid + '\' ;question.userAnswer[' + i + '].id = \'' + answer1.id + '\' "  id="' + answer1.id + '"> </input> ';
                                    break;
                                }
                            }
                        }
                        $scope.question.content = $scope.question.content +container.outerHTML;
                    }
                }
            }
        }
    })

var Answer = function (id) {
    this.id = id;
    this.HTMLid = '';
    this.value = "";
}