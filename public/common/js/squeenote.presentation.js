if(typeof(squeenote)=="undefined") squeenote = {};

squeenote.Presentation = function() {
  this.init();
}
squeenote.Presentation.prototype = {
  
  client_slide_index: 0,        // The slide index currently being viewed by the client. Zero-based.
  presenter_slide_index: 0,     // The slide index currently being shown by the presenter. Zero-based.
  slide_count: 0,               // The total number of slides in the presentation
  verbose: true,                // Set console.log output
  prev_slide_keycode: 37,       // The left arrow key.
  next_slide_keycode: 39,       // The right arrow key.
  
  jq_presentation: null,       // A jQuery object containing the root presentation node.
  
  jq_presentation_selector: "body > ol", // The selector used to identify the root presentation holder.
  jq_slide_selector: "body > ol > li", // The selector used to identify and select elements that are slides.
  
  init: function() {
    this.log("init...");
    
    // Set static references
    this.jq_presentation = $(this.jq_presentation_selector);
    this.slide_count = $(this.jq_slide_selector).length;
    
    // Bind internal events
    var _instance = this;
    $("body").keyup(function(event) {
       event.preventDefault();
       if(event.keyCode == _instance.prev_slide_keycode) _instance.prevSlide();
       if(event.keyCode == _instance.next_slide_keycode) _instance.nextSlide();
    });
    
    // Trigger the ready event for any theme javascript to pick up on.
    $(document).trigger("presentationLoaded.squeenote", this);
    // Reset the slide count. Anything bound to the presentationLoaded event should now be listening for the change.
    this.showSlide(0);
  },
  
  prevSlide: function(index) {
    if(this.client_slide_index <= 0) return this.showSlide(this.slide_count-1);
    this.showSlide(this.client_slide_index-1);
  },
  
  nextSlide: function(index) {
    if(this.client_slide_index >= this.slide_count-1) return this.showSlide(0);
    this.showSlide(this.client_slide_index+1);
  },
  
  // Shows the slide with the specified index
  showSlide: function(index) {
    this.log("Showing slide with index: "+index);
    this.client_slide_index = index;
    this.jq_presentation.trigger("presentationClientSlideChanged.squeenote", this);
    var i = 0;
    $(this.jq_slide_selector).each(function() {
      li = $(this);
      li_state = li.attr("data-slide-state");
      if(i < index) {
        if(li_state != "done") {
          li.attr("data-slide-state", "done");
          li.trigger("slideStateChanged.squeenote", [li, "done"]);
        }
      } else if(i > index) {        
        if(li_state != "pending") {
          li.attr("data-slide-state", "pending"); 
          li.trigger("slideStateChanged.squeenote", [li, "pending"]);
        }        
      }
      if(index == i) {
        if(li_state != "current") {
          li.attr("data-slide-state", "current");
          li.trigger("slideStateChanged.squeenote", [li, "current"]);
        }        
      }
      i++;
    });
  },
  
  // Returns true if the client should switch slides with the presenter.
  shouldTrackPresenterSlide: function() {
    
  },
  
  log: function(message) {
    if(this.verbose) console.log("squeenote.Presentation: "+message);
  }
  
};

$(document).ready(function() {
  window.presentation = new squeenote.Presentation();
})