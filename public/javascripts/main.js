var http=require('http');

var express=require('express');
var app=express();
var fs=require('fs');
var multer  = require('../../node_modules/multer');

var mongodb=require('../../node_modules/mongodb');
var mongoclient=mongodb.MongoClient;
var server=app.listen(process.env.PORT||8888,function () {
   ////console.log("server is listing");
});

var io=require('../../node_modules/socket.io').listen(server);
var url="mongodb://localhost:27017/social";
var user_id=[];
var cnt=0;
var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, '../../app/UserImage');
    },
    filename: function (request, file, callback) {
        console.log(file);
        callback(null,Math.random()+"-"+ file.originalname);
    }
});
var upload = multer({ storage: storage });
io.sockets.on('connection',function (socket) {
    ////console.log("yes socket is connected");
    socket.on('online',function (data) {
        user_id[data]=socket.id;
       cnt++;
        console.log("cnt="+cnt+" user="+user_id[data]);
        mongoclient.connect(url,function (err,db) {
           if(err){
            console.log(err);
           }
            else{
               console.log(data+"=====ssssss");
               var collection=db.collection('friend_list');
               collection.update({"frd1":data},{$set:{"active":"1"}},{multi:true});
           }
        });
    });
    socket.on('show_message_history',function (data) {
        ////console.log(data.to);
        //console.log(socket.id);
      //  ////console.log(data.from);
        mongoclient.connect(url,function (err,db) {
            if(err){
                res.send(err);
            }
            else {
                var collection=db.collection('messages');
                collection.find(
                {$or:[{$and:[{"from_user":"d"},{"to_user":"dipak33"}]},{$and:[{"from_user":"dipak33"},{"to_user":"d"}]}]}).toArray(function (err,result) {
                    if(err){
                        res.send(err);
                    }
                    else{
                        collection.update({
                            $and:[{
                                "from_user":data.from
                            }, {
                                "to_user": data.to
                            }
                            ]
                        },{$set:{"notified":1}},{multi:true});
                        socket.emit('msg_get',result);

                    }
                })
            }
        })
    })
    socket.on('new_messges',function (data) {
        mongoclient.connect(url, function (err, db) {
            if (err) {
                res.send(err);
            }
            else {
                var collection = db.collection('messages');
                collection.insert({
                    "from_user": data.from,
                    "to_user": data.to,
                    "message": data.msg,
                    "notified":0
                });
                //console.log(data.to)
                //console.log("clientname="+user_id[data.to]);
                //console.log("clientname="+user_id[data.from]);
                socket.broadcast.emit('new_message_come',{'from':data.from,'to':data.to,'message':data.msg,'notified':0});
            }
        });
    });
});

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.get('/get_user_details',function (req,res) {
   var username=req.query.username;
  //  //////console.log(username);
    mongoclient.connect(url,function (err,db) {
        if(err){
            res.send("something went wrong please try again in sometime");
        }
        else{
            var collection=db.collection('user_register');
            collection.find({"username":username}).toArray(function (err,data) {
                if(err){
                    res.send("something went wrong");
                }
                    else{
                  //  ////console.log(data);

                    res.send(JSON.stringify(data));

                }
            })
        }
    })
});
app.get('/search',function (req,res) {
    var keywords = req.query.keywords;
    var my_username=req.query.my_username;
   // ////console.log(keywords);
        mongoclient.connect(url, function (err, db) {
//       ////console.log(keywords);
            if (err) {
                res.send(err);

              //  ////console.log("errss=" + err);
            }

            else {
                var output = [];
                var collection = db.collection('user_register');
                collection.find({
                        $and: [{username: {$regex: "" + keywords + ""}},
                            {"username": {$ne: my_username}}

                        ]
                    }).toArray(function (err, dt) {
                    if (err) {
                   //     ////console.log("err=" + err);
                        res.send(err)
                    }
                    else {
                      //  ////console.log(dt);

                        res.send(JSON.stringify(dt));


                        // data.forEach(function (item) {
                        //   output.push(item);
                        // })
                        //////console.log(output);
                    }
                })
            }
        })

});
app.get('/register',function (req,res) {
   var username=req.query.username;
   var password=req.query.password;
    var email=req.query.email;
    var b_day=req.query.b_day;
    mongoclient.connect(url,function (err,db) {
        if(err) {
            res.send(err);
        }
        else{

            var collection=db.collection('user_register');
            collection.find({
                $or:[
                    {
                        "username":username
                    },
                    {
                        "email":email
                    }
                ]
            }).toArray(function (err,data) {
               if(err){
                   res.send(0);
               }
                    else{
                        if(data.length>0)
                        {
                            res.send('3');
                        }
                            else{

                            collection.insert({
                                "username":username,
                                "password":password,
                                "email":email,
                                "b_day":b_day
                            },function (err,result) {
                                if(err){
                                    res.send("0");
                                }
                                else{
                                    res.send("1");
                                }
                            });
                        }
               }
            })
        }
    })
});
app.get('/login',function (req,res) {
    var username=req.query.username;
    var password=req.query.password;
    ////console.log(username);
    ////console.log(password);
    mongoclient.connect(url, function (err, db) {
        if (err)
            res.send(404);
        else {
            var collectinon = db.collection('user_register');
           collectinon.find({
                $and:[
                    {
                        "username":username

                    },
                    {
                        "password":password
                    }
                ]
            })
            .toArray(function (err, data) {
                    if (err) {
                        //res.json(err);
                        res.send(err);
                    }
                    else {
                        ////console.log(data.length);
                               if(data.length>0){
                                    var collection1=db.collection("active_user");
                                   collection1.insert({
                                       "username":username
                                   },function (err,result) {
                                       if(err){
                                           res.send("2");
                                       }

                                   })
                                   res.send("1");
                               }
                                else {
                                    res.send("0");
                               }
                    }
                });
        }
    });
 //    ////console.log("adasasdsa");
 //    var email=req.query.username;
 //
 //    if(email=="dipak"){
 //            res.send("yes bro");
 //        }
 //    else{
 //
 //        res.send('ok');
 //    }
 //    ////console.log(email);
 //    ////console.log("asda");
 // //   res.writeHead(200, {'Content-Type': 'text/html'});
 //    //res.send('diapk makvana');
});
app.get('/req_sending',function (req,res) {
    var my_email=req.query.fromemail;
    var to_email=req.query.toemail;
    mongoclient.connect(url,function (err,db) {
        if(err){
            res.send("0")
        }
            else{
                var collection=db.collection('user_request_notification');
                collection.insert({
                        "to_req":to_email,
                        "from_req":my_email
                },function (err,result) {
                    if(err){
                        res.send("0");
                    }
                        else{
                            res.send("1");
                    }
                })
        }

    })
});
app.get('/get_request_count',function (req,res) {
    var username=req.query.username;
    mongoclient.connect(url,function (err,db) {
        if(err){
            res.send("0");
        }
            else{
                var collection=db.collection('user_request_notification');
                collection.find({"to_req":username}).toArray(function (err,result) {
                    if(err){
                        res.send("0");
                    }
                        else{
                            var len=result.length;
                            ////console.log(len);
                            res.send({"len":len})
                    }
                })
        }

    })

});
app.get('/confirm_req',function (req,res) {
     var my_username=req.query.my;
     var from_username=req.query.from;
    ////console.log("sss="+my_username+"sadsadsadas="+from_username);
    mongoclient.connect(url,function (err,db) {
        if(err){
            res.send("0");
        }
            else{
                var collection=db.collection('user_request_notification');
                collection.remove({
                                $and:[
                                    {
                                        "to_req":my_username
                                    },
                                    {
                                        "from_req":from_username
                                    }
                                ]
            },function (err,result) {
                            ////console.log("yes it's workinggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg");
                            var collection1=db.collection('friend_list');
                            collection1.insert({
                                    "frd1":my_username,
                                    "frd2":from_username
                            },function (err,res) {
                                if(err){
                                    res.send(err);
                                }
                            })

                });
        }
    })
});
app.get('/delete_req',function (req,res) {
     var my_username=req.query.my;
     var from_username=req.query.from;
    mongoclient.connect(url,function (err,db) {
        if(err){
            res.send("0");
        }
            else{
                var collection=db.collection('user_request_notification');
                collection.remove({
                                $and:[
                                    {
                                        "to_req":my_username
                                    },
                                    {
                                        "from_req":from_username
                                    }
                                ]
            },function (err,res) {
                    if(err){
                        res.send("0")
                    }

                });
        }
    })
});
app.get('/get_request_notifications',function (req,res) {
    var username=req.query.username;
    ////console.log("username"+username);
    mongoclient.connect(url,function (err,db) {
        if(err){
            res.send("0");
        }
            else{
                var collection=db.collection('user_request_notification');
                collection.find({"to_req":username}).toArray(function (err,result) {
                    if(err){
                        res.send("0");
                    }
                        else{
                            ////console.log(result.length);
                            res.send(JSON.stringify(result));
                    }
                })
        }

    })

});
app.get('/check_friend_list',function (req,res) {
    var my_email = req.query.fromemail;
    var to_email = req.query.toemail;
    mongoclient.connect(url,function (err,db) {
        if(err){
            res.send("0");
        }
            else{
                var collection=db.collection('user_request_notification');
                collection.find({
                    $and: [{
                        to_req: to_email
                    },
                        {
                            from_req: my_email
                        }]
                }).toArray(function (err,result) {
                        if(err){
                            res.send("0");
                        }
                            else{
                                if(result.length>0) {
                                    res.send("1");
                                }
                        }
                })
        }

    })
});

app.get('/get_active_users',function (req,res) {
    var username=req.query.username;
   // console.log(username);
    mongoclient.connect(url,function (err,db) {
       if(err){
           res.send(err);
       }
        else{
          //  var collection=db.collection('active_user');
            var collection=db.collection('friend_list');
            collection.find({
                $and:[
                    {"frd2":username},
                    {"active":"1"}
                    ]
            }).toArray(function (err,result) {
                if(err){
                    res.send(err);
                  //  console.log(err);
                }
                    else{
                 ///   console.log(result.length);
                    //    console.log(JSON.stringify(result));
                        res.send(JSON.stringify(result));
                }
            });

       }
    });
});

app.get('/logout',function (req,res) {
   var username=req.query.username;
 //  console.log("sadddddddddddddddddddddddddddddddddddddddddddd");
    mongoclient.connect(url,function (err,db) {
        if(err){
            res.send(err);
        }
            else{
            var collection=db.collection('friend_list');
            collection.update({"frd1":username},{$set:{"active":"0"}},{multi:true});
            res.send("1");
        }
    })
});
app.get('/get_profile_pic',function (req,res) {
    mongoclient.connect(url, function (err, db) {
        if (err) {
            res.send("0");
        }
        else {
            var collection = db.collection('user_register');
            collection.find({"username": "d"}).toArray(function (err, result) {
                if (err) {
                    res.send(err)
                }
                else {
                   // var s=JSON.stringify(result);
             //       console.log(result[0].profile_upload);
                    var s=result[0].profile;
               //     console.log("object_file"+JSON.stringify(s));
                    console.log(s);
                    fs.readFile(s,function (err,dt) {
                        if(err){
                            console.log("eeeeeeeeeeee"+err);
                        }
                        else{
                    res.send(dt.toString('base64'))
                                                 }
                    })
                }
            });
        }
    });
});
    app.post('/profile_pic_uploader',function (req,res) {
    //console.log(req.file[0]);
    console.log(req.file);
    // var temp_usr_image=req.query.usr_image;
    // console.log("sssssssssssssssssssssss==="+temp_usr_image);
    // //var usr_image = new Buffer(temp_usr_image , 'binary').toString('base64');
    //    //console.log("usr_image==" +usr_image);
    //      mongoclient.connect(url, function (err, db) {
    //          if (err) {
    //             res.send("0");
    //     }
    //      else {
    //          var collection = db.collection('user_register');
    //          collection.update({"username": "d"}, {$set: {"profile_upload":temp_usr_image}}, function (err, dt) {
    //              if (err) {
    //                  console.log("errrrrrrrrr================"+err);
    //              }
    //              else {
    //                //  console.log(dt)
    //            }
    //          });
    //          res.send("1");
    //     }
    //  })

    // fs.readFile(req.file.path, function(err, data){
    //     console.log(data);
    // });
     console.log("yes bro it working very well");
    res.send("s");
      });
app.post('/ttt',upload.single('file'),function (req,res) {
    if (req.file) {
        mongoclient.connect(url,function (err,db) {
            if(err){
                res.send(err);
            }
            else{
               var collection=db.collection('user_register');
                collection.update({"username":"d"},{$set:{"profle":req.file.path}},function (err,dt) {
                    if(err){
                        res.send(err);
                    }
                    else {
                        res.send(dt);
                    }
                });
            }
        })
    }


});
app.get("/get_timeline_pic",function (req,res) {
    var username=req.query.username;
    console.log(username);
    mongoclient.connect(url,function (err,db) {
        if(err){
            res.send(err);
        }
            else{
            var collection=db.collection("user_register");
           collection.find({"username":username}).toArray(function (err,data) {
                if(err){
                    res.send(err);
                }
                    else{
                    var str=data[0].Timeline;
                    fs.readFile(str,function (err,img_str) {
                        if(err){
                            res.send(err);
                        }
                            else{
                            res.send(img_str.toString('base64'));
                        }
                    })
                }
            })
        }

    })
});
app.post('/UploadImage',upload.single('file'),function (req,res){
    console.log("asddddddddd");
    if(req.file){
        var username=req.body.username;
        console.log("asddddddddd11d");
        console.log(req.body.username);
        console.log("asdddddddddd");
        console.log(req.file.path)
        mongoclient.connect(url,function (err,db) {
            if(err){
                res.send(err)
            }
            else{
                var collection=db.collection('UserImage');
                collection.insert({"username":username,"ImageUrl":req.file.path},function (err,result ) {
                    if(err){
                        res.send("something wrong please try again in sometime")
                    }
                    else{
                        res.send("post successfully")
                    }
                })
            }
        })
    }
    else{
        res.send("please select a file");
    }
});
app.get('/get_timeline_photos',function (req,res) {
    var username=req.query.username;
    console.log(username);
    mongoclient.connect(url,function (err,db) {
       if(err){
           res.send(404);
       }
       else{
           var collection=db.collection('UserImage');
           collection.find({"username":username}).toArray(function (err,result) {
               if(err){
                   res.send(404);
               }
                else{
                   console.log("ddddddddddddddddddddddd======"+result.length);
                        result.forEach((function (element,index) {
                               result[index].ImageUrl=fs.readFileSync(element.ImageUrl,'base64');
                        }));
                   console.log(result[0])
                        res.send(JSON.stringify(result.reverse()));
               }
           })
       }
    });
});
app.get('/get_newsfeed',function (req,res) {
    var username=req.query.username;
    mongoclient.connect(url,function (err,db) {
      if(err){
          res.send(404);
      }
        else{
          var collection=db.collection('friend_list');
          collection.aggregate([{
              $lookup:{
                  from:"UserImage",
                  localField:"frd2",
                  foreignField:"username",
                  as:"UserDetails"
              }
          },{
                  $unwind:"$UserDetails"
              },
              {$match:{"frd1":username}}
          ]).toArray(function (err,result) {
                if(err){
                    res.send(404)
                }
                    else{
                        result.forEach(function (element,index) {
                          element.UserDetails.ImageUrl=fs.readFileSync(element.UserDetails.ImageUrl).toString('base64');
                        });

                    console.log(result);
                        res.send(result.reverse());
                }
          })
      }
    });
})
// // app.get('/send_message',function (req,res) {
// //     var from_user = req.query.from_user;
// //     var to_user = req.query.to_user;
// //     var message = req.query.msg;
// //     ////console.log(from_user);
// //     ////console.log(to_user);
// //     ////console.log(message);
// //     mongoclient.connect(url, function (err, db) {
// //         if (err) {
// //             res.send(err);
// //         }
// //         else {
// //             var collection = db.collection('messages');
// //             collection.insert({
// //                 "from_user": from_user,
// //                 "to_user": to_user,
// //                 "message": message,
// //                 "notified":0
// //             })
// //         }
// //     });
// // });
// app.get('/get_message',function (req,res) {
//     var from_user=req.query.from_user;
//     var to_user=req.query.to_user;
//     ////console.log("username1="+from_user);
//     ////console.log("username3="+to_user);
//     mongoclient.connect(url,function (err,db) {
//         if(err){
//             res.send(err);
//         }
//             else {
//             var collection=db.collection('messages');
//             collection.find({
//                 $and:[{
//                     "from_user":from_user
//                 }, {
//                     "to_user": to_user
//                 }
//                 ]
//             }).toArray(function (err,result) {
//                 if(err){
//                     res.send(err);
//                 }
//                     else{
//
//                     collection.update({
//                         $and:[{
//                             "from_user":from_user
//                         }, {
//                             "to_user": to_user
//                         }
//                         ]
//                     },{$set:{"notified":1}},{multi:true});
//                         res.send(JSON.stringify(result));
//                     }
//             })
//         }
//     })
// });
//
// app.get('/get_new_message',function (req,res) {
//    var username=req.query.username;
//     mongoclient.connect(url,function (err,db) {
//         if(err){
//             res.send(err);
//         }
//             else{
//                 ////console.log("dddddddddddddddddddddddddddddddddddddddddddddddddddddddddd="+username);
//             var collection=db.collection("message");
//             collection.find({
//                 "to_user":username,
//                 "notified":0
//             }).toArray(function (err,result) {
//                if(err){
//                    res.send(err);
//                }
//                 else {
//                     collection.update({
//                        "to_user":username
//                    },{$set:{"notified":1}},{multi:true});
//                    ////console.log("result="+result);
//                        res.send(JSON.stringify(result));
//                }
//             });
//         }
//     })
// });