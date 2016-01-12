'use strict';

angular.module('aurora.questions')
    .controller('passageController', function ($scope, $document, $uibModal) {

        $scope.answers = [];
        $scope.currentanswer = null;
        $scope.questionData = "";


        //$scope.tinymceOptions = {
        //    trusted: true,
        //    init_instance_callback: function (editor) {
        //        var myNodeList = document.querySelectorAll(".mce-tinymce .mce-btn");
        //        [].forEach.call(myNodeList, function (item) {
        //            item.ontouchend = function (event) {
        //                event.stopPropagation();
        //            };
        //            item.ontouchstart = function (event) {
        //                event.stopPropagation();
        //            };
        //        });
        //    },
        //    inline: false,
        //    skin_url: 'assets/tinymce-skins/aurora-skin',
        //    skin: 'aurora-skin',
        //    theme: 'modern',
        //    mode: "exact",
        //    height : 250,
        //    paste_auto_cleanup_on_paste : true,
        //    paste_preprocess : function(pl, o) {
        //        // Content string containing the HTML from the clipboard
        //    },
        //    paste_postprocess : function(pl, o) {
        //        // Content DOM node containing the DOM structure of the clipboard
        //    },
        //    plugins: [
        //        "paste"
        //    ],
        //    menubar: false,
        //    statusbar: false,
        //    toolbar1: "underline",
        //    toolbar_items_size: 'large'
        //};



        $scope.$watch('question', function (newValue, oldValue) {
            if(newValue.idealAnswers){
                $scope.answers = newValue.idealAnswers;
            }
            if(newValue.content){
                var element = newValue.content;
                    if(angular.isDefined(element)) {
                        if($scope.questionData.indexOf(element) < 0)
                            $scope.questionData += element;
                    }
            }
            if (!newValue.header) {
                $scope.question.header = "Highlight in the next paragraph";
            }
        });

        $scope.$watch('answers', function (newValue, oldValue) {
            $scope.question.idealAnswers = $scope.answers;
        }, true);

        $scope.$watch('questionData', function (newValue, oldValue) {
            $scope.question.content =  $scope.questionData;
            if(angular.isDefined(newValue) && newValue.indexOf("underline") != -1 ){
                $scope.answers = [];
                $scope.question.content =  "";
            } else if(angular.isDefined(newValue) &&  newValue.indexOf("underline") == -1 && angular.isDefined(oldValue) && oldValue.indexOf("underline")!= -1){
                $scope.answers = [];
                $scope.question.content =  $scope.questionData;
            }
        });



        $scope.addAnswer = function ($event){
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
                for(var answers in $scope.answers){
                    if(angular.equals(answer,$scope.answers[answers])){
                        $scope.answers.splice(answers, 1);
                    }
                }
            } else {
                if ($event.target.nodeName != "SPAN") {
                    $event.target.classList.add("badge");
                }else {
                    $event.target.parentNode.classList.add("badge");
                }
                $scope.answers.push(answer);
            }
        };


        $scope.splitIntoWords = function (div) {
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
                                    if(angular.isDefined( $scope.answers)){
                                        for(var y = 0; y <  $scope.answers.length; y++){
                                            if( $scope.answers[y].id == (words.length)*(j+1) &&  $scope.answers[y].value == words[j]){
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







    //    $scope.handleUnderLineWord = function (container ,revertFlag) {
    //        if (container.children) {
    //            if(revertFlag){
    //                for (var i = 0; i < container.children.length; i++) {
    //                    if (container.children[i].style.textDecoration == 'none') {
    //                        container.children[i].style.textDecoration = 'underline';
    //                        container.children[i].removeAttribute("id");
    //                    }
    //                }
    //            }else {
    //                for (var i = 0; i < container.children.length; i++) {
    //                    if (container.children[i].style.textDecoration == 'underline') {
    //                        var temp = new Answer($scope.answers.length)
    //                        container.children[i].id = container.children[i].tagName + temp.id;
    //                        temp.HTMLid = container.children[i].id;
    //                        temp.value = container.children[i].innerText.trim();
    //                        temp.id = 'txt' + temp.id;
    //                        //container.children[i].innerHTML = ' <input type="text" name="name"  style="width:50px" placeholder="" id="txt' + temp.id + '"> </input>';
    //                        container.children[i].style.textDecoration = 'none';
    //                        $scope.answers.push(temp);
    //                    }
    //                    if (container.children[i].children.length > 0) {
    //                        $scope.handleUnderLineWord(container.children[i].children);
    //                    }
    //                }
    //                if($scope.question.content.indexOf(container.outerHTML) < 0)
    //                    $scope.question.content += container.outerHTML;
    //            }
    //        }
    //    }
    //
    })

var Answer = function (id) {
    this.id = id;
    this.HTMLid = '';
    this.value = "";
}