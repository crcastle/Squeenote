setInterval(function() {
  var hook_url = "/hook";
  var unlock_code = $("#unlock_code").val();

  	if (unlock_code != null && unlock_code != "") {
		hook_url += "?unlock="+unlock_code;
	}
	
  $.getJSON(hook_url, function(data, textStatus) {
    // Do call and set slide to remote slide
	unlocked_state = data.unlocks;
    if(data.remote_slide >= 0 && slide_index != data.remote_slide) thatSlide(data.remote_slide, false, true);
  })
}, 2000);