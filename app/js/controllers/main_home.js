/**
 * Created by prashant on 12/7/2016.
 */
var usr_app=angular.module('user_app',['ui.router','uiRouterStyles']);
user_app.controller('user_home_cntrl',function ($scope) {});
user_app.config($urlRouterProvider,$stateProvider,function ($urlRouterProvider,$stateProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProviderr
        .state('home_page',{
            views:{
                "header":{
                    templateUrl:'header.html',
                    data:{
                        css:'css/main_home.css'
                    }
                }
            }
        })
})