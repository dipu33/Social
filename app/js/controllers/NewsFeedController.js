/**
 * Created by prashant on 2/15/2017.
 */
angular.module("main_app").controller('NewsFeedController',function ($scope,$state,$stateParams,$timeout,$http,$cookies,$interval) {
    console.log("sadddddddddddddddd");
    var MyUserName=$cookies.get('username');
    // $scope.MyName=MyUserName;
    var count_data=0;
    $scope.TimelineUserData="";
    $http.get("http://localhost:8888/get_newsfeed?username="+MyUserName).success(function (dt) {
        $scope.TimelineUserData=dt;
        count_data=dt.length;
        console.log($scope.TimelineUserData);
    });

    $interval(function () {
        $http.get("http://localhost:8888/get_newsfeed?username="+MyUserName).success(function (dt) {
            console.log("dipak makvana0");

                angular.forEach(dt, function (dt, key) {
                    console.log(key);

                    if (key > count_data) {
                        console.log(key);
                        $scope.TimelineUserData.unshift(dt);
                    }
                })
            console.log($scope.TimelineUserData);

        });

    },3000);
});