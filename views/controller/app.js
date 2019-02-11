var myApp=angular.module('myApp', ["ngRoute"]);


myApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "entry.html",
        controller:'newEntry'
    })
    .when("/chat/:user", {
        templateUrl : "chat.html",
        controller:'chatCntrl'
    })
    .otherwise({
        templateUrl:"index.html"
    });
    
});


myApp.controller('newEntry',['$scope','$location','$routeParams',function($scope,$location,$routeParams){
   

    $scope.enter=function(){
      var userName = $scope.entry.userName;
      console.log(userName);
      var url="/chat/"+userName;
     // $window.location.href = '/chat';
     $location.path(url);
      
    }
}])


myApp.controller('chatCntrl',['$scope','$location','$routeParams','$timeout',function($scope,$location,$routeParams,$timeout){
    $scope.name=$routeParams.user; 
    
    var socket = io();

   
$scope.userStatus;
    $scope.online=[];




socket.on('userLeft',function(user){
    console.log($scope.online.indexOf(user));
    $scope.$apply(
    $scope.online.splice($scope.online.indexOf(user),1));
    console.log(user);


})

$scope.typeRemove=function(){
  //  console.log("remove");
   // $scope.removeCur=false;
   $scope.typeText="";
}

$scope.typeing=function(){
   // console.log("typing");
  //  $scope.removeCur=true;
    socket.emit("type",{"userName":$scope.name});
    
}

$scope.$watch(function(){
   // console.log("Watcb")
    if($scope.removeCur){
   
  //  $(".typeStatus").css("display","block");

}else{
   // $(".typeStatus").css("display","none");
}
})

socket.on('typeUser',function(data){
  
   
    $scope.$apply(function(){
    $scope.typeText=data+" is Typing..";
    $(".typeStatus").html("sasss");})

  //  $scope.$apply($scope.typeText);
    console.log( $scope.typeText);
   })
  
 






//console.log($scope.name);
socket.emit("join",$scope.name);


socket.on('getJoined',function(data){
  console.log(data);
  $scope.$apply( 
       $scope.userJoin=data,   
       $(".alert").css("display","block")
)

$timeout(function () {
    $(".alert").css("display","none");
}, 2000); 

})

   


socket.on('online',function(data){
    console.log(data);
   
    $scope.$apply(
    $scope.online=data.userName);
    
})






$scope.chatSub=function(data){
    //console.log(data);
    if(data.message!="" || data.message!="undefind"){
        $scope.inputData="";
    var post={
        "userName":$scope.name,
        "message":data
    }
    console.log(post);
    socket.emit("client",post);
}
}

var tab;
socket.on('chatMessage',function(data) {
    if(data.message=="" || data.message!=="undefind"){
        console.log("Enter message");
    $scope.getuserName=data.userName;
  var tab='<div class=" col-sm-12" ><b>'+data.userName+'</b>:'+data.message+'</div>';
  //var tab='<div class="container"><img src="profile.png" alt="'+data.userName+'">'+
            '<p>'+data.message+'</p><span class="time-right">11:00</span></div>'
   $(".chatBox").append(tab);
    }
});

}])