'use strict';


angular.module('aurora.common').directive('mediaPlayer', ['$compile', '$templateRequest', '$api', '$cordovaService', function ($compile, $templateRequest, $api, $cordovaService) {
  return {
    restrict: 'E',
    scope: {
      url: '@',
      uid: '@',
      type: '@'
    },
    controller: function ($scope, $api, $sce) {
      // reset the old URL

      $scope.url = '';
      $scope.name = '';
      $api.media.get({uid: $scope.uid},function(data) {
        $scope.name = data.attachment.name;
        $scope.url = data.attachment.url;
      });

      $scope.truncateString = function() {
        if ($scope.name) {
          var trueName = $scope.name.substring($scope.name.indexOf('-') + 1);
          if (trueName) {
            if (trueName.length > 15)
              return '...';
          }
        }
      }
      $scope.isDownloading = false;
      $scope.onMobile = false;

      $cordovaService.ready.then(function() {
        $scope.onMobile = true;
      });
      $scope.download = function() {
        $cordovaService.ready.then(function() {
          var path = cordova.file.externalRootDirectory + "auroralms/" + $scope.name;
          window.resolveLocalFileSystemURL(
            path
            , function () {
              // file found already.
              window.resolveLocalFileSystemURL(path, function(fileEntry) {
                fileEntry.file(function(fileObject) {
                    cordova.plugins.fileOpener2.open(
                      path,
                      fileObject.type
                    );
                }, function() {
                    alert('Unexpected error.');
                });

              }, function(){});
            }, function () {
              // file hasn't been found, Download it

              new DirectoryEntry().getDirectory(cordova.file.externalRootDirectory + "auroralms/");
              console.log(cordova.file.externalRootDirectory + "auroralms/");
              var fileTransfer = new FileTransfer();
              var statusDom = document.getElementById('status');
              fileTransfer.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                  var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                  statusDom.innerHTML = perc + "% loaded...";
                } else {
                  if(statusDom.innerHTML == "") {
                    statusDom.innerHTML = "Loading";
                  } else {
                    statusDom.innerHTML += ".";
                  }
                }
              };
              var uri = $scope.url;
              //encode name as somtimes name contains spaces ans special chars
              var fileURL = cordova.file.externalRootDirectory + "auroralms/" + encodeURI($scope.name);
              $scope.isDownloading = true;
              fileTransfer.download(
                  uri,
                  fileURL,
                  function(entry) {
                    alert("Check 'auroralms' Folder for the file " + $scope.name);
                  },
                  function(error) {
                    alert("There was an error while downloading the file");
                  },
                  true
              );
            }
          );
        });
      }
    },
    templateUrl: function(elem, attr){
      if (attr.type == 'Video')
        return 'components/common/directives/media/video.template.html';
      else if (attr.type == 'Audio')
        return 'components/common/directives/media/audio.template.html';
      else if (attr.type == 'Document' || attr.type == 'Attachment')
        return 'components/common/directives/media/document.template.html';
      else
        return 'components/common/directives/media/image.template.html';
    }
  };

}]);
