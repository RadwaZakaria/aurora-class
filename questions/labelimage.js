'use strict';

angular.module('aurora.questions')
    .controller('labelimageController', function ($scope, $uibModal, $document, $compile) {
        //attachment1436358182
      //  $scope.backgroundImage = "assets/images/changeBackground.png";
        $scope.backgroundImagestyle = { 'background-image': 'url(assets/images/hammamfortest.jpg)' }
        $scope.dropZone = angular.element($document[0].querySelector('#dropZone'));
        Resize.setContainner($scope.dropZone);


        function initScope(scope) {

/*            var listener = $scope.$watch(function () {
                    return $document[0].querySelector('#dropZone').outerHTML;
            }, function(val) {
                $scope.question.content = val;
            });
            $scope.$on('$destroy', function() {
                listener();
            });*/
            $scope.mainLists = [];
            $scope.$watch('question', function (newValue, oldValue) {
                
                    if (newValue.header)
                        $scope.question.header = newValue.header;
                    else
                        $scope.question.header = "select the suitable answer";

                    Div.clearDivs();
                    if (newValue.mainLists) {
                        $scope.question.idealAnswers = [];

                        //$scope.dropZone.children = [];
                        $scope.dropZone.innerHTML = '';
                        for (var i = 0; i < $scope.dropZone[0].children.length; i++) {
                            var divElement = $scope.dropZone[0].children[i];
                            if (divElement.classList.contains('editable-div')) {
                                angular.element($scope.dropZone[0].children[i]).remove();
                                i = i - 1;
                            }
                        }
                        $scope.mainLists = newValue.mainLists;
                        $scope.backgroundImagestyle = newValue.backgroundImagestyle;
                        for (var i = 0; i < $scope.mainLists.length; i++) {
                            var tempDiv = $scope.mainLists[i].div;
                            $scope.createDraggableComp(i, tempDiv.dim.x, tempDiv.dim.y, tempDiv.dim.width, tempDiv.dim.height, tempDiv.id);
                        }
                        for (var i = 0; i < $scope.mainLists.length; i++) {
                            for (var j = 0; j < $scope.mainLists[i].items.length; j++) {
                                if ($scope.mainLists[i].items[j].isCorrectAnswer) {
                                    var answer = new Answer($scope.mainLists[i].items[j].id);
                                    answer.value = $scope.mainLists[i].items[j].text;
                                    $scope.question.idealAnswers.push(answer);
                                }
                            }
                        };
                    }
            });
            $scope.$watch('mainLists', function (newValue, oldValue) {
                $scope.question.mainLists = $scope.mainLists;

            });
            $scope.$watch('backgroundImagestyle', function (newValue, oldValue) {
                $scope.question.backgroundImagestyle = $scope.backgroundImagestyle;
            });


        }
        $scope.answer = true
        initScope($scope);

        $scope.addList = function () {
            $scope.question.idealAnswers.push({'id' : '', 'value' :'',listId :$scope.mainLists.length});
            var newList = new list($scope.mainLists.length);
            var newItem = new item($scope.mainLists.length + '_' + newList.items.length);
            newList.items.push(newItem);
            $scope.mainLists.push(newList);
            var index = $scope.mainLists.length - 1;
            newList.div = Div.fromElement($scope.createDraggableComp(index));
        }

        $scope.createDraggableComp = function (index, xx, yy, widthP, heightP,divId) {
            var comp = new Div.Init({
                x: xx || 0,
                y: yy || 0,
                width: widthP || 150,
                height: heightP || 50,
                draggableZone: $scope.dropZone,
                componentData: []
            });

            if (divId)
            comp.id = divId;

            comp.innerHTML = ' <div > ' +
                                ' <div>' +
                                '     <ui-select required data-ng-model="userAnswer[' + index + '].value" id="ddl' + index + '">' +
                                '       <ui-select-match placeholder="{{question.mainLists[' + index + '].selected}}">{{$select.selected.text}}</ui-select-match>' +
                                '     <ui-select-choices repeat="item.id as item in question.mainLists[' + index + '].items  | filter: { text: $select.search }">' +
                                '       <div data-ng-bind-html="item.text | highlight: $select.search"></div>' +
                                ' </ui-select-choices>' +
                                ' </ui-select>' +
                                ' </div>' +
                                ' </div>';
            $scope.dropZone.append(comp);
            $compile(comp)($scope);
            return comp;
        };

        $scope.additem = function (sender) {

            var list = sender.list;
            var temp = new item(list.id+ '_'+ list.items.length);
            list.items.push(temp);
        };


        $scope.deleteitem = function (sender) {
            var parentList = sender.$parent.list;
            if (parentList.items.length > 1) {
                var index = parentList.items.indexOf(sender.item);
                if (index === -1) {
                    return false;
                }
                parentList.items.splice(index, 1);
            }
            else if (parentList.items.length = 1) {
                alert('Sorry,at least one item must be exist');
            }
        };

        $scope.saveContent = function (){
            $scope.question.content = $document[0].querySelector('#dropZone').outerHTML;
        }

        $scope.removeList = function (sender) {
            var removeList =sender.list;
            var removedObj = removeList.div;
            var indexList = $scope.mainLists.indexOf(removeList);
            var indexComp = -1;
            var divsArray = Div.getDivs();
            for (var i = 0; i < divsArray.length; i++) {
                if (removedObj.id == divsArray[i].element.id) {
                    removedObj = divsArray[i];
                    indexComp = i;
                    i = divsArray.length;;
                }
            }
            if (indexList === -1) {
                return false;
            }
            //if (removedObj)
            //removedObj.deselect();
            divsArray.splice(indexComp, 1);
            $scope.mainLists.splice(indexList, 1);
            var removedDiv = $document[0].querySelector('#' + removedObj.element.id);
            angular.element(removedDiv).remove();
        };

        $scope.onchecked = function (container) {
            var sender = event.currentTarget
            var isChecked = sender.checked;
            if (container.answer != $scope.currentanswer) {
                $scope.currentanswer.isCorretedAnswer = !isChecked;
                $scope.currentanswer = container.answer;
            }
            $scope.currentanswer.isCorretedAnswer = isChecked;
        };

        $scope.onchecked = function (sender) {
            var target = event.currentTarget
            var isChecked = target.checked;
            if (sender.item != sender.$parent.list.selectedItem) {
                var indexItem = sender.$parent.list.items.indexOf(sender.$parent.list.selectedItem);
                if (indexItem === -1) {

                }
                else {
                    sender.$parent.list.items[indexItem].isCorrectAnswer = !isChecked;
                }
                sender.$parent.list.selectedItem = sender.item;
            }
            $scope.question.idealAnswers = [];
            for(var i=0;i< $scope.mainLists.length;i++) {
                for(var j = 0; j < $scope.mainLists[i].items.length; j++){
                    if($scope.mainLists[i].items[j].isCorrectAnswer){
                        var answer = new Answer($scope.mainLists[i].id);
                        answer.value = $scope.mainLists[i].items[j].text;
                        $scope.question.idealAnswers.push(answer);
                    }
                }
            };
        };

        $scope.changeBackground = function () {
            var modalInstance = $uibModal.open({
                templateUrl: '../common/library.html',
                controller: 'librarycontroller',
                backdrop: 'static',
                resolve: {
                    selectedObj: function () {
                        return null;
                    },
                    searchType: function () {
                        return 'Image';
                    },
                    data: function () {
                        return  null;
                    }
                }
            });
            modalInstance.result.then(function (newImageDetails) {
                var control = null;
                if (newImageDetails) {
                    //var imageTemplate = document.createElement('img')
                    if (newImageDetails.asset.type == "Image") {
                        $scope.question.image = { uid: newImageDetails.asset.uid, title: newImageDetails.asset.name, targetURL: newImageDetails.asset.attachment.url, type: ToolBoxType.Upload, format: newImageDetails.asset.type, thumbURL: newImageDetails.asset.attachment.small }
                    }
                }
            });
        };
    })

var list = function (id) {
    this.id = id;
    this.items = [];
    this.selectedItem='';;
    this.div;
    
}

var item = function (id) {
    this.id = id;
    this.text = '';
    this.isCorrectAnswer = false;
}
var Answer = function (id) {
    this.id = id;
    this.value = "";
}


