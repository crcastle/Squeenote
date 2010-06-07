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
  dispatcher.bind("presentationPresenterSlideChanged.squeenote", function(event, presentation) {
    $(".presenter_slide_number").html(presentation.presenter_slide_index+1);
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
        <a class=\"follow_presenter_enabled disable_presenter_follow\">Presenter follow enabled.</a>\
        <a class=\"follow_presenter_disabled enable_presenter_follow\">Presenter follow disabled. Presenter is on slide <span class=\"presenter_slide_number\"></span></a>\
     </section>"
  );
  $(".enable_presenter_follow").click(function(event) {
    event.preventDefault();
    presentation.startFollowingPresenter();
  });
  $(".disable_presenter_follow").click(function(event) {
    event.preventDefault();
    presentation.stopFollowingPresenter();
  });
  dispatcher.bind("stoppedFollowingPresenter.squeenote", function() {
    console.log("received stoppedFollowingPresenter");
    $(".follow_presenter_enabled").hide();
    $(".follow_presenter_disabled").show();
  });
  dispatcher.bind("startedFollowingPresenter.squeenote", function() {
    console.log("received startedFollowingPresenter");
    $(".follow_presenter_enabled").show();
    $(".follow_presenter_disabled").hide();
  })
  
  // Listen for the stoppedFollowingPresenter event
  // Listen for the startedFollowingPresenter event
  // Listen for clicks on the follow toggle and call presentation.togglePresenterFollow
  
  // Add the presenter controls
  control_strip.prepend(
    "<section class=\"presenter_controls\" style=\"display: none\">\
        <form id=\"presenter_authentication_form\" class=\"presenter_controls_disabled\" action=\"/authenticate\">\
          <label for=\"presenter_password\">Enter the presenter password to enable presenter controls</label>\
          <input id=\"presenter_password\" type=\"password\" value=\"\" />\
        </form>\
        <section class=\"presenter_controls_enabled\" style=\"display: none\">\
          Presenter mode <a class=\"disable_presenter_mode\">Sign off presenter</a>\
        </section>\
     </section>"
  );
  $("#presenter_password").bind("keyup", function(event) {
    dispatcher.trigger("presenterPasswordChanged.squeenote", $(this).val());
  })
  var presenter_authenticated = false;
  dispatcher.bind("presenterAuthenticated.squeenote", function(event) {
    event.preventDefault();
    if(!presenter_authenticated) {
      $(".presenter_controls_disabled").hide();
      $(".presenter_controls_enabled").show();
    }
    presenter_authenticated = true;
  })
  dispatcher.bind("presenterNotAuthenticated.squeenote", function(event) {
    event.preventDefault();
    if(presenter_authenticated) {
      $(".presenter_controls_disabled").show();
      $(".presenter_controls_enabled").hide();
    }
    presenter_authenticated = false;
  })
  
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