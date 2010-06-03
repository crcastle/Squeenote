setInterval(function() {
  $.getJSON("/hook", function(data, textStatus) {
    // Do call and set slide to remote slide
    if(data.remote_slide >= 0 && slide_index != data.remote_slide) showSlide(data.remote_slide);
  })
}, 2000);