/**
 * Created by prashant on 12/6/2016.
 */
angular.module('main_app').controller('register_controll',function ($scope,$http,$state,$filter) {
    $scope.Register=function () {
        var username=$scope.username;
        var password=$scope.password;
        var email=$scope.email;
        var b_day=$scope.bday;
        var d = new Date();
        var curr_date = b_day.getDate();
        var curr_month = b_day.getMonth();
        curr_month++;
        var curr_year = b_day.getFullYear();
        var str=curr_date + "-" + curr_month + "-" + curr_year;
        // console.log(b_day);

        // document.write(curr_date + "-" + curr_month + "-" + curr_year);        // b_day.date = $filter('date')(b_day.date, "dd/MM/yyyy"); // for conversion to string
        $http.get("http://localhost:8888/register?username="+username+"&password="+password+"&email="+email+"&b_day="+str).success(function (data) {
            if(data==1){
                alert("Register Successfully")
                $state.go('log_home');
            }
                else if(data==0){
                    alert("Registration fail");
                    $state.go('reg');
            }
                else if(data==3){{
                    alert("user already exist..please try with some different username and email");
                    $state.go('reg');
            }}
        });
    };
});