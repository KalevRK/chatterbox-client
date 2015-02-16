// YOUR CODE HERE:

var display = function(data){
  $messages = $("#messages");
  _.each(data.results, function(item){
    var username = '<div class="username">' + item.username + '</div>';
    var text = '<div class="text">' + item.text + '</div>';
    // console.dir(data);
    // console.dir(item);
    // console.log("username: " + username);
    // console.log("text: " + text);
    $messages.append("<div class='message'>"+username+text+"</div>");
  });

};

$.ajax({
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'GET',
  contentType: 'application/json',
  success: function(data){
    display(data);
  },
  error: function(data){
    console.error("GET error");
  }
});
