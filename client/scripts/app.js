// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.order = 'order=-createdAt';
app.rooms = [];
app.room = '';

// app.escape = function(string) {
//   var newString = [];
//   for (var c = 0; c < string.length; c++){
//     newString.push('\\');
//     newString.push(string[c]);
//   }
//   return newString.join('');
// };

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
  // console.log($rooms.children());
  // console.log($rooms.children.length);
  if ($rooms.children().length === 0){
     app.getRooms(data);
    _.each(app.rooms, function(room){
      $("#rooms").append('<option value="' + encodeURI(room) + '">'+
        encodeURI(room) + '</option>');
    });

    $('#changeRoom').on('click',function(){
      var room = $('#newRoom')[0].value ||  $('#rooms')[0].value;
      app.room = decodeURI(room);
      app.fetch();
    });

    $('#postMessage').on('click',function(event){
      event.preventDefault();
      var text = $('#text')[0].value;
      app.send(text);
    });
  }
};

app.getRooms = function(data) {
  app.rooms = _.uniq(_.pluck(data.results, 'roomname'));
};

app.fetch = function(){
  var args = app.room ? {roomname: app.room } : ''
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
      },
      error: function(){
        console.error("POST error");
      }
    });
  };

  app.init = function(){
    this.fetch();
    app.room = 'lobby';
  // setInterval(this.send.bind(this), 5);
  setInterval(this.fetch.bind(this),2000);
};


app.init();
