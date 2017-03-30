 // angular.module('main_app').controller('login_controller', ['$scope', '$http', function($scope, $http){}]);

 angular.module('main_app').controller('login_controll',function ($scope,$state,$http,$cookies) {
   $scope.submit=function () {
        var socket1=io.connect("http://localhost:8888/");
       var username = $scope.username;
       var password = $scope.password;

            $http.get("http://localhost:8888/login?username="+username+"&password="+password).success(function(data){
                if(data==0){
                    alert("login fail");
                    $state.go('log_home');
                }
                if(data==1){
                    $cookies.put('username',username);
                    alert("login success");
                    socket1.emit('online',username);
                    $state.go('home_page');

                }
                if(data=="2"){
                    alert("something went wrong please try again in some times");
                    $state.go('log_home');

                }

            });

   }
        });



