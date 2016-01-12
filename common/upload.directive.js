'use strict';

angular.module('aurora.common')
  .directive('auroraUpload', ['$rootScope', '$api', '$loading', function ($rootScope, $api, $loading) {
    return {
      restrict: 'E',
      scope: {
				key: '=key',
        allUploadsDone: '=',  
				name: '=name',
        subjectId: '@',
        gradeId: '@',
        type: "@type"
      },
      controller: function ($scope, $api, $guard) {
        $scope.uniqueFileName = "";
        $scope.uniques = [];
        $scope.isAttachment = false;
        $scope.fileNames = [];
        $scope.finishedFile = [];  
        $scope.sizeLimit      = 105857600000; // 10MB in Bytes
        $scope.uploadProgress = [];
        $scope.flag = 0;
        $scope.creds          = {
          bucket: 'aurora-dropbox',
          access_key: 'AKIAIIOV5IY4W2WXHLXA',
          secret_key: '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'
        };

        $scope.showFile = function () {
          // console.log($scope.files);
        }

        //$scope.anotherFlag = 1;
        //var promptingFunction = function () {
        //  return 'You have unsaved work, Are you sure you want to leave now ?'
        //}
        //
        //$guard.registerGuardian(promptingFunction);
        //
        //$scope.$on('$stateChangeStart', function (event) {
        //  if ($scope.anotherFlag) {
        //    var answer = confirm('You have unsaved work, Are you sure you want to leave now ?')
        //    if (!answer) {
        //      event.preventDefault();
        //      $loading.finish('loading');
        //    }
        //  } else $scope.anotherFlag = 0;
        //});


        $scope.upload = function() {
          if (!$scope.files) return;
          AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
          AWS.config.region = 'us-west-2';
          var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });

          if ($scope.files) {
            $scope.flag = 1;
            for (var i = 0; i < $scope.files.length; i++) {
              $scope.uploadProgress.push(0);
              $scope.fileNames.push($scope.files[i].name);
            }
            // console.log($scope.uploadProgress);
          }

          if($scope.files) {
              for (var i = 0; i < $scope.files.length; i++) {
                $scope.file = $scope.files[i];
                // Perform File Size Check First
                // console.log($scope.file.size);
                var fileSize = Math.round(parseInt($scope.file.size));
                if (fileSize > $scope.sizeLimit) {
                  var msg = 'Sorry, your attachment is too big. Maximum '  + fileSizeLabel() + ' file attachment allowed'+ '\nFile Too Large';
                  humane.log(msg);
                  return false;
                }
                // Prepend Unique String To Prevent Overwrites
                $scope.uniqueFileName = $scope.uniqueString() + '-' + $scope.file.name;
              	$scope.name = $scope.file.name;
                $scope.uniques.push($scope.uniqueFileName);
                $scope.finishedFile[$scope.uniqueFileName] = -2;
                  
                var params = { Key: $scope.uniqueFileName, ContentType: $scope.file.type, Body: $scope.file, ServerSideEncryption: 'AES256' };

                var options = {partSize: 5 * 1024 * 1024, queueSize: 1};

                bucket.upload(params, options, function(err, data) {
                  // console.log(data); /
                  if(err) {
                    console.log(err.message, err.code);
                    return false;
                  }
                  else {
                    // Upload Successfully Finished
                    humane.log('File Uploaded Successfully');
                    // Reset The Progress Bar
                    setTimeout(function() {
                      $scope.uploadProgress[$scope.fileNames.indexOf($scope.file.name)] = 0;
                      $scope.$digest();
                    }, 4000);
                  }
                })
                .on('httpUploadProgress',function(progress) {
                  var key = progress.key;  
                  var index = $scope.fileNames.indexOf(key.substring(key.indexOf('-') + 1, key.length));
                  $scope.uploadProgress[index] = Math.round(progress.loaded / progress.total * 100);
                  $scope.$digest();
                }).send(function (err, data) {
                  $scope.addUrlToResources(data.key);
                });
              }
            } else {
                // No File Selected
              humane.log('Please select a file to upload');
            }
          }

        $scope.fileSizeLabel = function() {
          return Math.round($scope.sizeLimit / 1024 / 1024) + 'MB';
        };

        $scope.trackUploads = function() {
          var curFlag = 1;
          for (var file in $scope.finishedFile) {
            curFlag &= ($scope.finishedFile[file] === 1);
          }
          return curFlag;
        }

        $scope.uniqueString = function() {
          var text     = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          
          for( var i = 0; i < 8; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          return text;
        }

        $scope.truncateString = function(index) {
          if ($scope.files) {
            if ($scope.files[index]) {
              var trueName = $scope.files[index].name;
              if (trueName.length > 15)
                return '...';
            }
          }
        }

        $scope.addUrlToResources = function (key) {
          var type = 'Attachment';
          var fileName = key;
					var fileType = $scope.file.type.substring(0, $scope.file.type.indexOf('/'));
					fileType = fileType.charAt(0).toUpperCase() + fileType.slice(1);
          $scope.finishedFile[fileName] = 0;
          if (['Video', 'Audio', 'Document', 'Image'].indexOf(fileType) >= 0) {
            type = fileType;
          }
          if (!$scope.type) {
            var asset = $api.assets.save({
              asset: {
  							name: key,
                type: type,
                attachment_object: key,
                subject_id: $scope.subjectId ? $scope.subjectId : -1,
                grade_id: $scope.gradeId ? $scope.gradeId : -1
              }
            }, function () {
  						$scope.key = asset.id;
              $scope.finishedFile[fileName] = 1; 
              $scope.allUploadsDone = $scope.trackUploads();
	          }, function() {
              $scope.finishedFile[fileName] = -1;
              $scope.allUploadsDone = $scope.trackUploads();
              // alert('something went wrong');
            });
          } else {
             var asset = $api.assets.save({
              asset: {
                name: key,
                type: type,
                attachment_object: key
              }
             }, function () {
              $scope.key = asset.id;
              $scope.finishedFile[fileName] = 1;
              $scope.allUploadsDone = $scope.trackUploads();
            }, function() {
              $scope.finishedFile[fileName] = -1;
              $scope.allUploadsDone = $scope.trackUploads();
              // alert('something went wrong');
            });
          }
        }

      },
      templateUrl: 'components/common/upload.html'
    };
  }]).directive('stopEvent', function () {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          element.on(attr.stopEvent, function (e) {
            e.stopPropagation();
          });
        }
      };
    });
