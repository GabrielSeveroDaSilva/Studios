/**
 * Author: Romes
 * Author URL: http://romes.dev
 */
"use strict";
var dvstudios_ribbon = {};

dvstudios_ribbon = {
	$el: jQuery('.dvstudios-albums-carousel'),
	type: 'large',
	target: 0,
	current: 0,
	isDown: false,
	isDownLink: false,
	isLinkMoved: false,
	isTouch: false,
	isLocked: false,
	mozDelta: 33,
	currentStep: 0,
	maxStep: jQuery(window).width(),

	// Scroll Speed Option for Touch Devices
	touchSpeed: {
		vertical: 2, // Speed factor for Vertical Ribbon
		horizontal: 2, // Speed factor for Horizontal Ribbon
	},

	tagetChanged: function() {
		if (dvstudios_ribbon.type == 'medium') {
			let percent = Math.ceil(dvstudios_ribbon.currentStep * 100 / (dvstudios_ribbon.maxStep));
			dvstudios_ribbon.barTarget = dvstudios_ribbon.$bar.width() * (percent/100);
		}
		if (dvstudios_ribbon.type == 'vertical') {
			if (dvstudios_ribbon.target > $dvstudios_window.height()/2) {
				$dvstudios_body.addClass('has-to-top');
			} else {
				$dvstudios_body.removeClass('has-to-top');
			}
		}
	},

	init: function() {
		/* Determine Type */
		/* -------------- */
		if (dvstudios_ribbon.$el.hasClass('is-medium')) {
			dvstudios_ribbon.$bar = dvstudios_ribbon.$el.parent().children('.dvstudios-albums-carousel-progress');
			dvstudios_ribbon.barTarget = 0;
			dvstudios_ribbon.barCurrent = 0;
			dvstudios_ribbon.type = 'medium';
		}
		if (dvstudios_ribbon.$el.hasClass('is-vertical')) {
			dvstudios_ribbon.type = 'vertical';
		}

		/* Move Functions */
		/* -------------- */
		// Mouse Events
		dvstudios_ribbon.$el.on('mousedown', function(e) {
			if (dvstudios_ribbon.isTouch) {
				dvstudios_ribbon.isTouch = false;
			}
			if (!dvstudios_ribbon.$el.hasClass('is-hovered')) {
				e.preventDefault();
				dvstudios_ribbon.isDown = true;
				dvstudios_ribbon.$el.addClass('is-grabbed');
				if (dvstudios_ribbon.type == 'vertical') {
					dvstudios_ribbon.old_pageX = e.clientY;
				} else {
					dvstudios_ribbon.old_pageX = e.clientX;
				}
			}
		}).on('mouseup', function() {
			dvstudios_ribbon.isDown = false;
			dvstudios_ribbon.$el.removeClass('is-grabbed');
			dvstudios_ribbon.isDownLink = false;
		}).on('mouseleave', function() {
			dvstudios_ribbon.isDown = false;
			dvstudios_ribbon.$el.removeClass('is-grabbed');
			dvstudios_ribbon.isDownLink = false;
		}).on('mousemove', function(e) {
			e.preventDefault();
			if (dvstudios_ribbon.isDown) {
				if (dvstudios_ribbon.type == 'vertical') {
					let newX = (dvstudios_ribbon.old_pageX - e.clientY)*2,
						newTop = dvstudios_ribbon.currentStep + newX;
					dvstudios_ribbon.old_pageX = e.clientY;
					if (newTop > dvstudios_ribbon.maxStep) {
						newTop = dvstudios_ribbon.maxStep;
					}
					if (newTop < 0) {
						newTop = 0;
					}
					dvstudios_ribbon.currentStep = newTop;
					dvstudios_ribbon.target = newTop;
				} else {
					let newX = dvstudios_ribbon.old_pageX - e.clientX,
						newTop = dvstudios_ribbon.currentStep + newX;
					dvstudios_ribbon.old_pageX = e.clientX;
					if (newTop > dvstudios_ribbon.maxStep) {
						newTop = dvstudios_ribbon.maxStep;
					}
					if (newTop < 0) {
						newTop = 0;
					}
					dvstudios_ribbon.currentStep = newTop;
					dvstudios_ribbon.target = newTop;
				}
				dvstudios_ribbon.tagetChanged();
			}
			if (dvstudios_ribbon.isDownLink) {
				dvstudios_ribbon.isLinkMoved = true;
			} else {
				dvstudios_ribbon.isLinkMoved = false;
			}
		});

		dvstudios_ribbon.$el[0].addEventListener('wheel', function(e) {
			var this_delta = e.deltaY;
			if (e.mozInputSource) {
				this_delta = e.deltaY * dvstudios_ribbon.mozDelta;
			}
			let newTop = dvstudios_ribbon.currentStep + this_delta;
			if (newTop > dvstudios_ribbon.maxStep) {
				newTop = dvstudios_ribbon.maxStep;
			}
			if (newTop < 0) {
				newTop = 0;
			}
			dvstudios_ribbon.currentStep = newTop;
			dvstudios_ribbon.target = newTop;
			dvstudios_ribbon.tagetChanged();
		});

		// Touch Events
		dvstudios_ribbon.$el[0].addEventListener('touchstart', function(e) {
			if (!dvstudios_ribbon.isTouch) {
				dvstudios_ribbon.isTouch = true;
			}
			dvstudios_ribbon.isDown = true;
			dvstudios_ribbon.$el.addClass('is-grabbed');
			if (dvstudios_ribbon.type == 'vertical') {
				dvstudios_ribbon.old_pageX = e.touches[0].clientY;
			} else {
				dvstudios_ribbon.old_pageX = e.touches[0].clientX;
			}
		}, false);
		dvstudios_ribbon.$el[0].addEventListener('touchmove', function(e) {
			if (dvstudios_ribbon.isDown) {
				if (dvstudios_ribbon.type == 'vertical') {
					let newX = (dvstudios_ribbon.old_pageX - e.touches[0].clientY)*dvstudios_ribbon.touchSpeed.vertical,
						newTop = dvstudios_ribbon.currentStep + newX;
					dvstudios_ribbon.old_pageX = e.touches[0].clientY;
					if (newTop > dvstudios_ribbon.maxStep) {
						newTop = dvstudios_ribbon.maxStep;
					}
					if (newTop < 0) {
						newTop = 0;
					}
					dvstudios_ribbon.currentStep = newTop;
					dvstudios_ribbon.target = newTop;
				} else {
					let newX = (dvstudios_ribbon.old_pageX - e.touches[0].clientX)*dvstudios_ribbon.touchSpeed.horizontal,
						newTop = dvstudios_ribbon.currentStep + newX;

					dvstudios_ribbon.old_pageX = e.touches[0].clientX;
					if (newTop > dvstudios_ribbon.maxStep) {
						newTop = dvstudios_ribbon.maxStep;
					}
					if (newTop < 0) {
						newTop = 0;
					}
					dvstudios_ribbon.currentStep = newTop;
					dvstudios_ribbon.target = newTop;
				}
				dvstudios_ribbon.tagetChanged();
			}
			if (dvstudios_ribbon.isDownLink) {
				dvstudios_ribbon.isLinkMoved = true;
			} else {
				dvstudios_ribbon.isLinkMoved = false;
			}
		}, false);
		dvstudios_ribbon.$el[0].addEventListener('touchend', function(e) {
			dvstudios_ribbon.isDown = false;
			dvstudios_ribbon.$el.removeClass('is-grabbed');
			dvstudios_ribbon.isDownLink = false;
		}, false);

		// Links and Buttons
		dvstudios_ribbon.$el.find('a.dvstudios-button').on('mouseover', function() {
			if (!dvstudios_ribbon.isTouch) {
				dvstudios_ribbon.$el.addClass('is-hovered');
			}
		}).on('mouseout', function(){
			dvstudios_ribbon.$el.removeClass('is-hovered');
		});

		dvstudios_ribbon.$el.find('a').on('mousedown', function() {
			dvstudios_ribbon.isDownLink = true;
		}).on('click', function(e) {
			if (dvstudios_ribbon.isLinkMoved) {
				e.preventDefault();
				return false;
			}
			dvstudios_ribbon.isDownLink = false;
			dvstudios_ribbon.isLinkMoved = false;
		});

		dvstudios_ribbon.$el.find('.dvstudios-album-item').each(function() {
			if ('IntersectionObserver' in window) {
				dvstudios_ribbon.observer.observe(this);
			} else {
				jQuery(this).children('.dvstudios-album-item__inner').addClass('is-inview');
			}
		});

		// Layout
		dvstudios_ribbon.layout();

		// Start Animation
		dvstudios_ribbon.animate();

		// Bind Window Actions
		jQuery(window).on('resize', function() {
			// Window Resize Actions
			dvstudios_ribbon.layout();
			setTimeout(dvstudios_ribbon.layout(), 500);
		}).on('load', function() {
			// Window Load Actions
			dvstudios_ribbon.layout();
		});
	},
	layout: function() {
		$dvstudios_body.height($dvstudios_window.height());

		let $this = dvstudios_ribbon.$el,
			fullWidth = 0,
			setHeight;

		if (dvstudios_ribbon.type == 'large') {
			setHeight = $dvstudios_window.height() - $dvstudios_header.height() - $dvstudios_footer.height();
			$this.css('top', $dvstudios_header.height());
		}
		if (dvstudios_ribbon.type == 'medium') {
			setHeight = $dvstudios_window.height()/2;
		}

		if (dvstudios_ribbon.type == 'large' || dvstudios_ribbon.type == 'medium') {
			$this.height(setHeight).find('.dvstudios-album-item__title').width(setHeight);
			$this.find('.dvstudios-album-item').each(function() {
				let $this_slide = jQuery(this),
					$this_slide_img = $this_slide.find('img');

				if ($this_slide_img.attr('height') && $this_slide_img.attr('width')) {
					$this_slide.height(setHeight);
					let imgRatio = parseInt($this_slide_img.attr('width'), 10)/parseInt($this_slide_img.attr('height'), 10),
						setWidth = setHeight*imgRatio;

					$this_slide_img.height(setHeight).width(setWidth);
					fullWidth = fullWidth + $this_slide.width();
				} else {
					$this_slide.height(setHeight);
				}
			});
		}

		if (dvstudios_ribbon.type == 'vertical') {
			$this.find('.dvstudios-album-item').each(function() {
				let $this_slide = jQuery(this),
					$this_slide_img = $this_slide.find('img'),
					setHeight = $this_slide_img.height();

				$this_slide.find('.dvstudios-album-item__title').width(setHeight);

				fullWidth = fullWidth + $this_slide.height();
			});
			fullWidth = fullWidth + $dvstudios_header.height() + $dvstudios_footer.height();
			$this.css('padding', $dvstudios_header.height()+'px 0 ' + $dvstudios_footer.height() + 'px 0')
			$this.height(fullWidth);
		} else {
			$this.width(fullWidth);
		}

		if (dvstudios_ribbon.type == 'vertical') {
			let body_height = fullWidth;
			dvstudios_ribbon.maxStep = body_height - $dvstudios_window.height();
		} else {
			let spacingLeft = parseInt($this.find('.dvstudios-album-item__inner').css('margin-right'), 10),
				body_height = fullWidth - $dvstudios_window.width() + spacingLeft + $dvstudios_window.height();
			$this.css('padding-left', spacingLeft + 'px');
			dvstudios_ribbon.maxStep = body_height - $dvstudios_window.height();
		}

		if (dvstudios_ribbon.currentStep > dvstudios_ribbon.maxStep) {
			dvstudios_ribbon.currentStep = dvstudios_ribbon.maxStep;
			dvstudios_ribbon.target = dvstudios_ribbon.currentStep;
		}
		if (dvstudios_ribbon.currentStep < 0) {
			dvstudios_ribbon.currentStep = 0;
			dvstudios_ribbon.target = dvstudios_ribbon.currentStep;
		}
	},
	animate: function() {
		if (dvstudios_ribbon.type == 'vertical') {
			// Scroll Content
			dvstudios_ribbon.current += ((dvstudios_ribbon.target - dvstudios_ribbon.current) * 0.1);
			dvstudios_ribbon.$el.css('transform', 'translate3d(0, -'+ dvstudios_ribbon.current +'px, 0)');
			// Img Motion Effect
			let img_current = (dvstudios_ribbon.target - dvstudios_ribbon.current) * 0.1;
			dvstudios_ribbon.$el.find('.dvstudios-album-item__overlay').css('transform', 'translate3d(0, '+ img_current +'px, 0)');
			dvstudios_ribbon.$el.find('img').css('transform', 'translate3d(0, '+ img_current +'px, 0)');
		} else {
			// Scroll Content
			dvstudios_ribbon.current += ((dvstudios_ribbon.target - dvstudios_ribbon.current) * 0.1);
			dvstudios_ribbon.$el.css('transform', 'translate3d(-'+ dvstudios_ribbon.current +'px, 0, 0)');
			// Img Motion Effect
			let img_current = (dvstudios_ribbon.target - dvstudios_ribbon.current) * 0.1;
			dvstudios_ribbon.$el.find('.dvstudios-album-item__overlay').css('transform', 'translate3d('+ img_current +'px, 0, 0)');
			dvstudios_ribbon.$el.find('img').css('transform', 'translate3d('+ img_current +'px, 0, 0)');
			// Bar Update
			if (dvstudios_ribbon.type == 'medium') {
				dvstudios_ribbon.barCurrent += ((dvstudios_ribbon.barTarget - dvstudios_ribbon.barCurrent) * 0.1);
				dvstudios_ribbon.$bar.children('.dvstudios-albums-carousel-progress__bar').width(dvstudios_ribbon.barCurrent);
			}
		}
		// Update Frame
		requestAnimationFrame( dvstudios_ribbon.animate );
	}
};
if ('IntersectionObserver' in window) {
	dvstudios_ribbon.observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if(entry.isIntersecting) {
				jQuery(entry.target).children('.dvstudios-album-item__inner').addClass('is-inview');
			} else {
				jQuery(entry.target).children('.dvstudios-album-item__inner').removeClass('is-inview');
			}
		});
	});
}

// Init when Document is ready
jQuery(document).ready( function() {
	dvstudios_ribbon.init();
});
