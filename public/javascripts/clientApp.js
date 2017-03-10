( function() {
  messages = document.querySelector('#messages');
  wsButton = document.querySelector('#wsButton');
  logout = document.querySelector('#logout');
  send = document.querySelector('#send');

  var ws;

  showMessage = function (message)  {
    messages.textContent += '\n'+message;
    messages.scrollTop = messages.scrollHeight;
  };

  handleResponse = function(response) {
    var toreturn;
    if (response.ok){
      toreturn = response.json();
      toreturn = JSON.stringify(toreturn);
    }
    else {
      throw 'Unexpected response';
    }
    return toreturn;
  };

  send.onclick = function()  {
    ws.send('{"function" : "FindRecords"}');
  };

  logout.onclick = function()  {
    fetch('/logout', { method: 'DELETE', credentials: 'same-origin' })
      .then(handleResponse)
      .then(showMessage)
      .catch(function(err){ showMessage(err.message);});
  };

  wsButton.onclick = function()  {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket('ws://localhost:3000/echo');
    ws.onerror =  function(){showMessage('WebSocket error');} ;

    ws.onopen =  function(){showMessage('WebSocket connected');} ;
    ws.onclose =  function(){showMessage('WebSocket closed');} ;
    ws.onmessage =  function(msg){showMessage('Message from server '+msg.data);} ;
  };
})();
