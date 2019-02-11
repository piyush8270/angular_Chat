var express=require('express');
var app=express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
//var message;
//let chat11 ;
mongoose.connect("mongodb://sample:sample321@ds235243.mlab.com:35243/sampledb",{ useNewUrlParser: true }, function(err, db){
if(err){
  console.log(err)
}
console.log("connected to Database");
chat11= db.collection('chatss3');

});
//var mysql = require('mysql');
/*var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodeDB"
});*/

app.use(express.static('views'));


var chatENtry=function(data,callback){

  var sql = "INSERT INTO chat (id, user,data,time) VALUES ('','"+data.userName+"', '"+data.message+"','"+new Date()+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    callback();
  });
}



var getChat=function(){
con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM chat", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    data=result;
  });
});
}




var callback;
var userName=[];
var data=[];
var tempData;
var clients = 0;

io.on('connection', function(socket) {

  socket.on("join",function(res){

    socket.username=res;
    console.log(userName.indexOf(res))
    if(userName.indexOf(res)==-1){
    userName.push(res);}
    io.sockets.emit('getJoined',socket.username);
    io.sockets.emit('online',{"userName":userName});
    
  })

  socket.on('type',function(user){
    socket.broadcast.emit('typeUser',user.userName);
 console.log(user);
})

  
  io.emit("data","SOCKET execute");
  socket.on("client",function(res){
      console.log(res);
 tempData=res;

//  chatENtry(tempData,function(){
//   io.sockets.emit("chatMessage",tempData);
//  });
io.sockets.emit("chatMessage",tempData);
chat11.insert({ userdetails1: tempData}, function(){
  
}); 
  
})

  socket.on('disconnect', function () {
    console.log('A user disconnected');
    socket.broadcast.emit('userLeft',socket.username);
   userName.splice(userName.indexOf(socket.username),1);
   console.log(userName);
    
 });



});


http.listen(3000, function() {
   console.log('listening on *:3000');
});