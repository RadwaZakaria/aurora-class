'use strict';

angular.module('aurora.questions')
    .controller('passageController', function ($scope, $document, $uibModal,$translate ,$rootScope) {

        $scope.answers = [];
        $scope.currentanswer = null;
        $scope.questionData = "";

        $translate(['quiz.quizzes','quiz.passageHeader']).then(function(t){
            //$rootScope.pageTitle = t['quiz.quizzes'];
            $scope.passage = t['quiz.passageHeader'];

            $scope.$watch('question', function (newValue, oldValue) {
                //if(newValue.idealAnswers){
                //    $scope.answers = newValue.idealAnswers;
                //}
                //if(newValue.content){
                //    var element = angular.element(newValue.content);
                //    for (var i = 0; i < element.length; i++) {
                //        $scope.handleUnderLineWord(element[i], true);
                //        if(angular.isDefined(element[i].outerHTML)) {
                //            if($scope.questionData.indexOf(element[i].outerHTML) < 0)
                //                $scope.questionData += element[i].outerHTML;
                //        }
                //    }
                //}
                if (!newValue.header) {
                    $scope.question.header = $scope.passage;
                }
            });



        });

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
            paste_auto_cleanup_on_paste : true,
            paste_preprocess : function(pl, o) {
                // Content string containing the HTML from the clipboard
            },
            paste_postprocess : function(pl, o) {
                // Content DOM node containing the DOM structure of the clipboard
            },
            plugins: [
                "paste"
            ],
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
                    $scope.handleUnderLineWord(element[i], true);
                    if(angular.isDefined(element[i].outerHTML)) {
                        if($scope.questionData.indexOf(element[i].outerHTML) < 0)
                            $scope.questionData += element[i].outerHTML;
                    }
                }
            }
            //if (!newValue.header) {
            //    $scope.question.header = $scope.passage;
            //}
        });

        $scope.$watch('answers', function (newValue, oldValue) {
            $scope.question.idealAnswers = $scope.answers;
        }, true);

        $scope.$watch('questionData', function (newValue, oldValue) {
            $scope.question.content =  $scope.questionData;
            if(angular.isDefined(newValue) && newValue.indexOf("underline") != -1 ){
                var container = angular.element(newValue);
                $scope.answers = [];
                $scope.question.content =  "";
                for (var i = 0; i < container.length; i++) {
                    $scope.handleUnderLineWord(container[i]);
                }
            } else if(angular.isDefined(newValue) &&  newValue.indexOf("underline") == -1 && angular.isDefined(oldValue) && oldValue.indexOf("underline")!= -1){
                $scope.answers = [];
                var questionDataElement = angular.element($scope.questionData).firstElementChild;
                $scope.question.content =  $scope.questionData;
            }
        });

        $scope.handleUnderLineWord = function (container ,revertFlag) {
            if (container.children) {
                if(revertFlag){
                    for (var i = 0; i < container.children.length; i++) {
                        if (container.children[i].style.textDecoration == 'none') {
                            container.children[i].style.textDecoration = 'underline';
                            container.children[i].removeAttribute("id");
                        }
                    }
                }else {
                    for (var i = 0; i < container.children.length; i++) {
                        if (container.children[i].style.textDecoration == 'underline') {
                            var temp = new Answer($scope.answers.length)
                            container.children[i].id = container.children[i].tagName + temp.id;
                            temp.HTMLid = container.children[i].id;
                            temp.value = container.children[i].innerText.trim();
                            temp.id = 'txt' + temp.id;
                            //container.children[i].innerHTML = ' <input type="text" name="name"  style="width:50px" placeholder="" id="txt' + temp.id + '"> </input>';
                            container.children[i].style.textDecoration = 'none';
                            $scope.answers.push(temp);
                        }
                        if (container.children[i].children.length > 0) {
                            $scope.handleUnderLineWord(container.children[i].children);
                        }
                    }
                    if($scope.question.content.indexOf(container.outerHTML) < 0)
                        $scope.question.content += container.outerHTML;
                }
            }
        }

    })

var Answer = function (id) {
    this.id = id;
    this.HTMLid = '';
    this.value = "";
}