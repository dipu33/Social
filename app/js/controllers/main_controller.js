var app=angular.module('main_app',['ngCookies','ui.router','uiRouterStyles','angularCSS','ui.bootstrap','file-model']);
app.controller('login_controll',function($scope){});
app.controller('register_controll',function ($scope) {});
app.controller('header_controller',function ($scope) {});
app.controller('timeline_controller',function ($scope) {});
app.controller('right_div_chats_controller',function ($scope){});
app.controller('ShowMyTimelineController',function ($scope) {});
app.controller('NewsFeedController',function ($scope) {});
app.controller('main_cntrl',function ($scope,$cookies) {
     $scope.right_hide=function () {
        var sel_div=document.getElementById("right");
        sel_div.style.opacity=0.3;
    }
    $scope.left_hide=function () {
        var sel_div=document.getElementById("left");
        sel_div.style.opacity=0.3;
    }
    $scope.make_default=function () {
        var sel_div=document.getElementById("left");
        sel_div.style.opacity=1.0;
        var sel_div=document.getElementById("right");
        sel_div.style.opacity=1.0;
    }
 });

app.config(['$urlRouterProvider','$stateProvider',function ($urlRouterProvider,$stateProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('ShowMyTimeline',{
            url:'/MyTimeline',

            views:{
                'main_home': {
                    templateUrl: 'ii.html',
                    css:'../css/main_home.css'
                },
                'header@ShowMyTimeline':{
                    templateUrl:'header.html',
                    css:'main_home.css'
                },
                'timeline@ShowMyTimeline':{
                    templateUrl:'MyTimeline.html',
                    css:'../css/MyTimeline.css'
                },
                'pages_div@ShowTimeLine':{

                },
                'chat_live-feed@ShowMyTimeline':{
                         templateUrl:'right_div_chats.html',
                         css:'../css/right_div_chats.css'
                }
            }
        })
        .state('show_timeline',{
            url:'/timeline:username',
            views:{
                'main_home': {
                    templateUrl: 'ii.html',
                    // controller:'login_controll',
                    css:'../css/main_home.css'
                },
                'header@show_timeline':{
                     templateUrl:'header.html',
                     css:'main_home.css'
                 },
                 'timeline@show_timeline':{
                     templateUrl:'timeline.html',
                      css:'../css/timeline.css'
                     },
                    'pages_div@show_timeline':{
                      // templateUrl:'paged_div.html',
                        //css:'../css/main_home.css'
                },
                'chat_live-feed@show_timeline':{
                    templateUrl:'right_div_chats.html',
                    css:'../css/right_div_chats.css'
                }

            }
            })

        .state('log_home',{
            views:{
                 'main_home': {
                     url: '/home',
                     templateUrl: 'index.html',
                     // controller:'login_controll',
                     css:'../css/main_home.css'
                 }

            }


        })
        .state('home_page',
            {
                url:'/',
                views:{
                    'main_home': {
                        url: '/home',
                        templateUrl: 'ii.html',
                        // controller:'login_controll',
                       css:'../css/main_home.css'
                    },
                        'header@home_page':{
                            templateUrl:'header.html',
                            css:'main_home.css'

                    },
                    'pages_div@home_page':{
                        templateUrl:'paged_div.html',
                        css:'main_home.css'
                    },
                    'chat_live-feed@home_page':{
                      templateUrl:'right_div_chats.html',
                        css:'../css/right_div_chats.css'
                    }
                    ,
                    'timeline@home_page':{
                        templateUrl:'NewsFeed.html'
                    }
                    }


            })
        .state('login',{
            views:{

                "log1":{
                    templateUrl:'login_form.html',
                    //controller:'login_controll'
                    css:'../css/index.css'

                }

            }
        })
        .state('register',
            {
                views: {

                    "reg": {
                        templateUrl: 'Register_form.html',
                        // controller:'register_controll'
                        css:'../css/index.css'

                    }
                }
            })
        }]);
app.run( function ( $state,$http,$cookies) {
    var x=$cookies.get('username');
    if($cookies.get('username')){

        $state.go('home_page');
    }

});