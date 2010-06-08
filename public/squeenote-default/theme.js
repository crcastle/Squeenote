$(document).bind("presentationLoaded.squeenote", function(event, presentation) {
  
  // Take the presentation wrapper as the main event dispatcher
  var presentation = presentation;
  var dispatcher = presentation.jq_presentation;
 
  // ---------------------------
  // Customise everything and anything below to set up your theme!
  // ---------------------------
  
  z_counter = presentation.slide_count;
  // Set z-indexes
  $(presentation.jq_slide_selector).each(function() {
    li = $(this);
    li.css("z-index", z_counter);
    z_counter--;
  });
  // Perform vertical centering
  //$(presentation.jq_slide_selector).each(function() {
  //  slide = $(this);
  //  s_height = slide.outerHeight();
  //  // Wrap content
  //  slide.wrapInner("<div class=\"vert_center_wrap\"></div>");
  //  wrapper = $(".vert_center_wrap", slide);
  //  w_height = wrapper.height();
  //  // Add top margin to compensate
  //  diff =  (s_height-w_height)/2;
  //  console.log("DIFF: "+w_height+" into "+s_height+" makes "+diff);
  //  wrapper.css("margin-top", diff+"px" );
  //});
  
  
  // Listen for the slide state changed event and add/remove classes from the slides
  // This event is only called when the state on an individual slide *changes*, so you don't have to worry
  // about it running on every slide switch.
  $(presentation.jq_slide_selector).bind("slideStateChanged.squeenote", function(event, li, state) {
    li = $(li);
    li.attr("class", state);
    switch(state) {
      case "done":
        break;
      case "current":
        break;
      case "pending":
        break;
    }
  });
  
});