( function() {
  messages = document.querySelector('#messages');
  wsButton = document.querySelector('#wsButton');
  logout = document.querySelector('#logout');
  login = document.querySelector('#login');

  showMessage = function (message)  {
    messages.textContent += '\n'+message;
    messages.scrollTop = messages.scrollHeight;
  };

  handleResponse = function(response) {
    var toreturn;
    if (response.ok){
      toreturn = response.json().then(function (data) {JSON.stringify(data, null, 2);});
    }
    else {
      throw 'Unexpected response';
    }
    return toreturn;
  };

  login.onclick = function()  {
    fetch('/login', { method: 'POST', credentials: 'same-origin' })
      .then(handleResponse)
      .then(showMessage)
      .catch(function(err) {showMessage(err.message);});
  };

  logout.onclick = function()  {
    fetch('/logout', { method: 'DELETE', credentials: 'same-origin' })
      .then(handleResponse)
      .then(showMessage)
      .catch(function(err){ showMessage(err.message);});
  };

  var ws;

  wsButton.onclick = function()  {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket('ws://localhost:3000/echo');
    ws.onerror =  function(){showMessage('WebSocket error');} ;

    ws.onopen =  function(){showMessage('WebSocket connected');} ;
    ws.onclose =  function(){showMessage('WebSocket closed');} ;
  };
})();
