var slide_index, slide_count;

var LEFT_KEY_CODE = 37;
var RIGHT_KEY_CODE = 39;
var P_KEY_CODE = 80;

function nextSlide(event) {
  if(slide_index >= slide_count-1) return false;
  setSlide(slide_index+1);
  return true;
}

function prevSlide(event) {
  if(slide_index < 1) return false;
  setSlide(slide_index-1);
  return true;
}

// Move to a specific slide. Attempt to sync state with the remote
// app when doing so.
function setSlide(index) {
  // Set everyone else's to the same
  if(!from_remote) presenterRequest("/goto/"+index);
  showSlide(index);
}

// Show a certain slide locally without attempting to update the remote
// state.
function showSlide(index) {
  var i=0;
  slide_index = index;

  // Set page counter content
  updatePageCounter();
  
  $("body > ol > li").each(function() {
    li = $(this);
    s = (Math.random() > 0.1)? 1 : -1;
    randrot = s*15*Math.random()
    
    if(i < index) {
      if(!li.hasClass("done")) {
        li.attr("class", "done");
        li.css("-webkit-transform", "rotate("+randrot+"deg)");
      }
    }
    if(i > index) {
      li.attr("class", "pending");
    }
    if(index == i) {
      li.attr("class", "current");
      li.css("-webkit-transform", "rotate(0deg)");
    }
    console.log("thatSlide "+index+" : set class for "+i+" to "+li.attr("class"));    
    i++;
  });
}

// Attempt to make a request including the presenter password, if the password has been entered.
// The params argument is optional.
// TODO display an error if the password is invalid
function presenterRequest(url, params, responseCallback) {
  // Make params argument optional
  if(!responseCallback && typeof(params)=="function") {
    responseCallback = params
    params = {};
  }
  // fill in blank remainder arguments
  if(!params) params = {};
  if(!responseCallback) responseCallback = function() {};
  // Check for presenter password
  var presenter_password = $("#presenter_password").val();
  if (presenter_password && presenter_password != "") {
    params["unlock"] = presenter_password
    $.getJSON(slide_url, params, function(data, textStatus) {
      // TODO handle auth error
      // Delegate to given callback
      responseCallback(data, textStatus);
    });
  }
}


function togglePresenterControls() {
	$("#presenter_controls").toggle(1000);
}

function updatePageCounter() {
	var html = "Slide "+(slide_index+1)+" of "+slide_count;	
	$(".page_counter").html(html);
}

$(document).ready(function() {
    
  slide_index = 0;
  slide_count = $("body > ol > li").length;
  z_counter = slide_count;
  // Set z-indexes
  $("body > ol > li").each(function() {
    li = $(this);
    li.css("z-index", z_counter);
    z_counter--;
  });
  
  // Listen to keypresses
  $("body").keyup(function(event) {
    event.preventDefault();

    if(event.keyCode == LEFT_KEY_CODE) prevSlide();
    if(event.keyCode == RIGHT_KEY_CODE) nextSlide();
    if(event.keyCode == P_KEY_CODE) togglePresenterControls();
  });
  
  // Create the status readout
  $("body").prepend('<section class="page_counter"></section>');
  $("body").prepend('<section id="presenter_controls" style="display: none;"><input id="presenter_password" type="text" value="" /></section>');
  
  // Set to slide zero
  showSlide(0);
});