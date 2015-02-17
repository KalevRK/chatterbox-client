// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.order = 'order=-createdAt';
app.rooms = [];

app.display = function(data){
  x= data;
  $messages = $("#messages");
  $messages.html('');
  // console.dir(data);
  _.each(data.results, function(item){
    var username = '<div class="username">' + item.username + '</div>';
    var timestamp = '<div class="createdAt">' + item.createdAt + '</div>';
    var text = '<div class="text">' + item.text + '</div>';
    $messages.append('<div class="message"><div class="username"></div>' +
      '<div class="createdAt"></div><div class="text"></div></div>');

    $('.username').last().text(item.username);
    $('.createdAt').last().text(item.createdAt);
    $('.text').last().text(item.text);
    console.log(item);
    console.log(item.roomname);
  });
};

app.getRooms = function(data) {
  app.rooms = _.uniq(_.pluck(data.results, 'roomname'));
};

app.fetch = function(room){
  var args = room ? {roomname: room } : ''
  $.ajax({
    url: this.server,
    type: 'GET',
    data: {
      'order':'-createdAt',
      'where': args },
    contentType: 'application/json',

    success: function(data){
      app.display(data);
      app.getRooms(data);
    },
    error: function(data){
      console.error("GET error");
    }
  });


};

app.send = function() {

  var data = {username: window.location.search.split("=")[1],
              roomname:"lobby",
              text: ":(" };
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(){
      console.log('SUCCESS!!!');
    },
    error: function(){
      console.error("POST error");
    }
  });
};

app.init = function(){
  this.fetch('');
  // setInterval(this.send.bind(this), 5);
  setInterval(this.fetch.bind(this),2000);
};


app.init();
