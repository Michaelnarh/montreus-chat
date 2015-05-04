function checkInputs(container) {
  var allValid = true;
  $(container).find('input').each(function () {
    var value = $(this).val();
    if (!(verifyEmptyness(value))) {
      $(this).parent().removeClass('has-error').addClass('has-success');
    } else {
      $(this).parent().addClass('has-error').removeClass('has-success');
      allValid = false;
    }


  });
  return allValid;
}
var currentUser = '';
var socket;
var USERNAME_STORAGE_KEY = 'MTChat_Username';
var nameMessageHTMLPatternBegin = "Welcome, ";
var usingNotifications;
$(function () {

  $('html').addClass('js');

  alertify.defaults.transition = "slide";
  alertify.defaults.theme.ok = "btn btn-primary";
  alertify.defaults.theme.cancel = "btn btn-danger";
  alertify.defaults.theme.input = "form-control";
  alertify.dialog('loginAlert', function factory() {
    return {
      build: function () {
        var header = '<span class="fa fa-times-circle fa-2x" ' + 'style="vertical-align:middle;color:#e10000;">' + '</span> Login';
        this.setHeader(header);
      },
      options: {
        closableByDimmer: true,
        resizable: false
      },
      callback: function (e) {
        /* alert('g');
         if(checkInputs()){                             
             connect($('#login-username-input').val(), $('#login-password-input').val());
         }else{

         }*/
      },
      prepare: function () {
        $('#login-button').click(function (e) {
          var content = $(this).parents('.ajs-dialog').eq(0).find('.ajs-content').eq(0);
          if (checkInputs(content)) {
            connect($('#login-username-input').val(), $('#login-password-input').val());
          } else {
            e.preventDefault();
            e.stopPropagation();
          }
        });
      },
      setup: function () {
        return {
          /* buttons collection */
          buttons: [

            /*button defintion*/
            {
              /* button label */
              text: 'OK',
              className: alertify.defaults.theme.ok,
              attrs: {
                id: 'login-button',
                invokeOnClose: true
              }
            }
          ]
        };

      }
    }
  }, false, 'alert');

  alertify.dialog('newUsernamePrompt', function factory() {
    return {
      build: function () {
        var header = '<span class="fa fa-times-circle fa-2x" ' + 'style="vertical-align:middle;color:#e10000;">' + '</span> Login';
        this.setHeader(header);
      },
      options: {
        closableByDimmer: true,
        resizable: false
      },
      prepare: function () {
        $('#change-username-button').click(function (e) {
          var content = $(this).parents('.ajs-dialog').eq(0).find('.ajs-content').eq(0);
          if (checkInputs(content)) {
            var oldUsername = currentUser;
            var username = $('#username-input').val();
            setLocalStorageItem(USERNAME_STORAGE_KEY, username);
            currentUser = username;
            $(".username").html(nameMessageHTMLPatternBegin + currentUser);
            socket.emit('postName', currentUser);
          } else {
            e.preventDefault();
            e.stopPropagation();
          }
        });
      },
      setup: function () {
        return {
          /* buttons collection */
          buttons: [
            /*button defintion*/
            {
              /* button label */
              text: 'OK',
              className: alertify.defaults.theme.ok,
              attrs: {
                id: 'change-username-button'
              }
            }
          ]
        };

      }
    }
  }, false, 'alert');


  alertify.dialog('errorAlert', function factory() {
    return {
      build: function () {
        var header = '<span class="fa fa-times-circle fa-2x" ' + 'style="vertical-align:middle;color:#e10000;">' + '</span> Error';
        this.setHeader(header);
      },
      options: {
        closableByDimmer: true,
        resizable: false
      },
      prepare: function () {},
      setup: function () {
        return {
          buttons: []
        };

      }
    }
  }, false, 'alert');



  login();




});


function login() {

  var isUsernameSet = false;
  try {
    if (typeof localStorage !== 'undefined') {

      usingNotifications = localStorage.getItem('MTChat_Notifications');

      var username = localStorage.getItem(USERNAME_STORAGE_KEY);

      if (username != null && !(verifyEmptyness(username))) {
        isUsernameSet = true;
        currentUser = username;
      }

    }
  } catch (e) {}


  var passwordHTML = '<div class="input-group"><label>Password</label><input type="password" class="form-control" id="login-password-input" placeholder="Enter password"></div>'

  if (_isPasswordProtected){

    if (isUsernameSet) {
      alertify
        .loginAlert('<div class="input-group"><label for="username">Your username:</label><input value="' + currentUser + '" type="text" class="form-control" id="login-username-input" placeholder="Enter username"></div>' + passwordHTML).set({
          'closableByDimmer': false,
          'overflow': false,
          'closable': false,
          'resizable': false,
          'maximizable': false
        });

    } else {
      alertify
        .loginAlert('<div class="input-group"><label for="username">Your username:</label><input type="text" class="form-control" id="login-username-input" placeholder="Enter username"></div>' + passwordHTML).set({
          'closableByDimmer': false,
          'overflow': false,
          'closable': false,
          'resizable': false,
          'maximizable': false
        });
    }

  } else {
    if (isUsernameSet) {
      connect(username, '');
    } else {
      alertify
        .loginAlert('<div class="input-group"><label for="username">Your username:</label><input type="text" class="form-control" id="login-username-input" placeholder="Enter username"></div>').set({
          'closableByDimmer': false,
          'overflow': false,
          'closable': false,
          'resizable': false,
          'maximizable': false
        });
    }

  }


}

function responsiveSidebar() {
  sidebarHTML = $('#sidebar').eq(0).clone().wrapAll('<div>').parent().html();
  $('#sidebar').mmenu();
  if ($(document).width() >= 850) {
    $('#replaceHolder').html(sidebarHTML);
  }
  $(window).resize(function () {
    $("#sidebar").trigger("close.mm");
    if ($(document).width() < 850) {
      $('#replaceHolder').html('');
    } else {
      $('#replaceHolder').html(sidebarHTML);
    }
  });
}


function setLocalStorageItem(propertyName, value) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(propertyName, value);
    }
  } catch (e) {}
}



function changeUsername() {
    alertify
      .newUsernamePrompt('<div class="form-group"><label for="username">Your current username is ' + currentUser + '.\nType in a new username:</label><input type="text" class="form-control" id="username-input" placeholder="Enter username"></div>').set({
        'closableByDimmer': false
      });
  }
  //Thanks to Jano González from SE for this
var verifyEmptyness = function (str) {
  return (str.length === 0 || !str.trim());
};
var isNumber = function (obj) {
  return (!jQuery.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0);
}
var connect = function (username, password) {
  $('body').addClass('js');
  $("html, body").scrollTop($(document).height());
  setLocalStorageItem(USERNAME_STORAGE_KEY, username);
  currentUser = username;

  $(".username").html(nameMessageHTMLPatternBegin + currentUser);
  responsiveSidebar();
  var connectionQuery = "username=" + currentUser + "&password=" + password + "&room=" + _currentRoom;
  socket = io.connect("", {
    query: connectionQuery
  });
  var messageSendForm = $('form');
  messageSendForm.submit(function (e) {
    e.preventDefault(); //For avoiding that the page auto refreshes
    e.stopPropagation();
    var messageInput = $('#messageInput').val();
    if (!verifyEmptyness(messageInput)) {
      var messageToSend = {
        message: messageInput,
        username: currentUser
      };
      socket.emit('chat message', messageToSend);
      $('#messageInput').val('');
      return false;
    }
  });


  //Notification Startup
  if (usingNotifications == true)
    changeNotificationsStatus(true);


  socket.on('old messages', function (messages) {

    var messagesContainer = $('#messages');
    var htmlMessages = '';
    for (var i = 0; i < messages.length; i++) {

      htmlMessages += '<li style="display: table; width: 100%;"><p class="alignLeft">' + messages[i].result.username + messages[i].result.usernameMessageSperator + messages[i].result.message + '</p><p class="alignRight">' + messages[i].result.time + '</p></li>';
    }

    messagesContainer.append(htmlMessages);
    $("html, body").animate({
      scrollTop: $(document).height()
    }, 1000);

  });
  socket.on('error event', function (message) {
    alertify.errorAlert(message).set({
      'closableByDimmer': false,
      'overflow': false,
      'closable': false,
      'resizable': false,
      'maximizable': false
    });;
  });

  socket.on('chat message', function (result) {
    var isBottom = false;
    if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
      isBottom = true;
    }
    $('#messages').append('<li style="display: table; width: 100%;">' + '<p class="alignLeft">' + result.username + result.usernameMessageSperator + result.message + '</p><p class="alignRight">' + result.time + '</p></li>');
    if (usingNotifications == true && result.username != currentUser)
      new Notification(result.username, {
        body: result.message
      });
    if (isBottom) {
      $("html, body").animate({
        scrollTop: $(document).height()
      }, 1000);
    }
  });
  socket.on('connections', function (userList) {

    if (userList === 1) {
      $(".connectionLabel").html("There is currently 1 user online");
    } else if (isNumber(userList) === true) {
      $(".connectionLabel").html("There are currently " + userList + " users online");
    } else {
      $(".connectionLabel").html(userList);
    }
  });
  /* This part is needed to make a responsive sidebar: */

  $('#message-send-button').click(function () {
    $('form').submit();
  });

}

function changeRoom() {
  var newRoomId = prompt("Type in the new room's id:");
  if (isNumber(newRoomId)) {
    window.location.assign("../../room/" + newRoomId);
  } else {
    alert("Invalid room ID");
  }
}

function addNotifications() {
  if (usingNotifications != true) {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status;
      }
      if (Notification.permission == "granted")
        changeNotificationsStatus(true);
    });
  } else {
    changeNotificationsStatus(false);
  }
}

var changeNotificationsStatus = function (status) {
  usingNotifications = status;
  localStorage.setItem('MTChat_Notifications', status);
  if (status == true)
    $('div #notificationButton').text('Disable Notifications');
  else
    $('div #notificationButton').text('Enable Notifications');
}
