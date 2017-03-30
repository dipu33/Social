angular.module('main_app').controller('right_div_chats_controller',function ($interval,$scope,$http,$state,$cookies,$location,$compile,$timeout) {
    var username=$cookies.get('username');
    var socket1=io.connect("http://localhost:8888/");
    // $scope.count_popup=0;
    $scope.msg=[];

    $http.get("http://localhost:8888/get_active_users?username="+username).success(function (dt) {
        $scope.obj = dt;
    //    console.log($scope.obj);
    });
    $interval(function(){
        $http.get("http://localhost:8888/get_active_users?username="+username).success(function (dt) {
            $scope.obj=dt;
        });
    },2000);
    $scope.close_popup=function (s) {
        $scope.msg=[];
       var ele=document.getElementById(s);
        ele.remove();
        $interval.cancel($scope.promise1);
    };
    socket1.on('new_message_come',function (data) {
        //console.log("username=:"+data.to)
        if(data.to==username)
        {
            alert(data.to);
            $scope.msg.push(data);
            $scope.$digest();
            $scope.show_chat(data.from);
        }
    });
    $scope.send_message=function (msg,to_msg) {
            socket1.emit('new_messges',{'from':username,'to':to_msg,'msg':msg});
            var data={"from_user":username,
                      "to_user":to_msg,
                      "message":msg,
                      "notified":0   };
            $scope.msg.push(data);
        $scope.usr_msg="";
     //   $http.get("http://localhost:8888/send_message?from_user=" + username + "&to_user=" + to_msg+"&msg="+msg).success(function (dt) {});
    };
    $scope.show_chat=function (str) {
        if($scope.count_popup>0)
        {
            var elems = document.getElementsByClassName("popup-box");
            for (var k = elems.length - 1; k >= 0; k--) {
                var parent = elems[k].parentNode;
                parent.removeChild(elems[k]);
            }
            $scope.count_popup=0;
        }
        $scope.count_popup=1;
        socket1.emit('show_message_history',{'to':str,'from':username});
           socket1.on('msg_get',function (data) {
            $scope.msg=data;
           $scope.$digest();
        });
        // $scope.promise1=$interval(function () {
        //     $http.get("http://localhost:8888/get_message?from_user=" + username + "&to_user=" + str).success(function (dt) {
        //            angular.forEach(dt,function (dt,key) {
        //                if(key>$scope.msg.length) {
        //                    $scope.msg.push(dt);
        //                }
        //            });
        //     });},1000);

        var sl=document.getElementById(str);
        if(sl==null) {
            $scope.count_popup++;
            var p_box = '<div class="popup-box" id="' + str + '">';
            var p_head = '<div class="popup-head">' + str + '';
            var p_head_r = '<button ng-click="close_popup(\'' + str + '\')" style="float: right;">&#10005;</button>';
            var ps = '<ul class="popup-messages"><li ng-repeat="msg in msg ">{{msg.message}}</li></ul>';
            var input = '<form><input type="text" style="width: 80%;" ng-model="usr_msg"><input type="reset" value="send" ng-click="send_message(usr_msg,\'' + str + '\');"> </form></div>';
            var temp = $compile(p_head_r)($scope);
            var l = $compile(ps)($scope);
            var inp = $compile(input)($scope);
            angular.element(document.getElementsByTagName("body")).append(p_box);
            angular.element(document.getElementsByClassName("popup-box")).append(p_head);
            angular.element(document.getElementsByClassName("popup-head")).append(temp);
            angular.element(document.getElementsByClassName("popup-box")).append(l);
            angular.element(document.getElementsByClassName("popup-box")).append(inp);
        }

    };

});