$(document).bind("presentationLoaded.squeenote", function(event, presentation) {
  
  // Take the presentation wrapper as the main event dispatcher
  var presentation = presentation;
  var dispatcher = presentation.jq_presentation;
  var presenter_controls_toggle_keycode = 80; // The P key

  // Create the control strip
  $("body").prepend("<section id=\"squeenote_controls\"><section>");
  control_strip = $("#squeenote_controls");
  
  // Create the slide counter
  control_strip.prepend(
    "<section class=\"slide_counter\">\
        <a class=\"prev_slide\">&laquo;</a>\
        Slide <span class=\"current_slide_number\">X</span>\
        of <span class=\"slide_count\">Y</span>\
        <a class=\"next_slide\">&raquo;</a>\
     </section>"
  );

  // Bind the slide counter events
  dispatcher.bind("presentationClientSlideChanged.squeenote", function(event, presentation) {
    $(".current_slide_number").html(presentation.client_slide_index+1);
    $(".slide_count").html(presentation.slide_count);
  });
  
  // Bind the next and previous links to the slide change functions
  $("#squeenote_controls a.prev_slide").bind("click", function(event) {
    event.preventDefault(); presentation.prevSlide();
  });
  $("#squeenote_controls a.next_slide").bind("click", function(event) {
    event.preventDefault(); presentation.nextSlide();
  });
  
  // Add the client controls
  control_strip.prepend(
    "<section class=\"client_controls\">\
        <a class=\"follow_presenter_toggle\">Client controls</a>\
     </section>"
  );
  
  // Listen for the stoppedFollowingPresenter event
  // Listen for the startedFollowingPresenter event
  // Listen for clicks on the follow toggle and call presentation.togglePresenterFollow
  
  // Add the presenter controls
  control_strip.prepend(
    "<section class=\"presenter_controls\" style=\"display: none\">\
        <input id=\"presenter_password\" type=\"text\" value=\"\" />\
     </section>"
  );
  
  // Listen for the presenterPasswordIncorrect event
  // Listen for the presenterPasswordAccepted event
  
  // Register the P key to toggle presenter controls
  var presenter_controls_shown = true;
  $("body").keyup(function(event) {
    event.preventDefault();
    if(event.keyCode == presenter_controls_toggle_keycode) {
      $(".client_controls, .presenter_controls").toggle();
    }
  });
  
});