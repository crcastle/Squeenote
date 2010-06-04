// JS OO
require.paths.unshift(__dirname + '/vendor/js-oo/lib');
require('oo');
// Socket.io
require.paths.unshift(__dirname + '/vendor/socket.io');
var io = require('socket.io');
// Core libs
var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    sys = require('sys');
    
Server = this.Server = Class({
  
  init: function(presentation_path, presenter_password) {
    this.presenter_slide_history = []; // Contains all previously-selected slide indexes, excluding the currently-selected index.
    this.presenter_slide_index = 0;
    this.presentation_path = presentation_path;
    this.presenter_password = presenter_password;
    this.httpListener = null;
    this.wsListener = null;
  },
  
  // Starts the server on the given port.
  listen: function(port) {
    // Create the regular HTTP-flavour server
    var _server = this;
    this.httpListener = http.createServer(function(req, res) {
      _server.routeRequest(req, res);
    })
    this.httpListener.listen(port);
    // Create the superduper websocket rocket
    this.wsListener = io.listen(this.httpListener);
    this.wsListener.addListener("clientConnect", function(client) {
      _server.wsClientConnected(client);
    });
    this.wsListener.addListener("clientMessage", function(message, client) {
      _server.wsClientMessageReceived(message, client);
    });
    this.wsListener.addListener("clientDisconnect", function(client) {
      _server.wsClientDisconnected(client);
    })    
    // Tell the presenter to say SQUEEEEE!
    sys.puts('Get your SQUEEEEE on at http://127.0.0.1:'+port+'/ - Press ctrl+c to stop the server.');
  },
  
  // ------------------------------------------------------------------------------------------
  // HTTP Responders
  // ------------------------------------------------------------------------------------------
  
  // Acts as the main request router for inbound requests.
  routeRequest: function(req, res) {
    var request_info = url.parse(req.url);
    sys.puts("Routing request for : "+request_info.href);
    if(request_info.pathname == "/") return this.presentationResponse(req, res);
    else if(request_info.pathname.indexOf("/goto") == 0) return this.presenterSlideChangeResponse(req, res);
    else return this.staticFileResponse(req, res);
  },
  
  // Responds to the given request with the contents of the presentation file selected at server start.
  presentationResponse: function(req, res) {
    sys.puts("Serving presentation markup");
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile(this.presentation_path, function(error, data) {
      res.write(data);
      res.end();
    });
  },
  
  // Processes a request from a client to set the current presenter slide index.
  // Returns the JSON state to the client with a 200 OK status if the request is properly-authenticated.
  // Returns a 403 Forbidden otherwise.
  presenterSlideChangeResponse: function(req, res) {
    var request_info = url.parse(req.url);
    var presenter_controls_unlocked = presenterIsAuthenticated(req);
    if(!presenter_controls_unlocked) return denyResponse(req, res, "Not permitted to set the remote presenter slide. Incorrect password.");
    // Now process the change request    
    segs = request_info.pathname.substr(6,5);
    this.setPresenterSlide(parseInt(segs));
    return presentationStateResponse(req, res);
  },
  
  // Returns the contents of a static file if the file exists within the public directory.
  // Responds with a 404 Not Found if the file does not exist.
  // Responds with a 403 Forbidden if the requested path contains ".." or any other jiggery-pokery.
  staticFileResponse: function(req, res) {
    var request_info = url.parse(req.url);
    sys.puts("Serving static file: "+request_info.href);
    if(request_info.href.indexOf("..") > -1) return denyResponse(req, res, "Illegal static file path");
    fs.readFile("./public"+request_info.href, function(error, data) {
      if(error) {
        res.writeHead(404, {});
        res.end();
        return;
      }
      res.writeHead(200, {});
      res.write(data);
      res.end();
    });
  },
  
  // Denies an inbound response with a 403 Forbidden status.
  denyResponse: function(req, res, message) {
    sys.puts("Denying inbound request.");
    res.writeHead(403, {});
    res.end();
  },
  

  // Returns the JSON required by the client
  presentationStateResponse: function(req, res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write("{\"presenter_slide_history\": ["+this.presenter_slide_history.join(",")+"], \"presenter_slide_index\": "+this.presenter_slide_index+"}");
    res.end();
  },
  
  // ------------------------------------------------------------------------------------------
  // Websocket / Socket.io responders
  // ------------------------------------------------------------------------------------------
  
  // Called when a socket.io client connects to the service
  wsClientConnected: function(client) {
    
  },
  
  // Called when a socket.io client sends a message to the service
  wsClientMessageReceived: function(message, client) {
    
  },
  
  // Called when a socket.io client disconnects from the service
  wsClientDisconnected: function(client) {
    
  },
  
  // ------------------------------------------------------------------------------------------
  // Utilities
  // ------------------------------------------------------------------------------------------
  
  // Checks a request to see if it is from the presenter.
  // Returns a boolean.
  presenterIsAuthenticated: function(req) {
    var request_info = url.parse(req.url);
    if (request_info.query) {
      if (request_info.query["presenter_password"] == presenter_password) {
        sys.puts("Inbound request has unlocked presenter controls!");
        return true;
      } else {
        return false;
      }
    }    
  },
  
  // Sets the current presenter slide index and stores the previous value in the history stack.
  setPresenterSlide: function(index) {
    this.presenter_slide_history.push(this.presenter_slide_index);
    this.presenter_slide_index = index;
    return this.presenter_slide_index;
  }
  
  
});