'use strict';

angular.module('aurora.common')
  .directive('auroraShare', [ '$api', '$rootScope', '$loading', '$utils', '$state', function($api, $rootScope, $loading, $utils, $state) {
  return {
    restrict: 'E',
    scope: {
      id: '@id',
      type: '@type'
    },
    templateUrl: 'components/common/aurora-share.html',
    controller: function($scope) {
      // Make sure the user has access this page
      var permission = $api.users.can({
        verb: 'manage',
        object_type: $scope.type,
        object_id: $scope.id
      }, function () {
        if (!permission.granted) {
          humane.log('You don\'t have access to this page !');
          $state.go('users.home')
        }
      });
      $scope.perPage = 6;
      
      $scope.endpoints = [
        {
          title: 'groups.groups', // Translatable string to show to users
          value: 'groups', // API Service name
          icon: 'group', // Fontawesome icon
          type: 'Group', // Object type to save on the API
          attribute: 'by_name' // API Endpoint Attribute to search by
        },
        {
          title: 'users.users',
          value: 'users',
          icon: 'user',
          type: 'User',
          attribute: 'by_name_or_email'
        }
      ]; // endpoints to search
      $scope.activeEndpoint = {
        id: 0
      };

      $scope.threshold = 2; // miniumum characters to perform search query
      $scope.search = []; // search keyword(s)
      $scope.searching = []; // controls showing the progress throbber
      $scope.showMoreButton = []; // control showing the more button below suggestions
      $scope.selectedItems = []; // collect items selected
      $scope.currentPage = []; // current page of results/suggestions
      $scope.items = []; // results/suggestions
      $scope.activeItem = []; // currently selected item (when using keyboard)
      $scope.showSuggestions = []; // contols showing the list of suggestions
      angular.forEach($scope.endpoints, function (endpoint, id) {
        $scope.search[id] = '';
        $scope.searching[id] = false;
        $scope.showMoreButton[id] = false;
        $scope.currentPage[id] = 1;
        $scope.items[id] = [];
        $scope.activeItem[id] = -1;
        $scope.showSuggestions[id] = false;
        $scope.selectedItems[id] = [];
      });
      
      var shares = $api.permissions.query({
        by_object_id: $scope.id,
        by_object_type: $scope.type
      }, function () {
        $scope.shares = [];
        for (var i = 0; i < shares.length; i++) {
          if (shares[i].name.indexOf("Implicitly") < 0) {
            $scope.shares.push(shares[i]);
          }
        }
      });
      
      
      $scope.save = function (subject) {
        // Hide suggestions
        $scope.showSuggestions[$scope.activeEndpoint.id] = false;
        // Remove the subject from list of suggestions
        var index = $utils.indexOf($scope.items[$scope.activeEndpoint.id], subject);
        $scope.items[$scope.activeEndpoint.id].splice(index, 1);
        var endpoint = $scope.endpoints[$scope.activeEndpoint.id];
        // Temporary permission to be appended until saving is complete
        var item = {
          subject: subject
        };
        $scope.shares.push(item);
        // Start saving
        var permission = $api.permissions.save({
          permission: {
            name: 'Granting access to lesson by creator',
            subject_id: subject.id,
            subject_type: endpoint.type,
            action: 'access',
            object_id: $scope.id,
            object_type: $scope.type
          }
        }, function () {
          // All is well
          // Find the temporary permission we inserted
          var sharesIndex = $utils.indexOf($scope.shares, item);
          // Remove it
          $scope.shares.splice(sharesIndex, 1);
          // Add the saved permission
          $scope.shares.push(permission);
        }, function () {
          humane.log("Unable to share. Something went wrong.");
          // Something went wrong, rollback
          // Remove the temporary permission we created
          var sharesIndex = $utils.indexOf($scope.shares, item);
          $scope.shares.splice(sharesIndex, 1);
        });
      };

      $scope.manage =function (item){
        var index = $utils.indexOf( $scope.shares, item);
        if(item.action=='access'){
        var permission = $api.permissions.update({ id: item.id }, {permission: {action: 'access'}},
        function(){
               $scope.shares.splice(index, 1);
               $scope.shares.push(permission);

        }, function(){
          humane.log("Unable to manage. Something went wrong.");
          $scope.shares.splice(index, 1);
        });}
        else if(item.action=='manage'){
          var permission = $api.permissions.update({ id: item.id }, {permission: {action: 'manage'}},
              function(){
                $scope.shares.splice(index, 1);
                $scope.shares.push(permission);
              }, function(){
                humane.log("Unable to Un-manage. Something went wrong.");
                $scope.shares.splice(index, 1);
              });
        }

      };

     $scope.delete = function (item) {
        var index = $utils.indexOf($scope.shares, item);
        $scope.shares.splice(index, 1);
        $api.permissions.delete({ id: item.id });
      };
      
      $scope.getItems = function (append) {
        if ($scope.search[$scope.activeEndpoint.id].length >= $scope.threshold) {
          // Show spinner
          $scope.searching[$scope.activeEndpoint.id] = true;
          // Only hide current suggestions if we are not appending
          $scope.toggleSuggestions(append);
          var endpoint = $scope.endpoints[$scope.activeEndpoint.id];
          var list = [];
          for (var i = $scope.shares.length - 1; i >= 0; i--) {
            if ($scope.shares[i].subject._type == $scope.endpoints[$scope.activeEndpoint.id].type) {
              list.push($scope.shares[i].subject.id);
            }
          }

          if (append) {
            for (var i = 0; i < $scope.items[$scope.activeEndpoint.id].length; i++) {
              var item = $scope.items[$scope.activeEndpoint.id][i];
              if (list.indexOf(item.id) < 0) {
                list.push(item.id);
              }
            }
          }
          // Fetch items from active endpoint
          var criteria = {
            "exclude[]": list,
            per: $scope.perPage,
            page: $scope.currentPage[$scope.activeEndpoint.id]
          };
          criteria[endpoint.attribute] = $scope.search[$scope.activeEndpoint.id];
          var items = $api[endpoint.value].query(criteria, function () {
              $scope.searching[$scope.activeEndpoint.id] = false;
              $scope.toggleSuggestions(true);
              if (append) {
                $scope.items[$scope.activeEndpoint.id] = $scope.items[$scope.activeEndpoint.id].concat(items);
              } else {
                $scope.items[$scope.activeEndpoint.id] = items;
              }
              // There won't be more results if the server returned results less than the number per page
              $scope.showMoreButton[$scope.activeEndpoint.id] = (items.length == $scope.perPage);
              $scope.searching[$scope.activeEndpoint.id] = false;
          });
        }
        else {
          $scope.searching[$scope.activeEndpoint.id] = false;
          $scope.showMoreButton[$scope.activeEndpoint.id] = false;
          $scope.items[$scope.activeEndpoint.id] = [];
        }
      }

      $scope.selectItem = function (item) {
        var index = $utils.indexOf($scope.selectedItems[$scope.activeEndpoint.id], item);
        $scope.selectedItems[$scope.activeEndpoint.id].push(item);
        $api.permissions.save({
          permission: {
            name: 'Granting access to lesson by creator',
            subject_id: $scope.selectedItems[id][i].id,
            subject_type: $scope.activeEndpoint.id.type,
            action: 'access',
            object_id: $scope.id,
            object_type: $scope.type
          }
        });
        $scope.selectedItems[$scope.activeEndpoint.id].splice(index, 1);
      }

      $scope.loadMore = function () {
        $scope.currentPage[$scope.activeEndpoint.id] += 1;
        $scope.getItems(true);
      }

      $scope.toggleSuggestions = function (show) {
        $scope.showSuggestions[$scope.activeEndpoint.id] = show;
      }

      $scope.keypressCallback = function (evt) {
        switch (evt.keyCode) {
          case 13: // enter
            if ($scope.showSuggestions[$scope.activeEndpoint.id] && $scope.activeItem[$scope.activeEndpoint.id] > -1) {
              var i = $scope.activeItem[$scope.activeEndpoint.id];
              $scope.save($scope.items[$scope.activeEndpoint.id][i]);
            }
            break;
          case 27: // esc
            $scope.toggleSuggestions(false);
            break;
          case 38: // up
            if ($scope.showSuggestions[$scope.activeEndpoint.id] && $scope.activeItem[$scope.activeEndpoint.id] > 0) {
              $scope.activeItem[$scope.activeEndpoint.id] -= 1;
            }
            break;
          case 40: //down
            if ($scope.showSuggestions[$scope.activeEndpoint.id] && ($scope.items[$scope.activeEndpoint.id].length - 1) > $scope.activeItem[$scope.activeEndpoint.id]) {
              $scope.activeItem[$scope.activeEndpoint.id] += 1;
            }
            break;
        }
      }

    }
  }
}]);
