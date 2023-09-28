/**
 * Author: Romes
 * Author URL: http://romes.dev
 */
"use strict";

var pstudio = {
		flocker: {
			field_changed:	 false,
			field_interract: false,
			form_interract:  false
		}
	},
    $pstudio_html = jQuery('html'),
	pstudio_tns = [],
    $pstudio_body = jQuery('body'),
    $pstudio_window = jQuery(window),
    $pstudio_header = jQuery('header#pstudio-header'),
    $pstudio_footer = jQuery('footer#pstudio-footer'),
	$pstudio_main = jQuery('main.pstudio-content-wrap'),
	$pstudio_scroll = jQuery('.pstudio-content-scroll'),
	$pstudio_header_holder;

// Default Options
pstudio.config = {
    'smooth_ease' : 0.1,
	'content_load_delay': 0.8
}

class pstudio_Before_After {
	constructor($obj) {
		if ($obj instanceof jQuery) {
			let this_class = this;
			this.$el = {
				$wrap: $obj,
				$before : jQuery('<div class="pstudio-before-after-img pstudio-before-img"/>').appendTo($obj),
				$after : jQuery('<div class="pstudio-before-after-img pstudio-after-img"/>').appendTo($obj),
				$divider : jQuery('<div class="pstudio-before-after-divider"><i class="la la-arrows-h"></i></div>').appendTo($obj),
			};
			this.offset = this.$el.$wrap.offset().left;
			this.size = this.$el.$wrap.width();
			this.current = 50;
			this.target = 50;
			this.isDown = false;

			this.$el.$before.css('background-image', 'url('+ this.$el.$wrap.data('img-before') +')');
			this.$el.$after.css('background-image', 'url('+ this.$el.$wrap.data('img-after') +')');

			// Mouse Events
			this.$el.$wrap.on('mousedown', function(e) {
				e.preventDefault();
				this_class.isDown = true;
			}).on('mousemove', function(e) {
				e.preventDefault();
				if (this_class.isDown) {
					let position = e.pageX - this_class.offset,
						newTarget = position/this_class.size;
					if (newTarget > 1)
						newTarget = 1;
					if (newTarget < 0)
						newTarget = 0;
					this_class.target = newTarget * 100;
				}
			}).on('mouseleave', function(e) {
				e.preventDefault();
				this_class.isDown = false;
			}).on('mouseup', function(e) {
				e.preventDefault();
				this_class.isDown = false;
			});

			// Touch Events
			this.$el.$wrap[0].addEventListener('touchstart', function(e) {
				e.preventDefault();
				this_class.isDown = true;
			}, false);
			this.$el.$wrap[0].addEventListener('touchmove', function(e) {
				e.preventDefault();
				if (this_class.isDown) {
					let position = e.touches[0].clientX - this_class.offset,
						newTarget = position/this_class.size;
					if (newTarget > 1)
						newTarget = 1;
					if (newTarget < 0)
						newTarget = 0;
					this_class.target = newTarget * 100;
				}
			}, false);
			this.$el.$wrap[0].addEventListener('touchend', function(e) {
				e.preventDefault();
				this_class.isDown = false;
			}, false);

			// Window Events
			$pstudio_window.on('resize', function() {
				this_class.layout();
				this_class.reset();
			}).on('load', function() {
				this_class.layout();
			});

			// Layout
			this.layout();

			// Run Animation
			this.requestAnimation();
		} else {
			return false;
		}
	}

	layout() {
		this.offset = this.$el.$wrap.offset().left;
		this.size = this.$el.$wrap.width();
	}
	reset() {
		this.current = 50;
		this.target = 50;
	}
	requestAnimation() {
		this.animation = requestAnimationFrame(() => this.animate());
	}
	animate() {
		this.current += ((this.target - this.current) * 0.1);
		this.$el.$after.css('width', parseFloat(this.current).toFixed(1) +'%');
		this.$el.$divider.css('left', parseFloat(this.current).toFixed(1) +'%');
		this.requestAnimation();
	}
}

// Magic Cursor
pstudio.cursor = {
	$el : jQuery('.pstudio-cursor'),
	$el_main : jQuery('span.pstudio-cursor-circle'),
	targetX: $pstudio_window.width()/2,
	targetY: $pstudio_window.height()/2,
	currentX: $pstudio_window.width()/2,
	currentY: $pstudio_window.height()/2,
	easing: 0.2,
	init : function() {
		let $this_el = this.$el;
		// Cursor Move
		$pstudio_window.on('mousemove', function(e) {
			pstudio.cursor.targetX = e.clientX - $this_el.width()/2;
			pstudio.cursor.targetY = e.clientY - $this_el.height()/2;
        });
		if ($this_el.length) {
			pstudio.cursor.animate();
		}

		// Show and Hide Cursor
        $pstudio_window.on('mouseleave', function() {
			pstudio.cursor.$el.addClass('is-inactive');
        }).on('mouseenter', function() {
			pstudio.cursor.$el.removeClass('is-inactive');
        });

		// Bind Interractions
		jQuery(document).on('mouseenter', 'a', function() {
			if (jQuery(this).hasClass('pstudio-lightbox-link')) {
				pstudio.cursor.$el.addClass('int-lightbox');
			} else {
				pstudio.cursor.$el.addClass('int-link');
			}
			jQuery(this).on('mouseleave', function() {
				pstudio.cursor.$el.removeClass('int-link int-lightbox');
			});
		}).on('mouseenter', 'button', function() {
			pstudio.cursor.$el.addClass('int-link');
			jQuery(this).on('mouseleave', function() {
				pstudio.cursor.$el.removeClass('int-link');
			});
		}).on('mouseenter', 'input[type="submit"]', function() {
			pstudio.cursor.$el.addClass('int-link');
			jQuery(this).on('mouseleave', function() {
				pstudio.cursor.$el.removeClass('int-link');
			});
		}).on('mouseenter', '.pstudio-back', function() {
			jQuery('.pstudio-back').on('mouseenter', function() {
				pstudio.cursor.$el.addClass('int-link');
				jQuery(this).on('mouseleave', function() {
					pstudio.cursor.$el.removeClass('int-link');
				});
			});
		}).on('mouseenter', '.is-link', function() {
			jQuery('.is-link').on('mouseenter', function() {
				pstudio.cursor.$el.addClass('int-link');
				jQuery(this).on('mouseleave', function() {
					pstudio.cursor.$el.removeClass('int-link');
				});
			});
		}).on('mouseenter', '.pstudio-aside-overlay', function() {
			pstudio.cursor.$el.addClass('int-close');
			jQuery(this).on('mouseleave', function() {
				pstudio.cursor.$el.removeClass('int-close');
			});
		}).on('mouseenter', '.pstudio-before-after', function() {
			pstudio.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				pstudio.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.pstudio-testimonials-carousel .tns-ovh', function() {
			pstudio.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				pstudio.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.pstudio-albums-slider', function() {
			pstudio.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				pstudio.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.pswp__scroll-wrap', function() {
			pstudio.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				pstudio.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.pstudio-albums-carousel', function() {
			if (jQuery(this).hasClass('is-vertical')) {
				pstudio.cursor.$el.addClass('int-grab-v');
			} else {
				pstudio.cursor.$el.addClass('int-grab-h');
			}
			jQuery(this).on('mouseleave', function() {
				pstudio.cursor.$el.removeClass('int-grab-h int-grab-v');
			});
		});
	},
	animate: function() {
		let $this_el = pstudio.cursor.$el;
		pstudio.cursor.currentX += ((pstudio.cursor.targetX - pstudio.cursor.currentX) * pstudio.cursor.easing);
		pstudio.cursor.currentY += ((pstudio.cursor.targetY - pstudio.cursor.currentY) * pstudio.cursor.easing);
		$this_el.css('transform', 'translate3d('+ pstudio.cursor.currentX +'px, '+ pstudio.cursor.currentY +'px, 0)');
		requestAnimationFrame( pstudio.cursor.animate );
	}
};
pstudio.cursor.init();

// Lightbox
if ( jQuery('.pstudio-lightbox-link').length ) {
	pstudio.pswp = {
		gallery : Array(),
		html : jQuery('\
		<!-- Root element of PhotoSwipe. Must have class pswp. -->\
		<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">\
			<div class="pswp__bg"></div><!-- PSWP Background -->\
			\
			<div class="pswp__scroll-wrap">\
				<div class="pswp__container">\
					<div class="pswp__item"></div>\
					<div class="pswp__item"></div>\
					<div class="pswp__item"></div>\
				</div><!-- .pswp__container -->\
				\
				<div class="pswp__ui pswp__ui--hidden">\
					<div class="pswp__top-bar">\
						<!--  Controls are self-explanatory. Order can be changed. -->\
						<div class="pswp__counter"></div>\
						\
						<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>\
						\
						<div class="pswp__preloader">\
							<div class="pswp__preloader__icn">\
							  <div class="pswp__preloader__cut">\
								<div class="pswp__preloader__donut"></div>\
							  </div><!-- .pswp__preloader__cut -->\
							</div><!-- .pswp__preloader__icn -->\
						</div><!-- .pswp__preloader -->\
					</div><!-- .pswp__top-bar -->\
					\
					<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">\
						<div class="pswp__share-tooltip"></div>\
					</div><!-- .pswp__share-modal -->\
					\
					<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>\
					<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>\
					\
					<div class="pswp__caption">\
						<div class="pswp__caption__center"></div>\
					</div><!-- .pswp__caption -->\
				</div><!-- .pswp__ui pswp__ui--hidden -->\
			</div><!-- .pswp__scroll-wrap -->\
		</div><!-- .pswp -->').appendTo($pstudio_body)
	};
}

// pstudio Kenburns
if (jQuery('.pstudio-kenburns-slider').length) {
	pstudio.kenburns = {
		init: function() {
			// Set Variables
			let this_f = this;
			this_f.$el = jQuery('.pstudio-kenburns-slider');
			this_f.items = this_f.$el.find('.pstudio-kenburns-slide').length;
			this_f.transition = parseInt(this_f.$el.data('transition'),10);
			this_f.delay = parseInt(this_f.$el.data('delay'), 10)/1000 + this_f.transition*0.001;
			this_f.zoom = this_f.$el.data('zoom');
			this_f.from = this_f.zoom;
			this_f.to = 1;
			this_f.active = 0;

			// Setup Items
			let prev_offset_x = 0,
				prev_offset_y = 0;

			this_f.$el.find('.pstudio-kenburns-slide').each(function() {
				let offset_x = Math.random() * 100,
					offset_y = Math.random() * 100;

				if (prev_offset_x > 50 && offset_x > 50) {
					offset_x = offset_x - 50;
				} else if (prev_offset_x < 50 && offset_x < 50) {
					offset_x = offset_x + 50;
				}
				if (prev_offset_y > 50 && offset_y > 50) {
					offset_y = offset_y - 50;
				} else if (prev_offset_y < 50 && offset_y < 50) {
					offset_y = offset_y + 50;
				}

				prev_offset_x = offset_x;
				prev_offset_y = offset_y;

				jQuery(this).css({
					'transition' : 'opacity ' + this_f.transition + 'ms',
					'transform-origin' : offset_x + '% ' + offset_y + '%',
					'background-image' : 'url('+ jQuery(this).data('src')+')'
				});
			});

			// Run Slider
			pstudio.kenburns.change();
		},
		change: function() {
			let this_f = this,
				scale_from = this_f.from,
				scale_to = this_f.to;

			// Loop
			if (this_f.active >= this_f.items) {
				this_f.active = 0;
			}
			let current_slide = this_f.$el.find('.pstudio-kenburns-slide').eq(this_f.active);

			gsap.fromTo(current_slide, {
				scale: scale_from,
				onStart: function() {
					current_slide.addClass('is-active');
				}
			},
			{
				scale: scale_to,
				duration: this_f.delay,
				ease: 'none',
				onComplete: function() {
					pstudio.kenburns.active++;
					pstudio.kenburns.from = scale_to;
					pstudio.kenburns.to = scale_from;
					pstudio.kenburns.change();
					pstudio.kenburns.$el.find('.is-active').removeClass('is-active');
				}
			});
		}
	};
}

// Counter
pstudio.counter = function( this_el ) {
	jQuery(this_el).prop('Counter', 0).animate({
		Counter: jQuery(this_el).text()
	}, {
		duration: parseInt(jQuery(this_el).parent().data('delay'), 10),
		easing: 'swing',
		step: function (now) {
			jQuery(this_el).text(Math.ceil(now));
		}
	});
}

// Circle Progress Bar
pstudio.progress = {
	init: function(this_el) {
		let $this = jQuery(this_el),
			$bar_wrap = jQuery('<div class="pstudio-progress-item-wrap"/>')
						.prependTo($this),
			this_size = this.getSize(this_el),
			$bar_svg = jQuery('\
				<svg width="'+ this_size.svgSize +'" height="'+ this_size.svgSize +'" viewPort="0 0 '+ this_size.barSize +' '+ this_size.barSize +'" version="1.1" xmlns="http://www.w3.org/2000/svg">\
					<circle class="pstudio-progress-circle--bg" r="'+ this_size.r +'" cx="'+ this_size.barSize +'" cy="'+ this_size.barSize +'" fill="transparent" stroke-dasharray="'+ this_size.dashArray +'" stroke-dashoffset="0"></circle>\
					<circle class="pstudio-progress-circle--bar" transform="rotate(-90, '+ this_size.barSize +', '+ this_size.barSize +')" r="'+ this_size.r +'" cx="'+ this_size.barSize +'" cy="'+ this_size.barSize +'" fill="transparent" stroke-dasharray="'+ this_size.dashArray +'" stroke-dashoffset="'+ this_size.dashArray +'"></circle>\
				</svg>').appendTo($bar_wrap);
			$bar_svg.find('.pstudio-progress-circle--bar').css('transition', 'stroke-dashoffset ' + $this.data('delay')+'ms ease-in-out');
			$bar_wrap.append('<span class="pstudio-progress-counter">' + $this.data('percent') + '</span>');

		$pstudio_window.on('resize', this.layout(this_el));
	},
	layout: function(this_el) {
		let $this = jQuery(this_el);
		if ($this.find('svg').length) {
			let this_size = this.getSize(this_el),
				$svg = $this.find('svg'),
				$barBg = $this.find('.pstudio-progress-circle--bg'),
				$bar = $this.find('.pstudio-progress-circle--bar');
			$svg.attr('width', this_size.svgSize)
				.attr('height', this_size.svgSize)
				.attr('viewPort', '0 0 '+ this_size.barSize +' '+ this_size.barSize);
			$barBg.css({
				'r' : this_size.r,
				'cx' : this_size.barSize,
				'cy' : this_size.barSize,
				'stroke-dasharray': this_size.dashArray,
			});
			$bar.css({
				'r' : this_size.r,
				'cx' : this_size.barSize,
				'cy' : this_size.barSize,
				'stroke-dasharray': this_size.dashArray,
			}).attr('transform', 'rotate(-90, '+ this_size.barSize +', '+ this_size.barSize +')');
			if ($this.hasClass('is-done')) {

			} else {
				$bar.css('stroke-dashoffset', this_size.dashArray);
			}
		}
	},
	getSize: function(this_el) {
		let $this = jQuery(this_el),
			$wrap = $this.find('.pstudio-progress-item-wrap'),
			sizes = {
				percent: parseInt($this.data('percent'), 10),
				svgSize: $wrap.width(),
				stroke: parseInt($wrap.css('stroke-width'), 10),
			}
			sizes.barSize = Math.floor(sizes.svgSize/2);
			sizes.r = sizes.barSize - sizes.stroke;
			sizes.dashArray = parseFloat(Math.PI*(sizes.r*2)).toFixed(2);
			sizes.dashOffset = parseFloat(sizes.dashArray - (sizes.dashArray*sizes.percent)/100).toFixed(2);

		return sizes;
	},
	animate: function(this_el) {
		let $this = jQuery(this_el),
			$this_counter = $this.find('span.pstudio-progress-counter'),
			this_size = this.getSize(this_el),
			$bar = $this.find('.pstudio-progress-circle--bar');
		$bar.css('stroke-dashoffset', this_size.dashOffset);
		$this_counter.prop('Counter', 0).animate({
			Counter: $this_counter.text()
		}, {
			duration: parseInt($this_counter.parents('.pstudio-progress-item').data('delay'), 10),
			easing: 'swing',
			step: function (now) {
				$this_counter.text(Math.ceil(now)+'%');
			}
		});

	}
}
if ('IntersectionObserver' in window) {
	pstudio.progress.observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!jQuery(entry.target).hasClass('is-done')) {
				if(entry.isIntersecting) {
					jQuery(entry.target).addClass('is-done');
					pstudio.progress.animate(jQuery(entry.target)[0]);
				}
			}
		});
	});
}

// Coming Soon Count Down
pstudio.count_down = {
	init : function() {
		let $dom = jQuery('#pstudio-coming-soon'),
			datetime = new Date( $dom.find('time').text() + 'T00:00:00'),
			is_this;

		$dom.find('time').remove();
		this.labels = $dom.data('labels');
		this.days = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ pstudio.count_down.labels[0] +'</span>');
		this.hours = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ pstudio.count_down.labels[1] +'</span>');
		this.minutes = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ pstudio.count_down.labels[2] +'</span>');
		this.seconds = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ pstudio.count_down.labels[3] +'</span>');

		this.update( datetime );

		if ( this.interval ) {
			clearInterval( this.interval );
		}

		this.interval = setInterval( function() {
			pstudio.count_down.update( datetime );
		}, 1000);
	},
	update : function( endDate ) {
		let now = new Date();
		let difference = endDate.getTime() - now.getTime();

		if (difference <= 0) {
			clearInterval( this.interval );
		} else {
			let seconds = Math.floor(difference / 1000);
			let minutes = Math.floor(seconds / 60);
			let hours = Math.floor(minutes / 60);
			let days = Math.floor(hours / 24);

			hours %= 24;
			minutes %= 60;
			seconds %= 60;

			if (days < 10) {
				days = ("0" + days).slice(-2);
			}

			this.days.text(days);
			this.hours.text(("0" + hours).slice(-2));
			this.minutes.text(("0" + minutes).slice(-2));
			this.seconds.text(("0" + seconds).slice(-2));
		}
	}
};

// Smooth Scroll
pstudio.old_scroll_top = 0;
pstudio.sScroll = {
	target: 0,
	current: 0,
	animate: function() {
		pstudio.sScroll.current += ((pstudio.sScroll.target - pstudio.sScroll.current) * pstudio.config.smooth_ease);
		$pstudio_scroll.css('transform', 'translate3d(0, -'+ pstudio.sScroll.current +'px, 0)');

		if ($pstudio_scroll.height() !== $pstudio_body.height()) {
			pstudio.sScroll.layout();
		}

		requestAnimationFrame( pstudio.sScroll.animate );
	},
	layout: function() {
		if ($pstudio_scroll.length) {
			let this_content = $pstudio_scroll.children('.pstudio-content');
			this_content.css('min-height', '0px');

			// Set Body Height (for smooth scroll)
			if ($pstudio_scroll.height() <= $pstudio_window.height()) {
				let min_height = $pstudio_window.height() - $pstudio_footer.height();

				if (!$pstudio_body.hasClass('no-header-padding'))
					min_height = min_height - $pstudio_scroll.children('.pstudio-header-holder').height();

				this_content.css('min-height', min_height+'px');
				$pstudio_scroll.addClass('is-centered');
			} else {
				$pstudio_scroll.removeClass('is-centered');
			}
			if ($pstudio_body.hasClass('pstudio-smooth-scroll')) {
				$pstudio_body.height($pstudio_scroll.height());
			}
		}
	}
};
if ($pstudio_scroll.length || $pstudio_body.hasClass('pstudio-home-template')) {
	pstudio.sScroll.animate();
}

pstudio.init = function() {
	$pstudio_body.addClass('is-init');
	pstudio.old_scroll_top = $pstudio_window.scrollTop();

	// Contact Form
	if (jQuery('form.pstudio-contact-form').length) {
		jQuery('form.pstudio-contact-form').each(function() {
			let $this = jQuery(this),
				$response = $this.find('.pstudio-contact-form__response'),
				formData;

			// Create New Fields
			$this.find('input').on('change', function() {
				pstudio.flocker.field_changed = true;
			}).on('keyup', function() {
				pstudio.flocker.field_interract = true;
			});
			$this.find('textarea').on('change', function() {
				pstudio.flocker.field_changed = true;
			}).on('keyup', function(e) {
				pstudio.flocker.field_interract = true;
			});

			$this.find('input')[0].addEventListener('touchenter', function(e) {
        		pstudio.flocker.field_interract = true;
				pstudio.flocker.form_interract = true;
    		}, false);
			$this.find('textarea')[0].addEventListener('touchenter', function(e) {
        		pstudio.flocker.field_interract = true;
				pstudio.flocker.form_interract = true;
    		}, false);

			this.addEventListener('touchenter', function(e) {
        		pstudio.flocker.form_interract = true;
    		}, false);
			$this.on('mouseenter', function() {
				pstudio.flocker.form_interract = true;
			});

			$this.submit(function(e) {
				e.preventDefault();
				if (pstudio.flocker.form_interract && pstudio.flocker.field_interract && pstudio.flocker.field_changed) {
					$this.addClass('is-in-action');
					formData = jQuery(this).serialize();
					jQuery.ajax({
						type: 'POST',
						url: $this.attr('action'),
						data: formData
					})
					.done(function(response) {
						$this.removeClass('is-in-action');
						$response.empty().removeClass('alert-danger').addClass('alert-success');
						$response.html('<span>' + response + '</span>');
						$this.find('input:not([type="submit"]), textarea').val('');
						pstudio.flocker.form_interract  = false;
						pstudio.flocker.field_interract = false;
						pstudio.flocker.field_changed   = false;
					})
					.fail(function(data) {
						$this.removeClass('is-in-action');
						$response.empty().removeClass('alert-success').addClass('alert-danger');
						$response.html('<span>' + data.responseText + '</span>');
						pstudio.flocker.form_interract  = false;
						pstudio.flocker.field_interract = false;
						pstudio.flocker.field_changed   = false;
					});
				} else {
					if ($this.attr('data-spam-message')) {
						var spam_message = '<span>'+ $this.attr('data-spam-message') +'</span>';
					} else {
						var spam_message = '<span>No user actions detected. Look like a spam bot.</span>';
					}
					pstudio.flocker.form_interract  = false;
					pstudio.flocker.field_interract = false;
					pstudio.flocker.field_changed   = false;
					$this.find('input:not([type="submit"]), textarea').val('');
					$response.empty().removeClass('alert-success').addClass('alert-danger');
					$response.html(spam_message);
				}
			});
		});
	}

	// Header Holder
	$pstudio_header_holder = jQuery('<div class="pstudio-header-holder"></div>');
	$pstudio_header_holder.height($pstudio_header.height()).prependTo($pstudio_scroll);

	// Set Logo Size
	if (jQuery('a.pstudio-logo').length) {
		jQuery('a.pstudio-logo').each(function() {
			let $this = jQuery(this),
				$img = $this.children('img'),
				w = $img.attr('width'),
				h = $img.attr('height');
			if ($this.hasClass('is-retina')) {
				$this.width(w/2).height(h/2);
			} else {
				$this.width(w).height(h);
			}
		});
	}

	// Set Menu Active Parent Items
	if (jQuery('.current-menu-item').length) {
		jQuery('.current-menu-item').each(function() {
			jQuery(this).parents('li').addClass('current-menu-ancestor');
		});
	}

	// Mobile DOM Construct
	if (jQuery('.pstudio-page-title-wrap').length) {
		if (jQuery('.pstudio-content-wrap .pstudio-content').length) {
			let pstudio_mobile_title = jQuery('<div class="pstudio-mobile-title-wrap">' + jQuery('.pstudio-page-title-wrap').html() + '</div>');
			jQuery('.pstudio-content-wrap .pstudio-content').prepend(pstudio_mobile_title);
		}
	}
	let pstudio_mobile_header = jQuery('<div class="pstudio-mobile-header">'),
		mobile_menu_button = jQuery('<a href="#" class="pstudio-mobile-menu-button"><i class="la la-bars"></i></a>').appendTo(pstudio_mobile_header),
		mobile_menu = jQuery('<nav class="pstudio-mobile-menu"></nav>').appendTo($pstudio_body),
		mobile_menu_close = jQuery('<a href="#" class="pstudio-mobile-menu-close"></a>').appendTo(mobile_menu);

	if (jQuery('.pstudio-aside-overlay').length) {
		pstudio_mobile_header.append('\
			<a class="pstudio-aside-toggler" href="#">\
				<span class="pstudio-aside-toggler__icon01"></span>\
				<span class="pstudio-aside-toggler__icon02"></span>\
				<span class="pstudio-aside-toggler__icon03"></span>\
			</a>');
	}

	// Mobile Meintenance Email
	if ($pstudio_body.hasClass('pstudio-maintenance-wrap')) {
		pstudio_mobile_header.prepend('<a class="pstudio-contacts-toggler" href="#"><i class="la la-envelope"></i></a>');
		jQuery(document).on('click', '.pstudio-contacts-toggler', function() {
			$pstudio_body.addClass('contacts-shown');
		});
		jQuery(document).on('click', '.pstudio-contacts-close', function() {
			$pstudio_body.removeClass('contacts-shown');
		});
	}

	$pstudio_header.find('.pstudio-nav-block').append(pstudio_mobile_header);

	if ($pstudio_header.find('.pstudio-nav').length) {
		mobile_menu.append('\
			<div class="pstudio-mobile-menu-inner">\
				<div class="pstudio-mobile-menu-content">\
					'+ $pstudio_header.find('.pstudio-nav').html() +'\
				</div>\
			</div>\
		');
		mobile_menu.find('ul.main-menu a').on('click', function(e) {
			var $this = jQuery(this),
				$parent = $this.parent();
			if ($parent.hasClass('.menu-item-has-children') || $parent.find('ul').length) {
				e.preventDefault();
				$parent.children('ul').slideToggle(300).toggleClass('is-open');
			}
		});
		mobile_menu.find('ul.sub-menu').slideUp(1);
	}

	mobile_menu_button.on('click', function() {
		$pstudio_body.addClass('pstudio-mobile-menu-shown').addClass('is-locked');
		pstudio.old_scroll_top = $pstudio_window.scrollTop();
		gsap.fromTo('.pstudio-mobile-menu ul.main-menu > li',
			{
				x: 0,
				y: 40,
				opacity: 0,
			},
			{
				x: 0,
				y: 0,
				opacity: 1,
				duration: 0.2,
				delay: 0.3,
				stagger: 0.1,
				onComplete: function() {
					$pstudio_body.removeClass('is-locked');
				}
			},
		);
	});

	mobile_menu_close.on('click', function() {
		let setDelay = 0;
		$pstudio_body.addClass('is-locked');
		if (mobile_menu.find('.is-open').length) {
			mobile_menu.find('ul.sub-menu').slideUp(300);
			setDelay = 0.3;
		}
		gsap.fromTo('.pstudio-mobile-menu ul.main-menu > li',
			{
				x: 0,
				y: 0,
				opacity: 1
			},
			{
				x: 0,
				y: -40,
				opacity: 0,
				duration: 0.2,
				delay: setDelay,
				stagger: 0.1,
				onComplete: function() {
					$pstudio_body.removeClass('pstudio-mobile-menu-shown').removeClass('is-locked');
				}
			},
		);
	});

	jQuery('.pstudio-menu-overlay').on('click', function() {
		$pstudio_body.removeClass('pstudio-mobile-menu-shown').removeClass('is-locked');
	});

	// Aside Open and Close
	jQuery(document).on('click', 'a.pstudio-aside-toggler', function(e) {
		e.preventDefault();
		$pstudio_body.addClass('pstudio-aside-shown').removeClass('pstudio-menu-fade');
		pstudio.old_scroll_top = $pstudio_window.scrollTop();
	});
	jQuery('a.pstudio-aside-close').on('click', function(e) {
		e.preventDefault();
		$pstudio_body.removeClass('pstudio-aside-shown');
	});
	jQuery('.pstudio-aside-overlay').on('click', function() {
		$pstudio_body.removeClass('pstudio-aside-shown');
	});

    // Main Nav Events
    jQuery('nav.pstudio-nav a').on( 'mouseenter', function() {
        $pstudio_body.addClass('pstudio-menu-fade');
    });
    jQuery('nav.pstudio-nav').on( 'mouseleave', function() {
        $pstudio_body.removeClass('pstudio-menu-fade');
    });

	// Back Button Functions
	jQuery('.pstudio-back').on('click', function(e) {
		e.preventDefault();
		var $this = jQuery(this);

		// Back to Top
		if ($this.hasClass('is-to-top')) {
			if ($pstudio_window.scrollTop() > $pstudio_window.height()/2) {
				$pstudio_body.addClass('has-to-top');
			}
			$this.addClass('in-action');

			if (jQuery('.pstudio-albums-carousel').length) {
				pstudio_ribbon.target = 0;
				pstudio_ribbon.currentStep = 0;
				setTimeout(function() {
					$pstudio_body.removeClass('has-to-top');
					$this.removeClass('in-action');
				},300, $this);
			} else {
				jQuery('html, body').stop().animate({scrollTop: 0}, 500, function() {
					$pstudio_body.removeClass('has-to-top');
					$this.removeClass('in-action');
				});
			}
		}

		// Maintenace Mode - Write Message
		if ($this.hasClass('is-message')) {
			$pstudio_body.addClass('is-locked in-message-mode');
			$this.parent().removeClass('is-loaded');
			gsap.to('.pstudio-content-wrap .pstudio-content', {
				opacity: 0,
				y: -150,
				duration: 0.7,
				onComplete: function() {
					jQuery('.pstudio-back-wrap .is-message').hide();
					jQuery('.pstudio-back-wrap .is-message-close').show();
				}
			});
			gsap.to('.pstudio-page-background', {
				opacity: 0,
				scale: 1.05,
				duration: 1,
			});
			gsap.to('#pstudio-contacts-wrap', {
				opacity: 1,
				y: 0,
				duration: 0.7,
				delay: 0.3,
				onComplete: function() {
					$pstudio_body.removeClass('is-locked');
					jQuery('.pstudio-back-wrap').addClass('is-loaded');
				}
			});
		}

		// Maintenace Mode - Close Message
		if ($this.hasClass('is-message-close')) {
			$pstudio_body.addClass('is-locked').removeClass('in-message-mode');
			$this.parent().removeClass('is-loaded');
			gsap.to('#pstudio-contacts-wrap', {
				opacity: 0,
				y: 150,
				duration: 0.7,
				onComplete: function() {
					jQuery('.pstudio-back-wrap .is-message').show();
					jQuery('.pstudio-back-wrap .is-message-close').hide();
				}
			});
			gsap.to('.pstudio-page-background', {
				opacity: 0.13,
				scale: 1,
				duration: 1,
			});
			gsap.to('.pstudio-content-wrap .pstudio-content', {
				opacity: 1,
				y: 0,
				duration: 1,
				delay: 0.3,
				onComplete: function() {
					$pstudio_body.removeClass('is-locked');
					jQuery('.pstudio-back-wrap').addClass('is-loaded');
				}
			});
		}

		// Home Return
		if ($this.hasClass('is-home-return')) {
			$pstudio_body.addClass('is-locked');
			gsap.fromTo('.pstudio-content', 1, {
				y: 0,
				opacity: 1,
			},
			{
				y: -100,
				opacity: 0,
				duration: 1,
				onComplete: function() {
					if ($pstudio_scroll.find('#pstudio-home-works').length) {
						var $current_content = jQuery('#pstudio-home-works');
					}
					if ($pstudio_scroll.find('#pstudio-home-contacts').length) {
						var $current_content = jQuery('#pstudio-home-contacts');
					}
					for (var i = 0; i < 4; i++) {
						$current_content.unwrap();
					}
					pstudio.sScroll.layout();
					$pstudio_body.height($pstudio_window.height());
				}
			});

			if (jQuery('.pstudio-page-title-wrap').length) {
				jQuery('.pstudio-page-title-wrap').removeClass('is-loaded').addClass('is-inactive');
				gsap.to('.pstudio-page-title-wrap', 0.5, {
					css: {
						top: 0,
					},
					delay: 0.5,
				});
			}
			if (jQuery('.pstudio-back-wrap').length) {
				jQuery('.pstudio-back-wrap').removeClass('is-loaded').addClass('is-inactive');
				gsap.to('.pstudio-back-wrap', 0.5, {
					css: {
						top: '200%',
					},
					delay: 0.5,
				});
			}
			gsap.to('.pstudio-home-link--works', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.pstudio-home-link--works').addClass('is-loaded').removeClass('is-inactive');
				}
			});
			gsap.to('.pstudio-home-link--contacts', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.pstudio-home-link--contacts').addClass('is-loaded').removeClass('is-inactive');
				}
			});
			gsap.to('.pstudio-page-background', {
				opacity: 0.75,
				scale: 1,
				duration: 1,
				delay: 1,
				onComplete: function() {
					$pstudio_body.removeClass('pstudio-content-shown');
					$pstudio_body.removeClass('is-locked');
				}
			});
		}
	});

	// Page Background
	if (jQuery('.pstudio-page-background[data-src]').length) {
		jQuery('.pstudio-page-background[data-src]').each(function() {
			jQuery(this).css('background-image', 'url('+ jQuery(this).data('src') +')');
		});
	}
	// Home Template
    if ($pstudio_body.hasClass('pstudio-home-template')) {
		// Home Links Events
		jQuery('.pstudio-home-link').on('mouseenter', function() {
			$pstudio_body.addClass('is-faded');
		}).on('mouseleave', function() {
			$pstudio_body.removeClass('is-faded');
		}).on('click', function(){
			var $this = jQuery(this);
			pstudio.cursor.$el.removeClass('int-link');
			$pstudio_body.removeClass('is-faded').addClass('pstudio-content-shown');
			jQuery('.pstudio-home-link-wrap').addClass('is-inactive');
			gsap.to('.pstudio-page-background', {
				opacity: 0.1,
				scale: 1.05,
				duration: 1,
				delay: 0.5,
			});
			gsap.to('.pstudio-home-link--works', 0.5, {
				css: {
					top: 0,
				},
				delay: 0.5,
			});
			gsap.to('.pstudio-home-link--contacts', 0.5, {
				css: {
					top: '200%',
				},
				delay: 0.5,
			});

			jQuery('.pstudio-page-title').empty().append('<span>' + $this.find('span:first-child').text() + '</span>' + $this.find('span:last-child').text()).removeClass('is-inactive');
			jQuery('.pstudio-home-return').removeClass('is-inactive');

			gsap.to('.pstudio-page-title-wrap', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.pstudio-page-title-wrap').addClass('is-loaded').removeClass('is-inactive');
				}
			});
			gsap.to('.pstudio-back-wrap', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.pstudio-back-wrap').addClass('is-loaded').removeClass('is-inactive');
				}
			});

			if ($this.parent().hasClass('pstudio-home-link--works')) {
				var $current_content = jQuery('#pstudio-home-works');
			}
			if ($this.parent().hasClass('pstudio-home-link--contacts')) {
				var $current_content = jQuery('#pstudio-home-contacts');
			}

			$current_content.wrap('\
				<main class="pstudio-content-wrap">\
					<div class="pstudio-content-scroll">\
						<div class="pstudio-content">\
							<section class="pstudio-section"></section>\
						</div><!-- .pstudio-content -->\
					</div><!-- .pstudio-content-scroll -->\
				</main>\
			');

			if ($pstudio_body.hasClass('pstudio-smooth-scroll')) {
				$pstudio_scroll = $pstudio_body.find('.pstudio-content-scroll');
				$pstudio_body.height($pstudio_scroll.height());
			}
			pstudio.layout();

			gsap.fromTo('.pstudio-content', 1, {
				y: 100,
				opacity: 0,
			},
			{
				y: 0,
				opacity: 1,
				duration: 1,
				delay: 1.2,
			});
		});
    }

	// All Links Events
	jQuery('a').on('click', function(e) {
		var $this = jQuery(this),
			this_href = $this.attr('href');
		if ($this.attr('target') && '_blank' == $this.attr('target')) {
			// Nothing to do here. Open link in new tab.
		} else if ($this.is('[download]')) {
			// Nothing to do here. Download Link.
		} else if (this_href.indexOf('tel:') > -1 || this_href.indexOf('mailto:') > -1) {
			// Nothing to do here. Tel or Email Link
		} else {
			if (this_href == '#') {
				e.preventDefault();
			} else if ($this.hasClass('pstudio-lightbox-link')) {
				e.preventDefault();
			} else if (this_href.length > 1 && this_href[0] !== '#' && !/\.(jpg|png|gif)$/.test(this_href)) {
				e.preventDefault();
				pstudio.change_location(this_href);
			}
		}
	}).on('mousedown', function(e) {
		e.preventDefault();
	});

	// Masonry Items
	if (jQuery('.is-masonry').length) {
		jQuery('.is-masonry').each(function() {
			jQuery(this).masonry();
		});
	}

	// Init Coming Soon Counter
	if ( jQuery('#pstudio-coming-soon').length ) {
		pstudio.count_down.init();
	}

	// Before After
	if (jQuery('.pstudio-before-after').length) {
		jQuery('.pstudio-before-after').each(function() {
			new pstudio_Before_After(jQuery(this));
		});
	}

	// Kenburns Sliders
	if (jQuery('.pstudio-kenburns-slider').length) {
		pstudio.kenburns.init();
	}

	// Tiny Slider
	if (jQuery('.pstudio-tns-container').length) {
		jQuery('.pstudio-tns-container').each(function(){
			let $this = jQuery(this),
				$parent = $this.parent(),
				pstudio_tns_options = {
					container: this,
					items: 1,
					axis: 'horizontal',
					mode: 'carousel',
					gutter: 0,
					edgePadding: 0,
					controls: false,
					nav: false,
					navPosition: 'bottom',
					speed: 1000,
					mouseDrag: true,
				};

			if ($parent.hasClass('pstudio-testimonials-carousel')) {
				pstudio_tns_options.autoHeight = true;
				pstudio_tns_options.center = true;
				pstudio_tns_options.nav = true;
				pstudio_tns_options.loop = true;
				pstudio_tns_options.gutter = 40;
			}

			// Init
			pstudio_tns[$this.attr('id')] = tns(pstudio_tns_options);

			// After Init Functions
			if ($parent.hasClass('pstudio-testimonials-carousel')) {
				pstudio_tns[$this.attr('id')].events.on('transitionEnd', pstudio.sScroll.layout);
			}
		});
	}

	// Counters
	if (jQuery('.pstudio-counter-item').length) {
		if ('IntersectionObserver' in window) {
			pstudio.counter_observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (!jQuery(entry.target).hasClass('is-counted')) {
						if(entry.isIntersecting) {
							jQuery(entry.target).addClass('is-counted');
							pstudio.counter(jQuery(entry.target).children('.pstudio-counter-value')[0]);
						}
					}
				});
			});
		} else {
			jQuery('.pstudio-counter-item').each(function() {
				jQuery(this).addClass('is-counted');
				pstudio.counter(jQuery(this).children('.pstudio-counter-value')[0]);
			});
		}
	}

	// Circle Progress Bar Init
	if (jQuery('.pstudio-progress-item').length) {
		jQuery('.pstudio-progress-item').each(function() {
			pstudio.progress.init(this);
		});
	}

	// Bricks Gallery
	if (jQuery('.pstudio-gallery-bricks.is-2x3').length) {
		jQuery('.pstudio-gallery-bricks.is-2x3').each(function() {
			let $this = jQuery(this),
				count = 0;

			$this.find('.pstudio-gallery-item').each(function(){
				count++;
				if (count > 5) {
					count = 1;
				}
				if (count == 1 || count == 2) {
					jQuery(this).addClass('is-large');
				} else {
					jQuery(this).addClass('is-small');
				}
			});
		});
	}

	// Lazy Loading Images
	if (jQuery('.lazy').length) {
		jQuery('.lazy').Lazy({
			scrollDirection: 'vertical',
			effect: 'fadeIn',
			visibleOnly: true,
			onError: function(element) {
				console.log('Error Loading ' + element.data('src'));
			},
			afterLoad: function(element) {
            	pstudio.layout();
        	},
		});
	}

	// Justify Gallery
	if (jQuery('.pstudio-justified-gallery').length) {
		jQuery('.pstudio-justified-gallery').justifiedGallery({
			rowHeight : 250,
			captions: false,
			lastRow : 'nojustify',
			margins : 10
		});
	}

	// Lightbox
	if ( jQuery('.pstudio-lightbox-link').length ) {
		jQuery('.pstudio-lightbox-link').each( function() {
			let $this = jQuery(this),
				this_item = {},
				this_gallery = 'default';

			if ($this.data('size')) {
				let item_size = $this.attr('data-size').split('x');
				this_item.w = item_size[0];
				this_item.h = item_size[1];
			}
			this_item.src = $this.attr('href');

			if ( $this.data('caption') ) {
				this_item.title = $this.data('caption');
			}

			if ( $this.data('gallery') ) {
				this_gallery = $this.data('gallery');
			}

			if ( pstudio.pswp.gallery[this_gallery] ) {
				pstudio.pswp.gallery[this_gallery].push(this_item);
			} else {
				pstudio.pswp.gallery[this_gallery] = [];
				pstudio.pswp.gallery[this_gallery].push(this_item);
			}

			$this.data('count', pstudio.pswp.gallery[this_gallery].length - 1);
		});

		jQuery(document).on('click', '.pstudio-lightbox-link', function(e) {
			e.preventDefault();

			let $this = jQuery(this),
				this_index = parseInt($this.data('count'), 10),
				this_gallery = 'default',
				this_options = {
					index: this_index,
					bgOpacity: 0.85,
					showHideOpacity: true,
					getThumbBoundsFn: function(index) {
                        var thumbnail = $this[0],
                            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                            rect = thumbnail.getBoundingClientRect();

                        return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                    },
				};

			if ( $this.data('gallery') ) {
				this_gallery = $this.data('gallery');
			}

			pstudio.pswp.lightbox = new PhotoSwipe($pstudio_body.find('.pswp')[0], PhotoSwipeUI_Default, pstudio.pswp.gallery[this_gallery], this_options);
			pstudio.pswp.lightbox.init();
		});
	}

	// Spacer
	jQuery('.pstudio-spacer').each(function() {
		jQuery(this).height(jQuery(this).data('size'));
	});

    pstudio.layout();
    pstudio.loading();
}

pstudio.layout = function() {
	// Close Mobile Menu (if it don't use)
	if ($pstudio_window.width() > 760) {
		$pstudio_body.removeClass('pstudio-mobile-menu-shown');
	}

	// Header Space Holder
	if (typeof $pstudio_header_holder !== 'undefined') {
		$pstudio_header_holder.height($pstudio_header.height());
	}

	// Header Padding to Home Template
	if (jQuery('#pstudio-home-works').length) {
		jQuery('#pstudio-home-works').css('padding-top', $pstudio_header.height()+'px');
	}
	if (jQuery('#pstudio-home-contacts').length) {
		jQuery('#pstudio-home-contacts').css('padding-top', $pstudio_header.height()+'px');
	}

	// Relayout Masonry items
	if (jQuery('.is-masonry').length) {
		jQuery('.is-masonry').each(function() {
			jQuery(this).masonry('layout');
		});
	}

	// Services List Layout
	if (jQuery('.pstudio-service-item').length) {
		jQuery('.pstudio-service-item').each(function() {
			let $this = jQuery(this),
				$prev = $this.prev('.pstudio-service-item');
			if ($pstudio_window.width() > 1200) {
				if ($prev.length) {
					var set_y = -1*($prev.height() - $prev.find('.pstudio-service-item__content').height())/2;
					$this.css('margin-top', set_y +'px');
				}
			} else {
				$this.css('margin-top', '0px');
			}
		});
	}

	// Fullheight Row
	if (jQuery('.pstudio-row-fullheight').length) {
		jQuery('.pstudio-row-fullheight').each(function() {
			var $this = jQuery(this),
				minHeight = $pstudio_window.height();

			if ($this.hasClass('exclude-header')) {
				minHeight = minHeight - $pstudio_header.height();
			}
			if ($this.hasClass('exclude-footer')) {
				minHeight = minHeight - $pstudio_footer.height();
			}
			$this.css('min-height', minHeight+'px');
		});
	}

    // Dropdown Menu Position
    $pstudio_header.find('.pstudio-menu-offset').removeClass('pstudio-menu-offset');

    $pstudio_header.find('.sub-menu').each(function() {
        var $this = jQuery(this),
            this_left = $this.offset().left,
            this_left_full = $this.offset().left + $this.width() + parseInt($this.css('padding-left'), 10) + parseInt($this.css('padding-right'), 10);

		if ( this_left_full > $pstudio_window.width() ) {
			$this.addClass('pstudio-menu-offset');
		}
    });

	// Circle Progress Bar
	if (jQuery('.pstudio-progress-item').length) {
		jQuery('.pstudio-progress-item.is-done').each(function() {
			pstudio.progress.layout(this);
		});
	}

	// Smooth Scroll Functions
	pstudio.old_scroll_top = $pstudio_window.scrollTop();
	pstudio.sScroll.layout();
}

pstudio.loading = function() {
	// Load Page Title and Guides
	if (jQuery('.pstudio-page-title-wrap:not(.is-inactive)').length) {
		gsap.to('.pstudio-page-title-wrap:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.pstudio-page-title-wrap:not(.is-inactive)').addClass('is-loaded');
			}
		});
	}
	if (jQuery('.pstudio-back-wrap:not(.is-inactive)').length) {
		gsap.to('.pstudio-back-wrap:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.pstudio-back-wrap:not(.is-inactive)').addClass('is-loaded');
			}
		});
	}
	if ($pstudio_body.hasClass('pstudio-home-template')) {
		gsap.to('.pstudio-home-link--works:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.pstudio-home-link--works:not(.is-inactive)').addClass('is-loaded');
			}
		});
		gsap.to('.pstudio-home-link--contacts:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.pstudio-home-link--contacts:not(.is-inactive)').addClass('is-loaded');
			}
		});
	}

	let logoDelay = pstudio.config.content_load_delay;
	if ($pstudio_window.width() < 760) {
		logoDelay = 0.1;
	}
	// Load Logo
	gsap.from('.pstudio-logo', {
		x: '-50%',
		opacity: 0,
		duration: 0.5,
		delay: logoDelay
	});

	// Load Mobile Menu
	gsap.from('.pstudio-mobile-header > a',
		{
			x: 10,
			y: -10,
			opacity: 0,
			duration: 0.2,
			delay: 0.1,
			stagger: 0.1
		},
	);

	// Load Menu
	gsap.from('.pstudio-nav ul.main-menu > li',
		{
			x: -10,
			y: -10,
			opacity: 0,
			duration: 0.2,
			delay: pstudio.config.content_load_delay,
			stagger: 0.1
		},
	);

	// Footer Socials
	if (jQuery('.pstudio-footer__socials').length) {
		if ($pstudio_window.width() < 760) {
			gsap.from('.pstudio-footer__socials li',
				{
					x: 0,
					y: 20,
					opacity: 0,
					duration: 0.2,
					delay: pstudio.config.content_load_delay,
					stagger: 0.1
				},
			);
		} else {
			gsap.from('.pstudio-footer__socials li',
				{
					x: -10,
					y: -10,
					opacity: 0,
					duration: 0.2,
					delay: pstudio.config.content_load_delay,
					stagger: 0.1
				},
			);
		}
	}

	// Fotoer Copyright
	if (jQuery('.pstudio-footer__copyright').length) {
		if ($pstudio_window.width() < 760) {
			gsap.from('.pstudio-footer__copyright', {
				y: 20,
				opacity: 0,
				duration: 0.5,
				delay: pstudio.config.content_load_delay
			});
		} else {
			gsap.from('.pstudio-footer__copyright', {
				x: '50%',
				opacity: 0,
				duration: 0.5,
				delay: pstudio.config.content_load_delay
			});
		}
	}

	// Page Background
	if (jQuery('.pstudio-page-background').length) {
		gsap.from('.pstudio-page-background', {
			scale: 1.05,
			opacity: 0,
			duration: 1,
			delay: pstudio.config.content_load_delay,
		});
	}

	// Show Content
	if (jQuery('.pstudio-content').length) {
		let contentDelay = pstudio.config.content_load_delay*1.7;
		if ($pstudio_window.width() < 760) {
			contentDelay = 0.5;
		}
		gsap.from('.pstudio-content', {
			opacity: 0,
			y: 100,
			duration: 1,
			delay: contentDelay,
			onStart: function() {
				pstudio.content_loaded();
			}
		});
	}

	// Show Albums Ribbon Content
	if (jQuery('.pstudio-albums-carousel').length) {
		if (jQuery('.pstudio-albums-carousel').hasClass('is-vertical')) {
			gsap.from('.pstudio-album-item__inner', {
				opacity: 0,
				y: 100,
				duration: 1,
				stagger: 0.1,
				delay: pstudio.config.content_load_delay*1.7
			});
		} else {
			gsap.from('.pstudio-album-item__inner', {
				opacity: 0,
				x: 100,
				duration: 1,
				stagger: 0.1,
				delay: pstudio.config.content_load_delay*1.7
			});
		}
		if (pstudio_ribbon.$bar) {
			gsap.from(pstudio_ribbon.$bar[0], {
				opacity: 0,
				y: 20,
				duration: 1,
				delay: pstudio.config.content_load_delay*1.7
			});
		}
	}

	// Show Albums Slider Content
	if (jQuery('.pstudio-albums-slider').length) {
		if (jQuery('.pstudio-album-item__title').length) {
			gsap.to('.pstudio-album-item__title', {
				css: {
					top: '100%',
				},
				delay: 0.5,
				duration: 1,
				onComplete: function() {
					jQuery('.pstudio-album-item__title').addClass('is-loaded');
				}
			});
		}
		if (jQuery('.pstudio-album-item__explore').length) {
			gsap.to('.pstudio-album-item__explore', {
				css: {
					top: '100%',
				},
				delay: 0.5,
				duration: 1,
				onComplete: function() {
					jQuery('.pstudio-album-item__explore').addClass('is-loaded');
				}
			});
		}
		gsap.fromTo('.pstudio-slider-prev', {
			x: -50,
		},{
			x: 0,
			delay: pstudio.config.content_load_delay*1.7,
			duration: 0.5,
			onStart: function() {
				jQuery('.pstudio-slider-prev').addClass('is-loaded');
			}
		});
		gsap.fromTo('.pstudio-slider-next', {
			x: 50,
		},{
			x: 0,
			delay: pstudio.config.content_load_delay*1.7,
			duration: 0.5,
			onStart: function() {
				jQuery('.pstudio-slider-next').addClass('is-loaded');
			}
		});
		gsap.from('.pstudio-album-item__image', {
			scale: 1.05,
			opacity: 0,
			duration: 1,
			delay: pstudio.config.content_load_delay*1.7,
		});
	}

	setTimeout("$pstudio_body.addClass('is-loaded')", 1500);
}

pstudio.change_location = function(this_href) {
	pstudio.cursor.$el.addClass('is-unloading');
	$pstudio_body.addClass('is-locked');
	if ($pstudio_window.width() < 760 && $pstudio_body.hasClass('pstudio-mobile-menu-shown')) {
		let setDelay = 0;
		$pstudio_body.addClass('is-locked');
		if (jQuery('.pstudio-mobile-menu').find('.is-open').length) {
			jQuery('.pstudio-mobile-menu').find('ul.sub-menu').slideUp(300);
			setDelay = 0.3;
		}
		gsap.fromTo('.pstudio-mobile-menu ul.main-menu > li',
			{
				x: 0,
				y: 0,
				opacity: 1
			},
			{
				x: 0,
				y: -40,
				opacity: 0,
				duration: 0.2,
				delay: setDelay,
				stagger: 0.1,
				onComplete: function() {
					window.location = this_href;
				}
			},
		);
		return false;
	}
	$pstudio_body.removeClass('is-loaded');
	if ($pstudio_body.hasClass('pstudio-aside-shown')) {
		$pstudio_body.removeClass('pstudio-aside-shown');
	}
	if ($pstudio_body.hasClass('pstudio-mobile-menu-shown')) {
		$pstudio_body.removeClass('pstudio-mobile-menu-shown');
	}

	if (jQuery('.pstudio-content').length) {
		gsap.to('.pstudio-content', {
			css: {
				opacity: 0,
				y: -100,
			},
			duration: 0.6,
		});
	}
	// Unload Albums Carousel Content
	if (jQuery('.pstudio-albums-carousel').length) {
		if (pstudio_ribbon.type == 'vertical') {
			gsap.to('.pstudio-album-item__inner.is-inview', {
				css: {
					opacity: 0,
					y: -100,
				},
				stagger: 0.1,
				delay: 0.5,
				duration: 0.6,
			});
		} else {
			gsap.to('.pstudio-album-item__inner.is-inview', {
				css: {
					opacity: 0,
					x: -100,
				},
				stagger: 0.1,
				delay: 0.5,
				duration: 0.6,
			});
		}
		if (pstudio_ribbon.$bar) {
			gsap.to(pstudio_ribbon.$bar[0], {
				opacity: 0,
				y: 20,
				duration: 1,
			});
		}
	}

	// Unload Albums Slider Content
	if (jQuery('.pstudio-albums-slider').length) {
		if (jQuery('.pstudio-album-item__title').length) {
			setTimeout("jQuery('.pstudio-album-item__title').removeClass('is-loaded')", 300);
			gsap.to('.pstudio-album-item__title', {
				css: {
					top: '0%',
				},
				delay: 1.2,
				duration: 1,
			});
		}
		if (jQuery('.pstudio-album-item__explore').length) {
			setTimeout("jQuery('.pstudio-album-item__explore').removeClass('is-loaded')", 300);
			gsap.to('.pstudio-album-item__explore', {
				css: {
					top: '200%',
				},
				delay: 1.2,
				duration: 1,
			});
		}
		gsap.fromTo('.pstudio-slider-prev', {
			x: 0,
		},{
			x: -50,
			duration: 0.5,
			onStart: function() {
				jQuery('.pstudio-slider-prev').removeClass('is-loaded');
			}
		});
		gsap.fromTo('.pstudio-slider-next', {
			x: 0,
		},{
			x: 50,
			duration: 0.5,
			onStart: function() {
				jQuery('.pstudio-slider-next').removeClass('is-loaded');
			}
		});
		gsap.to('.pstudio-album-item__image', {
			css: {
				scale: 1.05,
				opacity: 0,
			},
			duration: 1,
			delay: pstudio.config.content_load_delay*1.7,
		});
	}

	// Remove Logo
	gsap.to('.pstudio-logo', {
		css: {
			x: '-50%',
			opacity: 0,
		},
		duration: 0.5,
		delay: 0.5
	});

	// Remove Menu
	gsap.to('.pstudio-nav ul.main-menu > li',
		{
			css: {
				x: -10,
				y: -10,
				opacity: 0,
			},
			duration: 0.2,
			delay: 0.5,
			stagger: 0.1
		},
	);

	// Unload Mobile Menu
	gsap.to('.pstudio-mobile-header > a',
		{
			x: -10,
			y: -10,
			opacity: 0,
			duration: 0.2,
			delay: 0.5,
			stagger: 0.1
		},
	);

	// Footer Socials
	if (jQuery('.pstudio-footer__socials').length) {
		gsap.to('.pstudio-footer__socials li',
			{
				css: {
					x: -10,
					y: -10,
					opacity: 0,
				},
				duration: 0.2,
				delay: 0.5,
				stagger: 0.1
			},
		);
	}

	// Fotoer Copyright
	if (jQuery('.pstudio-footer__copyright').length) {
		gsap.to('.pstudio-footer__copyright', {
			css: {
				x: '50%',
				opacity: 0,
			},
			duration: 0.5,
			delay: 0.5
		});
	}

	// Remove Page Title and Guides
	if (jQuery('.pstudio-page-title-wrap').length) {
		setTimeout("jQuery('.pstudio-page-title-wrap:not(.is-inactive)').removeClass('is-loaded')", 600);
		gsap.to('.pstudio-page-title-wrap', 0.5, {
			css: {
				top: 0,
			},
			delay: 1.1,
		});
	}
	if (jQuery('.pstudio-back-wrap').length) {
		setTimeout("jQuery('.pstudio-back-wrap:not(.is-inactive)').removeClass('is-loaded')", 600);
		gsap.to('.pstudio-back-wrap', 0.5, {
			css: {
				top: '200%',
			},
			delay: 1.1,
		});
	}

	// Home Template Unloading
	if ($pstudio_body.hasClass('pstudio-home-template')) {
		if (!$pstudio_body.hasClass('pstudio-home-state--contacts') && !$pstudio_body.hasClass('pstudio-home-state--works')) {
			var links_delay = 0.5,
				links_timeout = 0;
		} else {
			var links_delay = 1.1,
				links_timeout = 600;
		}
		setTimeout("jQuery('.pstudio-home-link--works:not(.is-inactive)').removeClass('is-loaded')", links_timeout);
		gsap.to('.pstudio-home-link--works:not(.is-inactive)', 0.5, {
			css: {
				top: 0,
			},
			delay: links_delay,
		});
		setTimeout("jQuery('.pstudio-home-link--contacts:not(.is-inactive)').removeClass('is-loaded')", links_timeout);
		gsap.to('.pstudio-home-link--contacts:not(.is-inactive)', 0.5, {
			css: {
				top: '200%',
			},
			delay: links_delay,
		});
	}

	// Remove Page Background
	if (jQuery('.pstudio-page-background').length) {
		gsap.to('.pstudio-page-background', {
			css: {
				scale: 1.05,
				opacity: 0,
			},
			duration: 1,
			delay: pstudio.config.content_load_delay*1.7,
		});
	}

	setTimeout( function() {
		window.location = this_href;
	}, 2100, this_href);
}

// DOM Ready. Init Template Core.
jQuery(document).ready( function() {
    pstudio.init();
});

$pstudio_window.on('resize', function() {
	// Window Resize Actions
    pstudio.layout();
	setTimeout(pstudio.layout(), 500);
}).on('load', function() {
	// Window Load Actions
    pstudio.layout();
}).on('scroll', function() {
	if ($pstudio_body.hasClass('pstudio-aside-shown')) {
		$pstudio_window.scrollTop(pstudio.old_scroll_top);
	}
	if ($pstudio_body.hasClass('pstudio-mobile-menu-shown')) {
		$pstudio_window.scrollTop(pstudio.old_scroll_top);
	}
	pstudio.sScroll.target = $pstudio_window.scrollTop();
	if (pstudio.sScroll.target > ($pstudio_scroll.height() - $pstudio_window.height())) {
		pstudio.sScroll.layout();
	}

	//Window Scroll Actions
	if (jQuery('.pstudio-back.is-to-top:not(.in-action)').length) {
		if ($pstudio_window.scrollTop() > $pstudio_window.height()/2) {
			$pstudio_body.addClass('has-to-top');
		} else {
			$pstudio_body.removeClass('has-to-top');
		}
	}
});

// Keyboard Controls
jQuery(document).on('keyup', function(e) {
	switch(e.keyCode) {
  		case 27:  // 'Esc' Key
			if ($pstudio_body.hasClass('pstudio-aside-shown')) {
				$pstudio_body.removeClass('pstudio-aside-shown');
			}
    	break;
  		default:
    	break;
	}
});

// Init Content After Loading
pstudio.content_loaded = function() {
	// Observing Counters
	if (jQuery('.pstudio-counter-item').length) {
		if ('IntersectionObserver' in window) {
			jQuery('.pstudio-counter-item').each(function() {
				pstudio.counter_observer.observe(this);
			});
		}
	}
	// Circle Progress Bar Init
	if (jQuery('.pstudio-progress-item').length) {
		if ('IntersectionObserver' in window) {
			jQuery('.pstudio-progress-item').each(function() {
				pstudio.progress.observer.observe(this);
			});
		}
	}
	pstudio.layout();
}

// Firefox Back Button Fix
window.onunload = function(){};

// Safari Back Button Fix
jQuery(window).on('pageshow', function(event) {
    if (event.originalEvent.persisted) {
        window.location.reload()
    }
});
