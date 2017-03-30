angular.module('main_app').controller('header_controller',function ($scope,$http,$state,$cookies,$location) {
    var username=$cookies.get('username');
    console.log(username);
    $scope.username=username;
    $http.get("http://localhost:8888/get_profile_pic?username=" + username).success(function (dt) {
        //console.log(dt);
        //    alert(dt);
        $scope.img_usr = dt;
        // console.log(dt);
        //   console.log("dipak makvana");
        // // console.log("image"+$scope.img_usr);
    });
   $scope.request_popup=function () {
       $http.get("http://localhost:8888/get_request_notifications?username="+username).success(function (dt) {
           var data=angular.toJson(dt);
           $scope.obj=JSON.parse(data);
           console.log($scope.obj);
       });

       var s=document.getElementById("req_popup_menu");

        if(s.style.display=="none") {
              $scope.request_notified=""
        }
            else{
            $scope.request_notified=""
        }


   };

   $scope.request_notified="";

    $http.get("http://localhost:8888/get_request_count?username="+username).success(function (data) {

       var length=parseInt(data.len);
        console.log("data"+data.len);
        if(length>0){
                $scope.request_notified=length;
            }

    })

        $scope.logout=function () {
            $http.get("http://localhost:8888/logout?username="+username).success(function (data) {
                if(data=="1") {
                    $cookies.remove('username');
                    $location.path('/');
                    $state.go('log_home');
                }
            })
        }
        $scope.delete_request=function (str) {
            document.getElementById(str).style.display="none";
            $http.get("http://localhost:8888/delete_req?my="+username+"&from="+str).success(function (data) {
                if(data=="0"){

                }
            });
        }
        $scope.confirm_request=function (str) {
            document.getElementById(str).style.display="none";
            $http.get("http://localhost:8888/confirm_req?my="+username+"&from="+str).success(function (data) {
                if(data=="0"){
                    alert("something went wrong please try again in some time");
                }
            });

        }
        $scope.user_name = function (users_name) {

            return $http.get("http://localhost:8888/search?keywords="+users_name+"&my_username="+username).then(function (response) {
                var data=angular.toJson(response);
                var obj=JSON.parse(data);
                return obj.data;
            });
        };

});

