var LEFT_KEY_CODE = 37;
var RIGHT_KEY_CODE = 39;
var P_KEY_CODE = 80;


$(document).ready(function() {
  
  // Listen to keypresses
  $("body").keyup(function(event) {
    event.preventDefault();

    if(event.keyCode == LEFT_KEY_CODE) prevSlide();
    if(event.keyCode == RIGHT_KEY_CODE) nextSlide();
    if(event.keyCode == P_KEY_CODE) togglePresenterControls();
  });
  
  
});