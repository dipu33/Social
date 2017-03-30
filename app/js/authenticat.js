/**
 * Created by prashant on 12/5/2016.
 */

var app=angular.module('login_form',['ngRoute']);
app.config(['$routeProvider',function ($routeProvider) {
    $routeProvider
        .when('/login',{
            templateUrl:"../../../untitled7/login_form.html"
            //   controller:'login_controll'
        })
        .when('/register',{
            templateUrl:"../../../untitled7/Register_form.html"
        //    controller:'register_controll'
        }).
        otherwise({
            template:"page not found"
        });
}]);

app.controller('authentication',function ($scope) {
$scope.login=function () {
    alert(window.location);
    window.location="#login";
};
$scope.register=function () {
    window.location="#register"
};

});