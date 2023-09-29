/**
 * Author: Romes
 * Author URL: http://romes.dev
 */
"use strict";
var pstudio_ribbon = {};

pstudio_ribbon = {
	$el: jQuery('.pstudio-albums-carousel'),
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
		if (pstudio_ribbon.type == 'medium') {
			let percent = Math.ceil(pstudio_ribbon.currentStep * 100 / (pstudio_ribbon.maxStep));
			pstudio_ribbon.barTarget = pstudio_ribbon.$bar.width() * (percent/100);
		}
		if (pstudio_ribbon.type == 'vertical') {
			if (pstudio_ribbon.target > $pstudio_window.height()/2) {
				$pstudio_body.addClass('has-to-top');
			} else {
				$pstudio_body.removeClass('has-to-top');
			}
		}
	},

	init: function() {
		/* Determine Type */
		/* -------------- */
		if (pstudio_ribbon.$el.hasClass('is-medium')) {
			pstudio_ribbon.$bar = pstudio_ribbon.$el.parent().children('.pstudio-albums-carousel-progress');
			pstudio_ribbon.barTarget = 0;
			pstudio_ribbon.barCurrent = 0;
			pstudio_ribbon.type = 'medium';
		}
		if (pstudio_ribbon.$el.hasClass('is-vertical')) {
			pstudio_ribbon.type = 'vertical';
		}

		/* Move Functions */
		/* -------------- */
		// Mouse Events
		pstudio_ribbon.$el.on('mousedown', function(e) {
			if (pstudio_ribbon.isTouch) {
				pstudio_ribbon.isTouch = false;
			}
			if (!pstudio_ribbon.$el.hasClass('is-hovered')) {
				e.preventDefault();
				pstudio_ribbon.isDown = true;
				pstudio_ribbon.$el.addClass('is-grabbed');
				if (pstudio_ribbon.type == 'vertical') {
					pstudio_ribbon.old_pageX = e.clientY;
				} else {
					pstudio_ribbon.old_pageX = e.clientX;
				}
			}
		}).on('mouseup', function() {
			pstudio_ribbon.isDown = false;
			pstudio_ribbon.$el.removeClass('is-grabbed');
			pstudio_ribbon.isDownLink = false;
		}).on('mouseleave', function() {
			pstudio_ribbon.isDown = false;
			pstudio_ribbon.$el.removeClass('is-grabbed');
			pstudio_ribbon.isDownLink = false;
		}).on('mousemove', function(e) {
			e.preventDefault();
			if (pstudio_ribbon.isDown) {
				if (pstudio_ribbon.type == 'vertical') {
					let newX = (pstudio_ribbon.old_pageX - e.clientY)*2,
						newTop = pstudio_ribbon.currentStep + newX;
					pstudio_ribbon.old_pageX = e.clientY;
					if (newTop > pstudio_ribbon.maxStep) {
						newTop = pstudio_ribbon.maxStep;
					}
					if (newTop < 0) {
						newTop = 0;
					}
					pstudio_ribbon.currentStep = newTop;
					pstudio_ribbon.target = newTop;
				} else {
					let newX = pstudio_ribbon.old_pageX - e.clientX,
						newTop = pstudio_ribbon.currentStep + newX;
					pstudio_ribbon.old_pageX = e.clientX;
					if (newTop > pstudio_ribbon.maxStep) {
						newTop = pstudio_ribbon.maxStep;
					}
					if (newTop < 0) {
						newTop = 0;
					}
					pstudio_ribbon.currentStep = newTop;
					pstudio_ribbon.target = newTop;
				}
				pstudio_ribbon.tagetChanged();
			}
			if (pstudio_ribbon.isDownLink) {
				pstudio_ribbon.isLinkMoved = true;
			} else {
				pstudio_ribbon.isLinkMoved = false;
			}
		});

		pstudio_ribbon.$el[0].addEventListener('wheel', function(e) {
			var this_delta = e.deltaY;
			if (e.mozInputSource) {
				this_delta = e.deltaY * pstudio_ribbon.mozDelta;
			}
			let newTop = pstudio_ribbon.currentStep + this_delta;
			if (newTop > pstudio_ribbon.maxStep) {
				newTop = pstudio_ribbon.maxStep;
			}
			if (newTop < 0) {
				newTop = 0;
			}
			pstudio_ribbon.currentStep = newTop;
			pstudio_ribbon.target = newTop;
			pstudio_ribbon.tagetChanged();
		});

		// Touch Events
		pstudio_ribbon.$el[0].addEventListener('touchstart', function(e) {
			if (!pstudio_ribbon.isTouch) {
				pstudio_ribbon.isTouch = true;
			}
			pstudio_ribbon.isDown = true;
			pstudio_ribbon.$el.addClass('is-grabbed');
			if (pstudio_ribbon.type == 'vertical') {
				pstudio_ribbon.old_pageX = e.touches[0].clientY;
			} else {
				pstudio_ribbon.old_pageX = e.touches[0].clientX;
			}
		}, false);
		pstudio_ribbon.$el[0].addEventListener('touchmove', function(e) {
			if (pstudio_ribbon.isDown) {
				if (pstudio_ribbon.type == 'vertical') {
					let newX = (pstudio_ribbon.old_pageX - e.touches[0].clientY)*pstudio_ribbon.touchSpeed.vertical,
						newTop = pstudio_ribbon.currentStep + newX;
					pstudio_ribbon.old_pageX = e.touches[0].clientY;
					if (newTop > pstudio_ribbon.maxStep) {
						newTop = pstudio_ribbon.maxStep;
					}
					if (newTop < 0) {
						newTop = 0;
					}
					pstudio_ribbon.currentStep = newTop;
					pstudio_ribbon.target = newTop;
				} else {
					let newX = (pstudio_ribbon.old_pageX - e.touches[0].clientX)*pstudio_ribbon.touchSpeed.horizontal,
						newTop = pstudio_ribbon.currentStep + newX;

					pstudio_ribbon.old_pageX = e.touches[0].clientX;
					if (newTop > pstudio_ribbon.maxStep) {
						newTop = pstudio_ribbon.maxStep;
					}
					if (newTop < 0) {
						newTop = 0;
					}
					pstudio_ribbon.currentStep = newTop;
					pstudio_ribbon.target = newTop;
				}
				pstudio_ribbon.tagetChanged();
			}
			if (pstudio_ribbon.isDownLink) {
				pstudio_ribbon.isLinkMoved = true;
			} else {
				pstudio_ribbon.isLinkMoved = false;
			}
		}, false);
		pstudio_ribbon.$el[0].addEventListener('touchend', function(e) {
			pstudio_ribbon.isDown = false;
			pstudio_ribbon.$el.removeClass('is-grabbed');
			pstudio_ribbon.isDownLink = false;
		}, false);

		// Links and Buttons
		pstudio_ribbon.$el.find('a.pstudio-button').on('mouseover', function() {
			if (!pstudio_ribbon.isTouch) {
				pstudio_ribbon.$el.addClass('is-hovered');
			}
		}).on('mouseout', function(){
			pstudio_ribbon.$el.removeClass('is-hovered');
		});

		pstudio_ribbon.$el.find('a').on('mousedown', function() {
			pstudio_ribbon.isDownLink = true;
		}).on('click', function(e) {
			if (pstudio_ribbon.isLinkMoved) {
				e.preventDefault();
				return false;
			}
			pstudio_ribbon.isDownLink = false;
			pstudio_ribbon.isLinkMoved = false;
		});

		pstudio_ribbon.$el.find('.pstudio-album-item').each(function() {
			if ('IntersectionObserver' in window) {
				pstudio_ribbon.observer.observe(this);
			} else {
				jQuery(this).children('.pstudio-album-item__inner').addClass('is-inview');
			}
		});

		// Layout
		pstudio_ribbon.layout();

		// Start Animation
		pstudio_ribbon.animate();

		// Bind Window Actions
		jQuery(window).on('resize', function() {
			// Window Resize Actions
			pstudio_ribbon.layout();
			setTimeout(pstudio_ribbon.layout(), 500);
		}).on('load', function() {
			// Window Load Actions
			pstudio_ribbon.layout();
		});
	},
	layout: function() {
		$pstudio_body.height($pstudio_window.height());

		let $this = pstudio_ribbon.$el,
			fullWidth = 0,
			setHeight;

		if (pstudio_ribbon.type == 'large') {
			setHeight = $pstudio_window.height() - $pstudio_header.height() - $pstudio_footer.height();
			$this.css('top', $pstudio_header.height());
		}
		if (pstudio_ribbon.type == 'medium') {
			setHeight = $pstudio_window.height()/2;
		}

		if (pstudio_ribbon.type == 'large' || pstudio_ribbon.type == 'medium') {
			$this.height(setHeight).find('.pstudio-album-item__title').width(setHeight);
			$this.find('.pstudio-album-item').each(function() {
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

		if (pstudio_ribbon.type == 'vertical') {
			$this.find('.pstudio-album-item').each(function() {
				let $this_slide = jQuery(this),
					$this_slide_img = $this_slide.find('img'),
					setHeight = $this_slide_img.height();

				$this_slide.find('.pstudio-album-item__title').width(setHeight);

				fullWidth = fullWidth + $this_slide.height();
			});
			fullWidth = fullWidth + $pstudio_header.height() + $pstudio_footer.height();
			$this.css('padding', $pstudio_header.height()+'px 0 ' + $pstudio_footer.height() + 'px 0')
			$this.height(fullWidth);
		} else {
			$this.width(fullWidth);
		}

		if (pstudio_ribbon.type == 'vertical') {
			let body_height = fullWidth;
			pstudio_ribbon.maxStep = body_height - $pstudio_window.height();
		} else {
			let spacingLeft = parseInt($this.find('.pstudio-album-item__inner').css('margin-right'), 10),
				body_height = fullWidth - $pstudio_window.width() + spacingLeft + $pstudio_window.height();
			$this.css('padding-left', spacingLeft + 'px');
			pstudio_ribbon.maxStep = body_height - $pstudio_window.height();
		}

		if (pstudio_ribbon.currentStep > pstudio_ribbon.maxStep) {
			pstudio_ribbon.currentStep = pstudio_ribbon.maxStep;
			pstudio_ribbon.target = pstudio_ribbon.currentStep;
		}
		if (pstudio_ribbon.currentStep < 0) {
			pstudio_ribbon.currentStep = 0;
			pstudio_ribbon.target = pstudio_ribbon.currentStep;
		}
	},
	animate: function() {
		if (pstudio_ribbon.type == 'vertical') {
			// Scroll Content
			pstudio_ribbon.current += ((pstudio_ribbon.target - pstudio_ribbon.current) * 0.1);
			pstudio_ribbon.$el.css('transform', 'translate3d(0, -'+ pstudio_ribbon.current +'px, 0)');
			// Img Motion Effect
			let img_current = (pstudio_ribbon.target - pstudio_ribbon.current) * 0.1;
			pstudio_ribbon.$el.find('.pstudio-album-item__overlay').css('transform', 'translate3d(0, '+ img_current +'px, 0)');
			pstudio_ribbon.$el.find('img').css('transform', 'translate3d(0, '+ img_current +'px, 0)');
		} else {
			// Scroll Content
			pstudio_ribbon.current += ((pstudio_ribbon.target - pstudio_ribbon.current) * 0.1);
			pstudio_ribbon.$el.css('transform', 'translate3d(-'+ pstudio_ribbon.current +'px, 0, 0)');
			// Img Motion Effect
			let img_current = (pstudio_ribbon.target - pstudio_ribbon.current) * 0.1;
			pstudio_ribbon.$el.find('.pstudio-album-item__overlay').css('transform', 'translate3d('+ img_current +'px, 0, 0)');
			pstudio_ribbon.$el.find('img').css('transform', 'translate3d('+ img_current +'px, 0, 0)');
			// Bar Update
			if (pstudio_ribbon.type == 'medium') {
				pstudio_ribbon.barCurrent += ((pstudio_ribbon.barTarget - pstudio_ribbon.barCurrent) * 0.1);
				pstudio_ribbon.$bar.children('.pstudio-albums-carousel-progress__bar').width(pstudio_ribbon.barCurrent);
			}
		}
		// Update Frame
		requestAnimationFrame( pstudio_ribbon.animate );
	}
};
if ('IntersectionObserver' in window) {
	pstudio_ribbon.observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if(entry.isIntersecting) {
				jQuery(entry.target).children('.pstudio-album-item__inner').addClass('is-inview');
			} else {
				jQuery(entry.target).children('.pstudio-album-item__inner').removeClass('is-inview');
			}
		});
	});
}

// Init when Document is ready
jQuery(document).ready( function() {
	pstudio_ribbon.init();
});
