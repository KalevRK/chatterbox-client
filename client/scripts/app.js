// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.order = 'order=-createdAt';
app.rooms = [];
app.room = '';


$(document).ready(function(){
    $('#postMessage').on('click',function(event){
      event.preventDefault();
      var text = $('#text')[0].value;
      app.send(text);
    });

    $('#rooms').change(function(){
      var room =  $('#rooms')[0].value;
      app.room = decodeURI(room);
      app.fetch(room);
    });
  });

app.display = function(data){
  x= data;
  $messages = $("#messages");
  $messages.html('');
  // console.dir(data);
  _.each(data.results, function(item){
    var username = '<div class="username">' + item.username + '</div>';
    var timestamp = '<div class="createdAt">' + item.createdAt + '</div>';
    var text = '<div class="text">' + item.text + '</div>';
    $messages.append('<div class="chat"><div class="username"></div>' +
      '<div class="createdAt"></div><div class="text"></div></div>');

    $('.username').last().text(item.username);
    $('.createdAt').last().text(item.createdAt);
    $('.text').last().text(item.text);
  });
};

app.populateRooms = function(data){
  $rooms = $("#rooms");
  if ($rooms.children().length === 0){
     app.getRooms(data);
    _.each(app.rooms, function(room){
      $("#rooms").append('<option value="' + encodeURI(room) + '">'+
        encodeURI(room) + '</option>');
    });

    $('#makeRoom').on('click',function(){
      var room = $('#newRoom')[0].value;
      console.log(room);
      if (room){
        app.room = decodeURI(room);
        if (app.rooms.indexOf(room) === -1){
          app.rooms.push(room);
          $("#rooms").prepend('<option value="' + encodeURI(room) + '">'+
          encodeURI(room) + '</option>');
        }
        app.fetch(room);
      }
    });

  }
};

app.getRooms = function(data) {
  app.rooms = _.uniq(_.pluck(data.results, 'roomname'));
};

app.fetch = function(room){
  var args = (room !== undefined) ? {roomname: decodeURI(room) } : '';
  $.ajax({
    url: this.server,
    type: 'GET',
    data: {
      'order':'-createdAt',
      'where': args },
      contentType: 'application/json',

      success: function(data){
        app.display(data);
        app.populateRooms(data);
      },
      error: function(data){
        console.error("GET error");
      }
    });
};

app.send = function(text, roomname) {
  roomname = roomname || app.room;
  console.log(roomname);
  var data = {username: window.location.search.split("=")[1],
  roomname:roomname,
  text: text };
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(){
        console.log('SUCCESS!!!');
        app.fetch(roomname);
      },
      error: function(){
        console.error("POST error");
      }
    });
  };

  app.init = function(){
    this.fetch();
    this.room = 'lobby';
};


app.init();
