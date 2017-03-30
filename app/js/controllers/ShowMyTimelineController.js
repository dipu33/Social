/**
 * Created by prashant on 2/4/2017.
 */
angular.module('main_app').controller('ShowMyTimelineController',['$scope','$stateParams','$state','$http','$cookies',function ($scope,$stateParams,$state,$http,$cookies) {
  //  console.log("my name is"+$cookies.get('username'));
    var MyUserName=$cookies.get('username');
    $scope.MyName=MyUserName;
   // var UserTimelineLength=0;
    $http.get("http://localhost:8888/get_profile_pic?username=" + MyUserName).success(function (dt) {
        $scope.img_usr = dt;
    });
    $http.get("http://localhost:8888/get_timeline_pic?username=" + MyUserName).success(function (dt) {
        $scope.timeline_usr_img = dt;
    });


    $scope.user_image_upload=function () {
        var file_data = $scope.user_update_image;
        if(file_data!=""){
        $scope.t=file_data;
        var UrlToUpload = "http://localhost:8888/UploadImage";
        var fd = new FormData();
        // console.log($scope.user_update_image);
        fd.append("file", file_data);
        fd.append("username",MyUserName);
        console.log(MyUserName);
        console.log(file_data);
        $http.post(UrlToUpload, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function () {
            $scope.user_update_image="";
            $scope.files="";
            alert("photo update succesfully");


        })
            }

    }
    $scope.remove_photo=function () {
        $scope.user_update_image="";
        $scope.files="";

    }
}]);

angular.module('main_app').directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    }
}]);
angular.module('main_app').directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);