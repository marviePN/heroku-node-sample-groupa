
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3008;
var path = require('path');
var clients = [];
var add = 1;


app.use(express.static(path.join(__dirname,"public")));

function getUsersList(){
  var usersList = [];
    for (var i = 0; i < clients.length; i++){
      usersList[i] = clients[i].n;
    }
  return usersList;
}

function setUserTyping(index){
  var usersList = [];
    for (var i = 0; i < clients.length; i++){
      usersList[i] = clients[i].n; 
    }
  usersList[index] = clients[index].n + "💬 is typing " ;
  return usersList;
}

app.get('/', function(res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  clients.push(socket);

  socket.on('start', function(){
    socket.emit('nickName', "guest"+add);
    clients[clients.indexOf(socket)].n = "guest"+add;
    add++;
    io.emit('users list', getUsersList());
  });

  socket.on('send chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('set nickName', function(nickName){
    io.emit('info', "New user: " + nickName); 
    clients[clients.indexOf(socket)].n = nickName; 
    io.emit('users list', getUsersList()); 
  });

  socket.on('typing', function(){
    io.emit('typing signal', setUserTyping(clients.indexOf(socket))); 
  });

  socket.on('not typing', function(){
    io.emit('typing signal', getUsersList()); 
  });

  socket.on('disconnect', function() {
    if( clients[clients.indexOf(socket)].n == null ){
     
    }
    else{
     
      io.emit('info', "User " + clients[clients.indexOf(socket)].n + " disconnected.");
    }
    clients.splice(clients.indexOf(socket),1);
    io.emit('users list', getUsersList());
   });
});


  http.listen(port, function(){
    console.log('listening on *:' + port);
});
