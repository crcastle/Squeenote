var sys = require('sys'),
    http = require('http'),
    url = require('url'),
    fs = require('fs'),
	path = require('path');

var slide_index = 0;
var unlock_passcode = "bling-bling";
   
http.createServer(function (req, res) {
	var unlock_master = false;
	
  // Route url
  var r_info = url.parse(req.url, true);  

 	if (r_info.query != null) {
		var unlock = r_info.query["unlock"];
sys.puts("unlock: "+unlock+" "+unlock_passcode);
		if (unlock != undefined && unlock == unlock_passcode) {
			unlock_master = true;
			sys.puts("Unlocked master mode!");
		} else {
			unlock_master = false;
		}
		
		sys.puts("master-mode: "+unlock_master);
	}

  if(r_info.pathname == "/") {
    sys.puts("Serving slide markup");
      // Serve page for index/root requests
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile("index.html", function(error, data) {
      res.write(data);
      res.end();
    });
  } else if(r_info.pathname == "/hook") {
      // Serve webhook for hook requests
      res.writeHead(200, {"Content-Type": "application/json"});
      res.write("{\"remote_slide\": "+slide_index+", \"unlocks\": "+unlock_master+"}");
      res.end();
  } else if(r_info.pathname.indexOf("/goto") == 0) {
	sys.puts("Trying to set slide num... "+r_info.href);
		pr_slide_num = slide_index;
		
		if (unlock_master == true) {
	      sys.puts("Setting slide num... "+r_info.href);
	      // Increment page value for inc requests
	      segs = r_info.href.substr(6,5);
	      
	      slide_index = segs;
		}
	      res.writeHead(200, {"Content-Type": "application/json"});
		  res.write("{\"previous_slide\": "+pr_slide_num+", \"slide_index\": "+slide_index+"}");
	      res.end();
  } else {
    // Serve static file
    sys.puts("Serving static file");
      // Serve page for index/root requests
    
    res.writeHead(200, {});

    fs.readFile("."+r_info.href, function(error, data) {
      if(error) sys.puts(sys.inspect(error));
      res.write(data);
      res.end();
    });
  }

}).listen(8080);
sys.puts('Server running at http://127.0.0.1:8080/');