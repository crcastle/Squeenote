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
  //li = $(this);
  //s = (Math.random() > 0.1)? 1 : -1;
  //randrot = s*15*Math.random()
  //
  //if(i < index) {
  //  if(!li.hasClass("done")) {
  //    li.attr("class", "done");
  //    li.css("-webkit-transform", "rotate("+randrot+"deg)");
  //  }
  //}
  //if(i > index) {
  //  li.attr("class", "pending");
  //}
  //if(index == i) {
  //  li.attr("class", "current");
  //  li.css("-webkit-transform", "rotate(0deg)");
  //}
  //console.log("thatSlide "+index+" : set class for "+i+" to "+li.attr("class"));    
  //i++;
  
});