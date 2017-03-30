<?php
if($_SERVER["REQUEST_METHOD"]=="get"){
    $angularJSData = json_decode(file_get_contents("php://input"));

// json_decode will create an object so if you need in array format
    $angularJSData = (array)$angularJSData;

    echo $angularJSData['uname'];
}
