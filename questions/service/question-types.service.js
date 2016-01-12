angular.
  module('aurora.questions').

  service('$questionTypes', ['$rootScope', '$utils', function($rootScope, $utils) {


        var questionTypes = {
            types : {
                MCQ: {
                    id: 1, name: "MCQ", template: "questions/templates/mcq.html", printTemplate: "questions/templates/mcq-print.html",answerTemplate: "questions/templates/mcq-view.html", controller: "mcqController", validate : function(question){
                        question.viewModel.errors = [];
                        var isValid = false;
                        for(answer in question.idealAnswers){
                            if(question.idealAnswers[answer].value){
                                isValid = true;
                            }else {
                                isValid = false;
                                break;
                            }
                        }
                        for(answer in question.options){
                            if(!question.options[answer].value || !isValid){
                                isValid = false;
                                break;
                            }
                        }

                        if(!isValid){
                            question.viewModel.errors.push("You must fill in all answers and Add at least one correct answer");
                            question.viewModel.isValid = false;
                        }else {
                            question.viewModel.isValid = true;
                        }
                        return isValid;
                    }
                },
                ESSAY: {
                    id: 2, name: "Essay", template: "questions/templates/essay.html", printTemplate: "questions/templates/essay-print.html", answerTemplate: "questions/templates/essay-view.html", controller: "essayController", validate : function(question){
                        //OK
                        question.viewModel.isValid = true;
                        return true;
                    }
                },
                MSQ: {
                    id: 3, name: "MSQ", template: "questions/templates/msq.html", printTemplate: "questions/templates/msq-print.html", answerTemplate: "questions/templates/msq-view.html", controller: "msqController", validate : function(question){
                        question.viewModel.errors = [];
                        var isValid = false;
                        for(answer in question.idealAnswers){
                            if(question.idealAnswers[answer].value){
                                isValid = true;
                            }else{
                                isValid = false;
                                break;
                            }
                        }
                        for(answer in question.options){
                            if(!question.options[answer].value || !isValid){
                                isValid = false;
                                break;
                            }
                        }
                        if(!isValid){
                            question.viewModel.errors.push("You must fill in all answers and Add at least two correct answer");
                            question.viewModel.isValid = false;
                        }else {
                            question.viewModel.isValid = true;
                        }
                        return isValid;
                    }
                },
                PASSAGE: {
                    id: 4, name: "Highlight", template: "questions/templates/passage.html", printTemplate: "questions/templates/passage-print.html", answerTemplate: "questions/templates/passage-view.html", controller: "passageController", validate : function(question){
                        question.viewModel.errors = []
                        if(question.idealAnswers != null && !$utils.isEmptyArray(question.idealAnswers)){
                            question.viewModel.isValid = true;
                            return true;
                        }else {
                            question.viewModel.errors.push("You must select at least one answer by underlining the text you want");
                        }
                        return false;
                    }
                },
                TRUE_FALSE: {
                    id: 5, name: "True/False", template: "questions/templates/truefalse.html",printTemplate: "questions/templates/truefalse-print.html", answerTemplate: "questions/templates/truefalse-view.html", controller: "trueFalseController", validate : function(question){
                        question.viewModel.errors = [];
                        if(question.idealAnswers != null && !$utils.isEmptyArray(question.idealAnswers)){
                            question.viewModel.isValid = true;
                            return true;
                        }else {
                            question.viewModel.errors.push("You must select one answer");
                        }
                        return false;
                    }
                },
                FILL_BLANKS: {
                    id: 6, name: "Fill in the blanks", template: "questions/templates/blanks.html", printTemplate: "questions/templates/blanks-print.html",answerTemplate: "questions/templates/blanks-view.html", controller: "blanksController", validate : function(question){
                        question.viewModel.errors = [];
                        if(question.idealAnswers != null && !$utils.isEmptyArray(question.idealAnswers)){
                            question.viewModel.isValid = true;
                            return true;
                        }else {
                            question.viewModel.errors.push("You must select one answer by underlining the text you want");
                        }
                        return false;
                    }
                },
                SORTING: {
                    id: 7, name: "Sort", template: "questions/templates/sorting.html", printTemplate: "questions/templates/sorting-print.html", answerTemplate: "questions/templates/sorting-view.html", controller: "sortingController", validate : function(question){
                        question.viewModel.errors = [];
                        if(question.idealAnswers != null && !$utils.isEmptyArray(question.idealAnswers)){
                            question.viewModel.isValid = true;
                            return true;
                        }else {
                            question.viewModel.errors.push("You must add at least one item to the list");
                        }
                        return false;
                    }
                },
                MATCHING: {
                    id: 8, name: "Match", template: "questions/templates/matching.html", printTemplate: "questions/templates/matching-print.html", answerTemplate: "questions/templates/matching-view.html", controller: "matchingController", validate : function(question){
                        question.viewModel.errors = [];
                        var isValid = false;
                        if(question.idealAnswers != null && !$utils.isEmptyArray(question.idealAnswers)){
                            question.viewModel.isValid = true;
                            isValid = true;
                        }else {
                            question.viewModel.errors.push("You must add an item to each list");
                        }
                        return isValid;
                    }
                },
                ATTACHMENT: {
                    id: 10, name: "Attachment", template: "questions/templates/attachment.html",printTemplate: "questions/templates/attachment-print.html", answerTemplate: "questions/templates/attachment-view.html", controller: "attachmentController", validate : function(question){
                        question.viewModel.errors = [];
                        if (question.attachmentFileUID) {
                            question.viewModel.isValid = true;
                            return true;
                        }
                        question.viewModel.errors.push("Please attach a file.");
                        question.viewModel.isValid = false;
                        return false;
                    }
                }
               /* LABEL_IMAGE: {
                    id: 9, name: "Label image", template: "questions/templates/labelimage.html", answerTemplate: "questions/templates/label-image-view.html", controller: "labelimageController", validate : function(question){
                        question.viewModel.errors = [];
                        var isValid = false;
                        if(question.idealAnswers != null && !$utils.isEmptyArray(question.idealAnswers)){
                            isValid = true;
                            if(question.idealAnswers.length != question.mainLists.length){
                                isValid = false;
                            }else{
                                for(var i = 0; i < question.idealAnswers.length; i++){
                                    if(question.idealAnswers[i].value == ""){
                                        isValid = false;
                                        break;
                                    }
                                }
                            }

                        }
                        if(!isValid){
                            question.viewModel.errors.push("You must add an item to each list");
                        }else {
                            question.viewModel.isValid = true;
                        }
                        return isValid;
                    }
                }*/
                //: {id: , name : "", template: "", controller: ""},
        },
        getTypes :function (){
          return this.types;
        },
        getReducedTypes :function (){
            var reducedTypes = angular.copy(this.types);
            for (var key in reducedTypes) {
                delete reducedTypes[key]["answerTemplate"];
                delete reducedTypes[key]["template"];
                delete reducedTypes[key]["controller"];
            }
            return reducedTypes;
        },
        getTypesArray :function (){
            var types = this.getReducedTypes();
            var arr = Object.keys(types).map(function (key) {return types[key]});
            return arr;

        },
        getType :function (id){
            for (var key in  this.types) {
                if(this.types[key].id == id){
                    return this.types[key];
                }

            }
        },
        getTypeByName :function (name){
            for (var key in  this.types) {
                if(this.types[key].name == name){
                    return this.types[key];
                }

            }
        },
        getTypeByKey :function (keyName){
            for (var key in this.types) {
                if(key == keyName){
                    return this.types[i];
                }
            }
        }

    };

      return questionTypes;
  }]);
