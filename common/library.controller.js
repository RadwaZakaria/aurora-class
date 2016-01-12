/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */


'use strict';

angular.module('aurora.common')
    .controller('librarycontroller', ['$scope', '$uibModalInstance', '$api', '$http', '$filter', '$timeout', '$loading', '$uibModal', 'selectedObj', 'searchType', 'data', '$user' ,function ($scope, $uibModalInstance, $api, $http, $filter, $timeout, $loading, $uibModal, selectedObj, searchType, data ,$user) {
      $loading.start('loading_assets');
      $scope.selectedObj = selectedObj;
      $scope.searchType = searchType;
      function initScope(scope) {
        $scope.myFile = {};
        $scope.url = '';
        $scope.tab = 1;
        $scope.selectedImage = {
          imageType: "upload",
          name: "",
          type: "Image",
          attachment_data: ""
        };
        $scope.subjects = [];
        $scope.types = ["Any Type", "Image", "Audio", "Video", "Document"];
        $scope.grades = [];
        $scope.selectedType = '';
        $scope.assetsToBeShown = [];

        $scope.types.selected = "Any Type";

        $scope.assetImage = [];
        $scope.assetImage["Image"] = $scope.selectedImage.attachment_data;
        $scope.assetImage["Audio"] = "/assets/images/profileImg.png";
        $scope.assetImage["Video"] = "/assets/images/profileImg.png";

        $scope.dates = [
          {id: null, name: 'Any time'},
          {id: 1, name: 'lessons.today'},
          {id: 7, name: 'lessons.last_week'},
          {id: 30, name: 'lessons.last_month'},
        ];

        if ($scope.searchType != '') {
          $scope.types.selected = $scope.searchType;
        }

        $scope.images = [];
        // getAssetsFromServer();

        $scope.grades = $api.grades.query({by_school_id: $user.school_id},function(allData) {
          if (data.grade_id)
            $scope.grades.selected = data.grade_id;
          $scope.subjects = $api.subjects.query(function(d) {
            if (data.subject_id)
              $scope.subjects.selected = data.subject_id;
            $scope.subjects.unshift({name: "Any Subject", id: null});
            $scope.grades.unshift({name: "Any Grade", id: null});
            $scope.filterImages();
          });
        });
      }


      $scope.lessonsPerPage = 12;
      $scope.assets = 0;
      $scope.curCount = 0;
      $scope.currentPage = 1;
      $scope.flag = 0;

      $scope.OnLoadMoreButtonClick = function () {
        $scope.currentPage++;
        $scope.filterImages(true);
      };

      $scope.enableMoreButton = false;
      $scope.currentSearch = 0;

      $scope.filterImages = function (append) {
        $loading.start('loading_assets');
        var append = append;
        if (!append) {
          $scope.currentPage = 1;
        }
        var selectedType = $scope.types.selected;
        if (selectedType === 'Any Type')
          selectedType = '';

        var images = $api.assets.query({
          'per': $scope.lessonsPerPage,
          'page': $scope.currentPage,
          'by_subject_id': $scope.subjects.selected,
          'by_grade_id': $scope.grades.selected,
          'by_name': $scope.keywords,
          'by_type': selectedType,
          'by_date': $scope.dates.selected
        }, function () {

          if (images.length >= $scope.lessonsPerPage) {
            $scope.enableMoreButton = true;
          } else {
            $scope.enableMoreButton = false;
          }
          $scope.currentSearch = images;
          if (images.length) {
            $scope.assets = images;
            $scope.flag = 1;
          }

          if (append) {
            for (var i = 0; i < images.length; i++) {
              if ($scope.images[i].type == "Image") {
                $scope.assetsToBeShown.push({asset: images[i].attachment.url});
              } else if (images[i].type == "Audio") {
                $scope.assetsToBeShown.push({asset: "/assets/images/profileImg.png"});
              } else if (images[i].type == "Document") {
                $scope.assetsToBeShown.push({asset: "/assets/images/profileImg.png"});
              } else {
                $scope.assetsToBeShown.push({asset: "/assets/images/profileImg.png"});
              }
            }
            $scope.images = $scope.images.concat(images);
          } else {
            $scope.assetsToBeShown = [];
            $scope.images = images;
            for (var i = 0; i < $scope.images.length; i++) {
              if ($scope.images[i].type == "Image") {
                $scope.assetsToBeShown.push({asset: $scope.images[i].attachment.url});
              } else if ($scope.images[i].type == "Audio") {
                $scope.assetsToBeShown.push({asset: "/assets/images/profileImg.png"});
              } else if ($scope.images[i].type == "Document") {
                $scope.assetsToBeShown.push({asset: "/assets/images/profileImg.png"});
              } else {
                $scope.assetsToBeShown.push({asset: "/assets/images/profileImg.png"});
              }
            }
          }
          $loading.finish('loading_assets');
        });
      };

      $scope.truncateString = function(name) {
        if (name) {
          if (name.length > 15)
            return '...';
        }
      }

      $scope.getImage = function () {
        return $scope.selectedImage.type;
      }

      $scope.upload = function () {
        humane.log("Uploading...");
        $api.assets.save({asset: $scope.selectedImage}, function (data) {
          humane.log("File uploaded successfully.");
          $uibModalInstance.close({url: data.data.attachment.url, imageType: $scope.selectedImage.imageType, obj: $scope.selectedObj});
        }, function (error) {
          console.log(error);
          humane.log("Unable to upload File.");
        });
      };

      function getAssetsFromServer() {
        $scope.images = $api.assets.query(function () {
          $scope.assetsToBeShown = [];
          for (var i = 0; i < $scope.images.length; i++) {
            if ($scope.images[i].type == "Image") {
              $scope.assetsToBeShown.push({asset: $scope.images[i].attachment.url});
            } else if ($scope.images[i].type == "Audio") {
              $scope.assetsToBeShown.push({asset: "/assets/images/profileImg.png"});
            } else if ($scope.images[i].type == "Document") {
              $scope.assetsToBeShown.push({asset: "/assets/images/profileImg.png"});
            } else {
              $scope.assetsToBeShown.push({asset: "/assets/images/profileImg.png"});
            }
          }
        });
      }

      $scope.selectTab = function (setTab) {
        $scope.tab = setTab;

        if (setTab == '1') {
          $scope.selectedImage.imageType = "upload";
        }
        else if (setTab == '2') {
          $scope.selectedImage.imageType = "URL";
        }
        else if (setTab == '3') {
          $scope.selectedImage.imageType = "library";
          console.log($scope.selectedImage);
        }
      };

      $scope.selectImage = function (uid) {
        humane.log("File Attached Sucessfully!");
        $scope.images.forEach(function (image) {
          if (uid == image.uid) {
            $scope.selectedImage = image;
            $scope.selectedImage.imageType = "library";
          }
        });
        $uibModalInstance.close({asset: $scope.selectedImage, obj: $scope.selectedObj});
      }

      $scope.isSelected = function (checkTab) {
        return $scope.tab === checkTab;
      };

      $scope.addNewImge = function () {
        if (!this.newImageForm.$valid) {
          return false;
        }
        $uibModalInstance.close({asset: $scope.selectedImage, obj: $scope.selectedObj});
      };

      $scope.close = function () {
        $uibModalInstance.close();
      };

      $scope.uploadAsset = function () {
        console.log($scope);
        var modalInstance = $uibModal.open({
          templateUrl: 'components/common/upload-modal.html',
          controller: 'uploadModal',
          backdrop: 'static',
          size: 'lg',
          resolve: {
            data: function () {
              return {subject_id: data.subject_id, grade_id: data.grade_id}
            }
          }
        });
        modalInstance.result.then(function (details) {
          $loading.start("loading_assets");
          if (!details) return;
          $api.assets.get({ id: details.id }, function (data) {
            $scope.assetsToBeShown.unshift({ asset: data.attachment.url });
            $scope.images.unshift(data);
            $loading.finish("loading_assets");
          })
        })
      }
      // initialization call
      initScope($scope);

    }]).directive('whenScrolled', function () {
      return function (scope, elm, attr) {
        var raw = elm[0];

        elm.bind('scroll', function () {
          if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
            scope.$apply(attr.whenScrolled);
          }
        });
      };
    });
