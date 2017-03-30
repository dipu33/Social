    /**
 * Created by prashant on 12/9/2016.
 */
angular.module('main_app').controller('timeline_controller',['$scope','$stateParams','$state','$http','$cookies',function ($scope,$stateParams,$state,$http,$cookies) {
    var s = $stateParams.username;
    console.log("sssssssss======"+s);
    $scope.uname = s;
    var my_email = $cookies.get('username');
    console.log("saddddddddddddddddddddddd=="+my_email);
    $scope.btn_val = "Send Freind Request";
    $http.get("http://localhost:8888/get_profile_pic?username=" + my_email).success(function (dt) {
            $scope.img_usr = dt;
     });
    $http.get("http://localhost:8888/get_timeline_pic?username=" + my_email).success(function (dt) {
        $scope.timeline_usr_img = dt;
    });

    $http.get("http://localhost:8888/check_friend_list?fromemail=" + my_email + "&toemail=" + $scope.uname).success(function (data) {
        if (data == "0") {
            $scope.btn_val = "Send Freind Request";
        }
        else {
            $scope.btn_val = "Request_sent";
        }
    });
    if (s != "") {
        $scope.myvar = "initialise";
    }
    $http.get("http://localhost:8888/get_user_details?username=" + s).success(function (data) {
        $scope.uemail = data[0].email;
    });
    $scope.Request_send = function () {
        if ($scope.btn_val != "Request_sent") {
            $http.get("http://localhost:8888/req_sending?fromemail=" + my_email + "&toemail=" + $scope.uname).success(function (data) {
                if (data == "0") {
                    alert("Something  went wrong please try after some times");
                }
                else {
                    $scope.btn_val = "Request_sent";

                }
            });
        }
    };
    $scope.upload_usr_profile = function () {
        var files1=$scope.user_profile_pic;
        var uploadUrl = "http://localhost:8888/ttt";
        var fd = new FormData();
        // console.log(files1);
        fd.append('file', files1);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function () {
            console.log("profile update successfuly");
        })
    }
}]);

angular.module('main_app').directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


// angular.module('main_app').service('fileUpload', ['$http', function ($http) {
//     this.uploadFileToUrl = function(file, uploadUrl){
//         console.log(uploadUrl);
//         var fd = new FormData();
//         fd.append('file', fd);
//
//         $http.get(uploadUrl, file, {
//             transformRequest: angular.identity,
//             headers: {'Content-Type': undefined}
//         })
//
//             .success(function(){
//             })
//
//             .error(function(){
//             });
//     }
