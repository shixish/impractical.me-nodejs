//allow other versions of jQuery
$.noConflict();


function isDocumentInFullScreenMode() {
  // Note that the browser fullscreen (triggered by short keys) might
  // be considered different from content fullscreen when expecting a boolean
  return ((document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard methods
      (!document.mozFullScreen && !document.webkitIsFullScreen));                   // current working methods
}

jQuery.fn.requestFullscreen = function(){
	var element =  this[0];
	if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

document.exitFullscreen = Modernizr.prefixed('exitFullscreen', document);

(function ($){
	// Activates the Carousel
	$('.carousel').carousel({
		interval: 5000
	});
	
	// Activates Tooltips for Social Links
	$('.tooltip-social').tooltip({
		selector: "a[data-toggle=tooltip]"
	});
	
	var $dc = $('#demo-content'), dc = $dc[0];
	if (dc) {
		var $fs = $('<div id="fullscreen-button"></div>').appendTo($dc);
		var $fs_link = $('<a href="#"></a>').appendTo($fs);
		var $fs_icon = $('<i class="fa fa-arrows-alt"></i>').appendTo($fs_link);
		
		$fs_link.click(function(){
			if ($fs_icon.hasClass('fa-arrows-alt')) {
				$dc.requestFullscreen();
			}else{
				document.exitFullscreen();
			}
		});
		$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange',function(e){
			if (isDocumentInFullScreenMode()){
				$dc.removeClass('fullscreen-mode');
				$fs_icon.addClass('fa-arrows-alt');
				$fs_icon.removeClass('fa-minus-square-o');
			}else{
				$dc.addClass('fullscreen-mode');
				$fs_icon.removeClass('fa-arrows-alt');
				$fs_icon.addClass('fa-minus-square-o');
			}
		});
	}
	
	//jQuery for page scrolling feature - requires jQuery Easing plugin
	$('.page-scroll a').bind('click', function(event) {
		var $anchor = $(this);
		$('html, body').stop().animate({
			scrollTop: $($anchor.attr('href')).offset().top
		}, 1000, 'easeOutQuad');
		event.preventDefault();
	});
})(jQuery);