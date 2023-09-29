/**
 * Author: Romes
 * Author URL: http://romes.dev
 */
"use strict";

var dvstudios = {
		flocker: {
			field_changed:	 false,
			field_interract: false,
			form_interract:  false
		}
	},
    $dvstudios_html = jQuery('html'),
	dvstudios_tns = [],
    $dvstudios_body = jQuery('body'),
    $dvstudios_window = jQuery(window),
    $dvstudios_header = jQuery('header#dvstudios-header'),
    $dvstudios_footer = jQuery('footer#dvstudios-footer'),
	$dvstudios_main = jQuery('main.dvstudios-content-wrap'),
	$dvstudios_scroll = jQuery('.dvstudios-content-scroll'),
	$dvstudios_header_holder;

// Default Options
dvstudios.config = {
    'smooth_ease' : 0.1,
	'content_load_delay': 0.8
}

class dvstudios_Before_After {
	constructor($obj) {
		if ($obj instanceof jQuery) {
			let this_class = this;
			this.$el = {
				$wrap: $obj,
				$before : jQuery('<div class="dvstudios-before-after-img dvstudios-before-img"/>').appendTo($obj),
				$after : jQuery('<div class="dvstudios-before-after-img dvstudios-after-img"/>').appendTo($obj),
				$divider : jQuery('<div class="dvstudios-before-after-divider"><i class="la la-arrows-h"></i></div>').appendTo($obj),
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
			$dvstudios_window.on('resize', function() {
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
dvstudios.cursor = {
	$el : jQuery('.dvstudios-cursor'),
	$el_main : jQuery('span.dvstudios-cursor-circle'),
	targetX: $dvstudios_window.width()/2,
	targetY: $dvstudios_window.height()/2,
	currentX: $dvstudios_window.width()/2,
	currentY: $dvstudios_window.height()/2,
	easing: 0.2,
	init : function() {
		let $this_el = this.$el;
		// Cursor Move
		$dvstudios_window.on('mousemove', function(e) {
			dvstudios.cursor.targetX = e.clientX - $this_el.width()/2;
			dvstudios.cursor.targetY = e.clientY - $this_el.height()/2;
        });
		if ($this_el.length) {
			dvstudios.cursor.animate();
		}

		// Show and Hide Cursor
        $dvstudios_window.on('mouseleave', function() {
			dvstudios.cursor.$el.addClass('is-inactive');
        }).on('mouseenter', function() {
			dvstudios.cursor.$el.removeClass('is-inactive');
        });

		// Bind Interractions
		jQuery(document).on('mouseenter', 'a', function() {
			if (jQuery(this).hasClass('dvstudios-lightbox-link')) {
				dvstudios.cursor.$el.addClass('int-lightbox');
			} else {
				dvstudios.cursor.$el.addClass('int-link');
			}
			jQuery(this).on('mouseleave', function() {
				dvstudios.cursor.$el.removeClass('int-link int-lightbox');
			});
		}).on('mouseenter', 'button', function() {
			dvstudios.cursor.$el.addClass('int-link');
			jQuery(this).on('mouseleave', function() {
				dvstudios.cursor.$el.removeClass('int-link');
			});
		}).on('mouseenter', 'input[type="submit"]', function() {
			dvstudios.cursor.$el.addClass('int-link');
			jQuery(this).on('mouseleave', function() {
				dvstudios.cursor.$el.removeClass('int-link');
			});
		}).on('mouseenter', '.dvstudios-back', function() {
			jQuery('.dvstudios-back').on('mouseenter', function() {
				dvstudios.cursor.$el.addClass('int-link');
				jQuery(this).on('mouseleave', function() {
					dvstudios.cursor.$el.removeClass('int-link');
				});
			});
		}).on('mouseenter', '.is-link', function() {
			jQuery('.is-link').on('mouseenter', function() {
				dvstudios.cursor.$el.addClass('int-link');
				jQuery(this).on('mouseleave', function() {
					dvstudios.cursor.$el.removeClass('int-link');
				});
			});
		}).on('mouseenter', '.dvstudios-aside-overlay', function() {
			dvstudios.cursor.$el.addClass('int-close');
			jQuery(this).on('mouseleave', function() {
				dvstudios.cursor.$el.removeClass('int-close');
			});
		}).on('mouseenter', '.dvstudios-before-after', function() {
			dvstudios.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				dvstudios.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.dvstudios-testimonials-carousel .tns-ovh', function() {
			dvstudios.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				dvstudios.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.dvstudios-albums-slider', function() {
			dvstudios.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				dvstudios.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.pswp__scroll-wrap', function() {
			dvstudios.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				dvstudios.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.dvstudios-albums-carousel', function() {
			if (jQuery(this).hasClass('is-vertical')) {
				dvstudios.cursor.$el.addClass('int-grab-v');
			} else {
				dvstudios.cursor.$el.addClass('int-grab-h');
			}
			jQuery(this).on('mouseleave', function() {
				dvstudios.cursor.$el.removeClass('int-grab-h int-grab-v');
			});
		});
	},
	animate: function() {
		let $this_el = dvstudios.cursor.$el;
		dvstudios.cursor.currentX += ((dvstudios.cursor.targetX - dvstudios.cursor.currentX) * dvstudios.cursor.easing);
		dvstudios.cursor.currentY += ((dvstudios.cursor.targetY - dvstudios.cursor.currentY) * dvstudios.cursor.easing);
		$this_el.css('transform', 'translate3d('+ dvstudios.cursor.currentX +'px, '+ dvstudios.cursor.currentY +'px, 0)');
		requestAnimationFrame( dvstudios.cursor.animate );
	}
};
dvstudios.cursor.init();

// Lightbox
if ( jQuery('.dvstudios-lightbox-link').length ) {
	dvstudios.pswp = {
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
		</div><!-- .pswp -->').appendTo($dvstudios_body)
	};
}

// dvstudios Kenburns
if (jQuery('.dvstudios-kenburns-slider').length) {
	dvstudios.kenburns = {
		init: function() {
			// Set Variables
			let this_f = this;
			this_f.$el = jQuery('.dvstudios-kenburns-slider');
			this_f.items = this_f.$el.find('.dvstudios-kenburns-slide').length;
			this_f.transition = parseInt(this_f.$el.data('transition'),10);
			this_f.delay = parseInt(this_f.$el.data('delay'), 10)/1000 + this_f.transition*0.001;
			this_f.zoom = this_f.$el.data('zoom');
			this_f.from = this_f.zoom;
			this_f.to = 1;
			this_f.active = 0;

			// Setup Items
			let prev_offset_x = 0,
				prev_offset_y = 0;

			this_f.$el.find('.dvstudios-kenburns-slide').each(function() {
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
			dvstudios.kenburns.change();
		},
		change: function() {
			let this_f = this,
				scale_from = this_f.from,
				scale_to = this_f.to;

			// Loop
			if (this_f.active >= this_f.items) {
				this_f.active = 0;
			}
			let current_slide = this_f.$el.find('.dvstudios-kenburns-slide').eq(this_f.active);

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
					dvstudios.kenburns.active++;
					dvstudios.kenburns.from = scale_to;
					dvstudios.kenburns.to = scale_from;
					dvstudios.kenburns.change();
					dvstudios.kenburns.$el.find('.is-active').removeClass('is-active');
				}
			});
		}
	};
}

// Counter
dvstudios.counter = function( this_el ) {
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
dvstudios.progress = {
	init: function(this_el) {
		let $this = jQuery(this_el),
			$bar_wrap = jQuery('<div class="dvstudios-progress-item-wrap"/>')
						.prependTo($this),
			this_size = this.getSize(this_el),
			$bar_svg = jQuery('\
				<svg width="'+ this_size.svgSize +'" height="'+ this_size.svgSize +'" viewPort="0 0 '+ this_size.barSize +' '+ this_size.barSize +'" version="1.1" xmlns="http://www.w3.org/2000/svg">\
					<circle class="dvstudios-progress-circle--bg" r="'+ this_size.r +'" cx="'+ this_size.barSize +'" cy="'+ this_size.barSize +'" fill="transparent" stroke-dasharray="'+ this_size.dashArray +'" stroke-dashoffset="0"></circle>\
					<circle class="dvstudios-progress-circle--bar" transform="rotate(-90, '+ this_size.barSize +', '+ this_size.barSize +')" r="'+ this_size.r +'" cx="'+ this_size.barSize +'" cy="'+ this_size.barSize +'" fill="transparent" stroke-dasharray="'+ this_size.dashArray +'" stroke-dashoffset="'+ this_size.dashArray +'"></circle>\
				</svg>').appendTo($bar_wrap);
			$bar_svg.find('.dvstudios-progress-circle--bar').css('transition', 'stroke-dashoffset ' + $this.data('delay')+'ms ease-in-out');
			$bar_wrap.append('<span class="dvstudios-progress-counter">' + $this.data('percent') + '</span>');

		$dvstudios_window.on('resize', this.layout(this_el));
	},
	layout: function(this_el) {
		let $this = jQuery(this_el);
		if ($this.find('svg').length) {
			let this_size = this.getSize(this_el),
				$svg = $this.find('svg'),
				$barBg = $this.find('.dvstudios-progress-circle--bg'),
				$bar = $this.find('.dvstudios-progress-circle--bar');
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
			$wrap = $this.find('.dvstudios-progress-item-wrap'),
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
			$this_counter = $this.find('span.dvstudios-progress-counter'),
			this_size = this.getSize(this_el),
			$bar = $this.find('.dvstudios-progress-circle--bar');
		$bar.css('stroke-dashoffset', this_size.dashOffset);
		$this_counter.prop('Counter', 0).animate({
			Counter: $this_counter.text()
		}, {
			duration: parseInt($this_counter.parents('.dvstudios-progress-item').data('delay'), 10),
			easing: 'swing',
			step: function (now) {
				$this_counter.text(Math.ceil(now)+'%');
			}
		});

	}
}
if ('IntersectionObserver' in window) {
	dvstudios.progress.observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!jQuery(entry.target).hasClass('is-done')) {
				if(entry.isIntersecting) {
					jQuery(entry.target).addClass('is-done');
					dvstudios.progress.animate(jQuery(entry.target)[0]);
				}
			}
		});
	});
}

// Coming Soon Count Down
dvstudios.count_down = {
	init : function() {
		let $dom = jQuery('#dvstudios-coming-soon'),
			datetime = new Date( $dom.find('time').text() + 'T00:00:00'),
			is_this;

		$dom.find('time').remove();
		this.labels = $dom.data('labels');
		this.days = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ dvstudios.count_down.labels[0] +'</span>');
		this.hours = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ dvstudios.count_down.labels[1] +'</span>');
		this.minutes = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ dvstudios.count_down.labels[2] +'</span>');
		this.seconds = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ dvstudios.count_down.labels[3] +'</span>');

		this.update( datetime );

		if ( this.interval ) {
			clearInterval( this.interval );
		}

		this.interval = setInterval( function() {
			dvstudios.count_down.update( datetime );
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
dvstudios.old_scroll_top = 0;
dvstudios.sScroll = {
	target: 0,
	current: 0,
	animate: function() {
		dvstudios.sScroll.current += ((dvstudios.sScroll.target - dvstudios.sScroll.current) * dvstudios.config.smooth_ease);
		$dvstudios_scroll.css('transform', 'translate3d(0, -'+ dvstudios.sScroll.current +'px, 0)');

		if ($dvstudios_scroll.height() !== $dvstudios_body.height()) {
			dvstudios.sScroll.layout();
		}

		requestAnimationFrame( dvstudios.sScroll.animate );
	},
	layout: function() {
		if ($dvstudios_scroll.length) {
			let this_content = $dvstudios_scroll.children('.dvstudios-content');
			this_content.css('min-height', '0px');

			// Set Body Height (for smooth scroll)
			if ($dvstudios_scroll.height() <= $dvstudios_window.height()) {
				let min_height = $dvstudios_window.height() - $dvstudios_footer.height();

				if (!$dvstudios_body.hasClass('no-header-padding'))
					min_height = min_height - $dvstudios_scroll.children('.dvstudios-header-holder').height();

				this_content.css('min-height', min_height+'px');
				$dvstudios_scroll.addClass('is-centered');
			} else {
				$dvstudios_scroll.removeClass('is-centered');
			}
			if ($dvstudios_body.hasClass('dvstudios-smooth-scroll')) {
				$dvstudios_body.height($dvstudios_scroll.height());
			}
		}
	}
};
if ($dvstudios_scroll.length || $dvstudios_body.hasClass('dvstudios-home-template')) {
	dvstudios.sScroll.animate();
}

dvstudios.init = function() {
	$dvstudios_body.addClass('is-init');
	dvstudios.old_scroll_top = $dvstudios_window.scrollTop();

	// Contact Form
	if (jQuery('form.dvstudios-contact-form').length) {
		jQuery('form.dvstudios-contact-form').each(function() {
			let $this = jQuery(this),
				$response = $this.find('.dvstudios-contact-form__response'),
				formData;

			// Create New Fields
			$this.find('input').on('change', function() {
				dvstudios.flocker.field_changed = true;
			}).on('keyup', function() {
				dvstudios.flocker.field_interract = true;
			});
			$this.find('textarea').on('change', function() {
				dvstudios.flocker.field_changed = true;
			}).on('keyup', function(e) {
				dvstudios.flocker.field_interract = true;
			});

			$this.find('input')[0].addEventListener('touchenter', function(e) {
        		dvstudios.flocker.field_interract = true;
				dvstudios.flocker.form_interract = true;
    		}, false);
			$this.find('textarea')[0].addEventListener('touchenter', function(e) {
        		dvstudios.flocker.field_interract = true;
				dvstudios.flocker.form_interract = true;
    		}, false);

			this.addEventListener('touchenter', function(e) {
        		dvstudios.flocker.form_interract = true;
    		}, false);
			$this.on('mouseenter', function() {
				dvstudios.flocker.form_interract = true;
			});

			$this.submit(function(e) {
				e.preventDefault();
				if (dvstudios.flocker.form_interract && dvstudios.flocker.field_interract && dvstudios.flocker.field_changed) {
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
						dvstudios.flocker.form_interract  = false;
						dvstudios.flocker.field_interract = false;
						dvstudios.flocker.field_changed   = false;
					})
					.fail(function(data) {
						$this.removeClass('is-in-action');
						$response.empty().removeClass('alert-success').addClass('alert-danger');
						$response.html('<span>' + data.responseText + '</span>');
						dvstudios.flocker.form_interract  = false;
						dvstudios.flocker.field_interract = false;
						dvstudios.flocker.field_changed   = false;
					});
				} else {
					if ($this.attr('data-spam-message')) {
						var spam_message = '<span>'+ $this.attr('data-spam-message') +'</span>';
					} else {
						var spam_message = '<span>No user actions detected. Look like a spam bot.</span>';
					}
					dvstudios.flocker.form_interract  = false;
					dvstudios.flocker.field_interract = false;
					dvstudios.flocker.field_changed   = false;
					$this.find('input:not([type="submit"]), textarea').val('');
					$response.empty().removeClass('alert-success').addClass('alert-danger');
					$response.html(spam_message);
				}
			});
		});
	}

	// Header Holder
	$dvstudios_header_holder = jQuery('<div class="dvstudios-header-holder"></div>');
	$dvstudios_header_holder.height($dvstudios_header.height()).prependTo($dvstudios_scroll);

	// Set Logo Size
	if (jQuery('a.dvstudios-logo').length) {
		jQuery('a.dvstudios-logo').each(function() {
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
	if (jQuery('.dvstudios-page-title-wrap').length) {
		if (jQuery('.dvstudios-content-wrap .dvstudios-content').length) {
			let dvstudios_mobile_title = jQuery('<div class="dvstudios-mobile-title-wrap">' + jQuery('.dvstudios-page-title-wrap').html() + '</div>');
			jQuery('.dvstudios-content-wrap .dvstudios-content').prepend(dvstudios_mobile_title);
		}
	}
	let dvstudios_mobile_header = jQuery('<div class="dvstudios-mobile-header">'),
		mobile_menu_button = jQuery('<a href="#" class="dvstudios-mobile-menu-button"><i class="la la-bars"></i></a>').appendTo(dvstudios_mobile_header),
		mobile_menu = jQuery('<nav class="dvstudios-mobile-menu"></nav>').appendTo($dvstudios_body),
		mobile_menu_close = jQuery('<a href="#" class="dvstudios-mobile-menu-close"></a>').appendTo(mobile_menu);

	if (jQuery('.dvstudios-aside-overlay').length) {
		dvstudios_mobile_header.append('\
			<a class="dvstudios-aside-toggler" href="#">\
				<span class="dvstudios-aside-toggler__icon01"></span>\
				<span class="dvstudios-aside-toggler__icon02"></span>\
				<span class="dvstudios-aside-toggler__icon03"></span>\
			</a>');
	}

	// Mobile Meintenance Email
	if ($dvstudios_body.hasClass('dvstudios-maintenance-wrap')) {
		dvstudios_mobile_header.prepend('<a class="dvstudios-contacts-toggler" href="#"><i class="la la-envelope"></i></a>');
		jQuery(document).on('click', '.dvstudios-contacts-toggler', function() {
			$dvstudios_body.addClass('contacts-shown');
		});
		jQuery(document).on('click', '.dvstudios-contacts-close', function() {
			$dvstudios_body.removeClass('contacts-shown');
		});
	}

	$dvstudios_header.find('.dvstudios-nav-block').append(dvstudios_mobile_header);

	if ($dvstudios_header.find('.dvstudios-nav').length) {
		mobile_menu.append('\
			<div class="dvstudios-mobile-menu-inner">\
				<div class="dvstudios-mobile-menu-content">\
					'+ $dvstudios_header.find('.dvstudios-nav').html() +'\
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
		$dvstudios_body.addClass('dvstudios-mobile-menu-shown').addClass('is-locked');
		dvstudios.old_scroll_top = $dvstudios_window.scrollTop();
		gsap.fromTo('.dvstudios-mobile-menu ul.main-menu > li',
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
					$dvstudios_body.removeClass('is-locked');
				}
			},
		);
	});

	mobile_menu_close.on('click', function() {
		let setDelay = 0;
		$dvstudios_body.addClass('is-locked');
		if (mobile_menu.find('.is-open').length) {
			mobile_menu.find('ul.sub-menu').slideUp(300);
			setDelay = 0.3;
		}
		gsap.fromTo('.dvstudios-mobile-menu ul.main-menu > li',
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
					$dvstudios_body.removeClass('dvstudios-mobile-menu-shown').removeClass('is-locked');
				}
			},
		);
	});

	jQuery('.dvstudios-menu-overlay').on('click', function() {
		$dvstudios_body.removeClass('dvstudios-mobile-menu-shown').removeClass('is-locked');
	});

	// Aside Open and Close
	jQuery(document).on('click', 'a.dvstudios-aside-toggler', function(e) {
		e.preventDefault();
		$dvstudios_body.addClass('dvstudios-aside-shown').removeClass('dvstudios-menu-fade');
		dvstudios.old_scroll_top = $dvstudios_window.scrollTop();
	});
	jQuery('a.dvstudios-aside-close').on('click', function(e) {
		e.preventDefault();
		$dvstudios_body.removeClass('dvstudios-aside-shown');
	});
	jQuery('.dvstudios-aside-overlay').on('click', function() {
		$dvstudios_body.removeClass('dvstudios-aside-shown');
	});

    // Main Nav Events
    jQuery('nav.dvstudios-nav a').on( 'mouseenter', function() {
        $dvstudios_body.addClass('dvstudios-menu-fade');
    });
    jQuery('nav.dvstudios-nav').on( 'mouseleave', function() {
        $dvstudios_body.removeClass('dvstudios-menu-fade');
    });

	// Back Button Functions
	jQuery('.dvstudios-back').on('click', function(e) {
		e.preventDefault();
		var $this = jQuery(this);

		// Back to Top
		if ($this.hasClass('is-to-top')) {
			if ($dvstudios_window.scrollTop() > $dvstudios_window.height()/2) {
				$dvstudios_body.addClass('has-to-top');
			}
			$this.addClass('in-action');

			if (jQuery('.dvstudios-albums-carousel').length) {
				dvstudios_ribbon.target = 0;
				dvstudios_ribbon.currentStep = 0;
				setTimeout(function() {
					$dvstudios_body.removeClass('has-to-top');
					$this.removeClass('in-action');
				},300, $this);
			} else {
				jQuery('html, body').stop().animate({scrollTop: 0}, 500, function() {
					$dvstudios_body.removeClass('has-to-top');
					$this.removeClass('in-action');
				});
			}
		}

		// Maintenace Mode - Write Message
		if ($this.hasClass('is-message')) {
			$dvstudios_body.addClass('is-locked in-message-mode');
			$this.parent().removeClass('is-loaded');
			gsap.to('.dvstudios-content-wrap .dvstudios-content', {
				opacity: 0,
				y: -150,
				duration: 0.7,
				onComplete: function() {
					jQuery('.dvstudios-back-wrap .is-message').hide();
					jQuery('.dvstudios-back-wrap .is-message-close').show();
				}
			});
			gsap.to('.dvstudios-page-background', {
				opacity: 0,
				scale: 1.05,
				duration: 1,
			});
			gsap.to('#dvstudios-contacts-wrap', {
				opacity: 1,
				y: 0,
				duration: 0.7,
				delay: 0.3,
				onComplete: function() {
					$dvstudios_body.removeClass('is-locked');
					jQuery('.dvstudios-back-wrap').addClass('is-loaded');
				}
			});
		}

		// Maintenace Mode - Close Message
		if ($this.hasClass('is-message-close')) {
			$dvstudios_body.addClass('is-locked').removeClass('in-message-mode');
			$this.parent().removeClass('is-loaded');
			gsap.to('#dvstudios-contacts-wrap', {
				opacity: 0,
				y: 150,
				duration: 0.7,
				onComplete: function() {
					jQuery('.dvstudios-back-wrap .is-message').show();
					jQuery('.dvstudios-back-wrap .is-message-close').hide();
				}
			});
			gsap.to('.dvstudios-page-background', {
				opacity: 0.13,
				scale: 1,
				duration: 1,
			});
			gsap.to('.dvstudios-content-wrap .dvstudios-content', {
				opacity: 1,
				y: 0,
				duration: 1,
				delay: 0.3,
				onComplete: function() {
					$dvstudios_body.removeClass('is-locked');
					jQuery('.dvstudios-back-wrap').addClass('is-loaded');
				}
			});
		}

		// Home Return
		if ($this.hasClass('is-home-return')) {
			$dvstudios_body.addClass('is-locked');
			gsap.fromTo('.dvstudios-content', 1, {
				y: 0,
				opacity: 1,
			},
			{
				y: -100,
				opacity: 0,
				duration: 1,
				onComplete: function() {
					if ($dvstudios_scroll.find('#dvstudios-home-works').length) {
						var $current_content = jQuery('#dvstudios-home-works');
					}
					if ($dvstudios_scroll.find('#dvstudios-home-contacts').length) {
						var $current_content = jQuery('#dvstudios-home-contacts');
					}
					for (var i = 0; i < 4; i++) {
						$current_content.unwrap();
					}
					dvstudios.sScroll.layout();
					$dvstudios_body.height($dvstudios_window.height());
				}
			});

			if (jQuery('.dvstudios-page-title-wrap').length) {
				jQuery('.dvstudios-page-title-wrap').removeClass('is-loaded').addClass('is-inactive');
				gsap.to('.dvstudios-page-title-wrap', 0.5, {
					css: {
						top: 0,
					},
					delay: 0.5,
				});
			}
			if (jQuery('.dvstudios-back-wrap').length) {
				jQuery('.dvstudios-back-wrap').removeClass('is-loaded').addClass('is-inactive');
				gsap.to('.dvstudios-back-wrap', 0.5, {
					css: {
						top: '200%',
					},
					delay: 0.5,
				});
			}
			gsap.to('.dvstudios-home-link--works', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.dvstudios-home-link--works').addClass('is-loaded').removeClass('is-inactive');
				}
			});
			gsap.to('.dvstudios-home-link--contacts', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.dvstudios-home-link--contacts').addClass('is-loaded').removeClass('is-inactive');
				}
			});
			gsap.to('.dvstudios-page-background', {
				opacity: 0.75,
				scale: 1,
				duration: 1,
				delay: 1,
				onComplete: function() {
					$dvstudios_body.removeClass('dvstudios-content-shown');
					$dvstudios_body.removeClass('is-locked');
				}
			});
		}
	});

	// Page Background
	if (jQuery('.dvstudios-page-background[data-src]').length) {
		jQuery('.dvstudios-page-background[data-src]').each(function() {
			jQuery(this).css('background-image', 'url('+ jQuery(this).data('src') +')');
		});
	}
	// Home Template
    if ($dvstudios_body.hasClass('dvstudios-home-template')) {
		// Home Links Events
		jQuery('.dvstudios-home-link').on('mouseenter', function() {
			$dvstudios_body.addClass('is-faded');
		}).on('mouseleave', function() {
			$dvstudios_body.removeClass('is-faded');
		}).on('click', function(){
			var $this = jQuery(this);
			dvstudios.cursor.$el.removeClass('int-link');
			$dvstudios_body.removeClass('is-faded').addClass('dvstudios-content-shown');
			jQuery('.dvstudios-home-link-wrap').addClass('is-inactive');
			gsap.to('.dvstudios-page-background', {
				opacity: 0.1,
				scale: 1.05,
				duration: 1,
				delay: 0.5,
			});
			gsap.to('.dvstudios-home-link--works', 0.5, {
				css: {
					top: 0,
				},
				delay: 0.5,
			});
			gsap.to('.dvstudios-home-link--contacts', 0.5, {
				css: {
					top: '200%',
				},
				delay: 0.5,
			});

			jQuery('.dvstudios-page-title').empty().append('<span>' + $this.find('span:first-child').text() + '</span>' + $this.find('span:last-child').text()).removeClass('is-inactive');
			jQuery('.dvstudios-home-return').removeClass('is-inactive');

			gsap.to('.dvstudios-page-title-wrap', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.dvstudios-page-title-wrap').addClass('is-loaded').removeClass('is-inactive');
				}
			});
			gsap.to('.dvstudios-back-wrap', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.dvstudios-back-wrap').addClass('is-loaded').removeClass('is-inactive');
				}
			});

			if ($this.parent().hasClass('dvstudios-home-link--works')) {
				var $current_content = jQuery('#dvstudios-home-works');
			}
			if ($this.parent().hasClass('dvstudios-home-link--contacts')) {
				var $current_content = jQuery('#dvstudios-home-contacts');
			}

			$current_content.wrap('\
				<main class="dvstudios-content-wrap">\
					<div class="dvstudios-content-scroll">\
						<div class="dvstudios-content">\
							<section class="dvstudios-section"></section>\
						</div><!-- .dvstudios-content -->\
					</div><!-- .dvstudios-content-scroll -->\
				</main>\
			');

			if ($dvstudios_body.hasClass('dvstudios-smooth-scroll')) {
				$dvstudios_scroll = $dvstudios_body.find('.dvstudios-content-scroll');
				$dvstudios_body.height($dvstudios_scroll.height());
			}
			dvstudios.layout();

			gsap.fromTo('.dvstudios-content', 1, {
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
			} else if ($this.hasClass('dvstudios-lightbox-link')) {
				e.preventDefault();
			} else if (this_href.length > 1 && this_href[0] !== '#' && !/\.(jpg|png|gif)$/.test(this_href)) {
				e.preventDefault();
				dvstudios.change_location(this_href);
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
	if ( jQuery('#dvstudios-coming-soon').length ) {
		dvstudios.count_down.init();
	}

	// Before After
	if (jQuery('.dvstudios-before-after').length) {
		jQuery('.dvstudios-before-after').each(function() {
			new dvstudios_Before_After(jQuery(this));
		});
	}

	// Kenburns Sliders
	if (jQuery('.dvstudios-kenburns-slider').length) {
		dvstudios.kenburns.init();
	}

	// Tiny Slider
	if (jQuery('.dvstudios-tns-container').length) {
		jQuery('.dvstudios-tns-container').each(function(){
			let $this = jQuery(this),
				$parent = $this.parent(),
				dvstudios_tns_options = {
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

			if ($parent.hasClass('dvstudios-testimonials-carousel')) {
				dvstudios_tns_options.autoHeight = true;
				dvstudios_tns_options.center = true;
				dvstudios_tns_options.nav = true;
				dvstudios_tns_options.loop = true;
				dvstudios_tns_options.gutter = 40;
			}

			// Init
			dvstudios_tns[$this.attr('id')] = tns(dvstudios_tns_options);

			// After Init Functions
			if ($parent.hasClass('dvstudios-testimonials-carousel')) {
				dvstudios_tns[$this.attr('id')].events.on('transitionEnd', dvstudios.sScroll.layout);
			}
		});
	}

	// Counters
	if (jQuery('.dvstudios-counter-item').length) {
		if ('IntersectionObserver' in window) {
			dvstudios.counter_observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (!jQuery(entry.target).hasClass('is-counted')) {
						if(entry.isIntersecting) {
							jQuery(entry.target).addClass('is-counted');
							dvstudios.counter(jQuery(entry.target).children('.dvstudios-counter-value')[0]);
						}
					}
				});
			});
		} else {
			jQuery('.dvstudios-counter-item').each(function() {
				jQuery(this).addClass('is-counted');
				dvstudios.counter(jQuery(this).children('.dvstudios-counter-value')[0]);
			});
		}
	}

	// Circle Progress Bar Init
	if (jQuery('.dvstudios-progress-item').length) {
		jQuery('.dvstudios-progress-item').each(function() {
			dvstudios.progress.init(this);
		});
	}

	// Bricks Gallery
	if (jQuery('.dvstudios-gallery-bricks.is-2x3').length) {
		jQuery('.dvstudios-gallery-bricks.is-2x3').each(function() {
			let $this = jQuery(this),
				count = 0;

			$this.find('.dvstudios-gallery-item').each(function(){
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
            	dvstudios.layout();
        	},
		});
	}

	// Justify Gallery
	if (jQuery('.dvstudios-justified-gallery').length) {
		jQuery('.dvstudios-justified-gallery').justifiedGallery({
			rowHeight : 250,
			captions: false,
			lastRow : 'nojustify',
			margins : 10
		});
	}

	// Lightbox
	if ( jQuery('.dvstudios-lightbox-link').length ) {
		jQuery('.dvstudios-lightbox-link').each( function() {
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

			if ( dvstudios.pswp.gallery[this_gallery] ) {
				dvstudios.pswp.gallery[this_gallery].push(this_item);
			} else {
				dvstudios.pswp.gallery[this_gallery] = [];
				dvstudios.pswp.gallery[this_gallery].push(this_item);
			}

			$this.data('count', dvstudios.pswp.gallery[this_gallery].length - 1);
		});

		jQuery(document).on('click', '.dvstudios-lightbox-link', function(e) {
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

			dvstudios.pswp.lightbox = new PhotoSwipe($dvstudios_body.find('.pswp')[0], PhotoSwipeUI_Default, dvstudios.pswp.gallery[this_gallery], this_options);
			dvstudios.pswp.lightbox.init();
		});
	}

	// Spacer
	jQuery('.dvstudios-spacer').each(function() {
		jQuery(this).height(jQuery(this).data('size'));
	});

    dvstudios.layout();
    dvstudios.loading();
}

dvstudios.layout = function() {
	// Close Mobile Menu (if it don't use)
	if ($dvstudios_window.width() > 760) {
		$dvstudios_body.removeClass('dvstudios-mobile-menu-shown');
	}

	// Header Space Holder
	if (typeof $dvstudios_header_holder !== 'undefined') {
		$dvstudios_header_holder.height($dvstudios_header.height());
	}

	// Header Padding to Home Template
	if (jQuery('#dvstudios-home-works').length) {
		jQuery('#dvstudios-home-works').css('padding-top', $dvstudios_header.height()+'px');
	}
	if (jQuery('#dvstudios-home-contacts').length) {
		jQuery('#dvstudios-home-contacts').css('padding-top', $dvstudios_header.height()+'px');
	}

	// Relayout Masonry items
	if (jQuery('.is-masonry').length) {
		jQuery('.is-masonry').each(function() {
			jQuery(this).masonry('layout');
		});
	}

	// Services List Layout
	if (jQuery('.dvstudios-service-item').length) {
		jQuery('.dvstudios-service-item').each(function() {
			let $this = jQuery(this),
				$prev = $this.prev('.dvstudios-service-item');
			if ($dvstudios_window.width() > 1200) {
				if ($prev.length) {
					var set_y = -1*($prev.height() - $prev.find('.dvstudios-service-item__content').height())/2;
					$this.css('margin-top', set_y +'px');
				}
			} else {
				$this.css('margin-top', '0px');
			}
		});
	}

	// Fullheight Row
	if (jQuery('.dvstudios-row-fullheight').length) {
		jQuery('.dvstudios-row-fullheight').each(function() {
			var $this = jQuery(this),
				minHeight = $dvstudios_window.height();

			if ($this.hasClass('exclude-header')) {
				minHeight = minHeight - $dvstudios_header.height();
			}
			if ($this.hasClass('exclude-footer')) {
				minHeight = minHeight - $dvstudios_footer.height();
			}
			$this.css('min-height', minHeight+'px');
		});
	}

    // Dropdown Menu Position
    $dvstudios_header.find('.dvstudios-menu-offset').removeClass('dvstudios-menu-offset');

    $dvstudios_header.find('.sub-menu').each(function() {
        var $this = jQuery(this),
            this_left = $this.offset().left,
            this_left_full = $this.offset().left + $this.width() + parseInt($this.css('padding-left'), 10) + parseInt($this.css('padding-right'), 10);

		if ( this_left_full > $dvstudios_window.width() ) {
			$this.addClass('dvstudios-menu-offset');
		}
    });

	// Circle Progress Bar
	if (jQuery('.dvstudios-progress-item').length) {
		jQuery('.dvstudios-progress-item.is-done').each(function() {
			dvstudios.progress.layout(this);
		});
	}

	// Smooth Scroll Functions
	dvstudios.old_scroll_top = $dvstudios_window.scrollTop();
	dvstudios.sScroll.layout();
}

dvstudios.loading = function() {
	// Load Page Title and Guides
	if (jQuery('.dvstudios-page-title-wrap:not(.is-inactive)').length) {
		gsap.to('.dvstudios-page-title-wrap:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.dvstudios-page-title-wrap:not(.is-inactive)').addClass('is-loaded');
			}
		});
	}
	if (jQuery('.dvstudios-back-wrap:not(.is-inactive)').length) {
		gsap.to('.dvstudios-back-wrap:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.dvstudios-back-wrap:not(.is-inactive)').addClass('is-loaded');
			}
		});
	}
	if ($dvstudios_body.hasClass('dvstudios-home-template')) {
		gsap.to('.dvstudios-home-link--works:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.dvstudios-home-link--works:not(.is-inactive)').addClass('is-loaded');
			}
		});
		gsap.to('.dvstudios-home-link--contacts:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.dvstudios-home-link--contacts:not(.is-inactive)').addClass('is-loaded');
			}
		});
	}

	let logoDelay = dvstudios.config.content_load_delay;
	if ($dvstudios_window.width() < 760) {
		logoDelay = 0.1;
	}
	// Load Logo
	gsap.from('.dvstudios-logo', {
		x: '-50%',
		opacity: 0,
		duration: 0.5,
		delay: logoDelay
	});

	// Load Mobile Menu
	gsap.from('.dvstudios-mobile-header > a',
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
	gsap.from('.dvstudios-nav ul.main-menu > li',
		{
			x: -10,
			y: -10,
			opacity: 0,
			duration: 0.2,
			delay: dvstudios.config.content_load_delay,
			stagger: 0.1
		},
	);

	// Footer Socials
	if (jQuery('.dvstudios-footer__socials').length) {
		if ($dvstudios_window.width() < 760) {
			gsap.from('.dvstudios-footer__socials li',
				{
					x: 0,
					y: 20,
					opacity: 0,
					duration: 0.2,
					delay: dvstudios.config.content_load_delay,
					stagger: 0.1
				},
			);
		} else {
			gsap.from('.dvstudios-footer__socials li',
				{
					x: -10,
					y: -10,
					opacity: 0,
					duration: 0.2,
					delay: dvstudios.config.content_load_delay,
					stagger: 0.1
				},
			);
		}
	}

	// Fotoer Copyright
	if (jQuery('.dvstudios-footer__copyright').length) {
		if ($dvstudios_window.width() < 760) {
			gsap.from('.dvstudios-footer__copyright', {
				y: 20,
				opacity: 0,
				duration: 0.5,
				delay: dvstudios.config.content_load_delay
			});
		} else {
			gsap.from('.dvstudios-footer__copyright', {
				x: '50%',
				opacity: 0,
				duration: 0.5,
				delay: dvstudios.config.content_load_delay
			});
		}
	}

	// Page Background
	if (jQuery('.dvstudios-page-background').length) {
		gsap.from('.dvstudios-page-background', {
			scale: 1.05,
			opacity: 0,
			duration: 1,
			delay: dvstudios.config.content_load_delay,
		});
	}

	// Show Content
	if (jQuery('.dvstudios-content').length) {
		let contentDelay = dvstudios.config.content_load_delay*1.7;
		if ($dvstudios_window.width() < 760) {
			contentDelay = 0.5;
		}
		gsap.from('.dvstudios-content', {
			opacity: 0,
			y: 100,
			duration: 1,
			delay: contentDelay,
			onStart: function() {
				dvstudios.content_loaded();
			}
		});
	}

	// Show Albums Ribbon Content
	if (jQuery('.dvstudios-albums-carousel').length) {
		if (jQuery('.dvstudios-albums-carousel').hasClass('is-vertical')) {
			gsap.from('.dvstudios-album-item__inner', {
				opacity: 0,
				y: 100,
				duration: 1,
				stagger: 0.1,
				delay: dvstudios.config.content_load_delay*1.7
			});
		} else {
			gsap.from('.dvstudios-album-item__inner', {
				opacity: 0,
				x: 100,
				duration: 1,
				stagger: 0.1,
				delay: dvstudios.config.content_load_delay*1.7
			});
		}
		if (dvstudios_ribbon.$bar) {
			gsap.from(dvstudios_ribbon.$bar[0], {
				opacity: 0,
				y: 20,
				duration: 1,
				delay: dvstudios.config.content_load_delay*1.7
			});
		}
	}

	// Show Albums Slider Content
	if (jQuery('.dvstudios-albums-slider').length) {
		if (jQuery('.dvstudios-album-item__title').length) {
			gsap.to('.dvstudios-album-item__title', {
				css: {
					top: '100%',
				},
				delay: 0.5,
				duration: 1,
				onComplete: function() {
					jQuery('.dvstudios-album-item__title').addClass('is-loaded');
				}
			});
		}
		if (jQuery('.dvstudios-album-item__explore').length) {
			gsap.to('.dvstudios-album-item__explore', {
				css: {
					top: '100%',
				},
				delay: 0.5,
				duration: 1,
				onComplete: function() {
					jQuery('.dvstudios-album-item__explore').addClass('is-loaded');
				}
			});
		}
		gsap.fromTo('.dvstudios-slider-prev', {
			x: -50,
		},{
			x: 0,
			delay: dvstudios.config.content_load_delay*1.7,
			duration: 0.5,
			onStart: function() {
				jQuery('.dvstudios-slider-prev').addClass('is-loaded');
			}
		});
		gsap.fromTo('.dvstudios-slider-next', {
			x: 50,
		},{
			x: 0,
			delay: dvstudios.config.content_load_delay*1.7,
			duration: 0.5,
			onStart: function() {
				jQuery('.dvstudios-slider-next').addClass('is-loaded');
			}
		});
		gsap.from('.dvstudios-album-item__image', {
			scale: 1.05,
			opacity: 0,
			duration: 1,
			delay: dvstudios.config.content_load_delay*1.7,
		});
	}

	setTimeout("$dvstudios_body.addClass('is-loaded')", 1500);
}

dvstudios.change_location = function(this_href) {
	dvstudios.cursor.$el.addClass('is-unloading');
	$dvstudios_body.addClass('is-locked');
	if ($dvstudios_window.width() < 760 && $dvstudios_body.hasClass('dvstudios-mobile-menu-shown')) {
		let setDelay = 0;
		$dvstudios_body.addClass('is-locked');
		if (jQuery('.dvstudios-mobile-menu').find('.is-open').length) {
			jQuery('.dvstudios-mobile-menu').find('ul.sub-menu').slideUp(300);
			setDelay = 0.3;
		}
		gsap.fromTo('.dvstudios-mobile-menu ul.main-menu > li',
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
	$dvstudios_body.removeClass('is-loaded');
	if ($dvstudios_body.hasClass('dvstudios-aside-shown')) {
		$dvstudios_body.removeClass('dvstudios-aside-shown');
	}
	if ($dvstudios_body.hasClass('dvstudios-mobile-menu-shown')) {
		$dvstudios_body.removeClass('dvstudios-mobile-menu-shown');
	}

	if (jQuery('.dvstudios-content').length) {
		gsap.to('.dvstudios-content', {
			css: {
				opacity: 0,
				y: -100,
			},
			duration: 0.6,
		});
	}
	// Unload Albums Carousel Content
	if (jQuery('.dvstudios-albums-carousel').length) {
		if (dvstudios_ribbon.type == 'vertical') {
			gsap.to('.dvstudios-album-item__inner.is-inview', {
				css: {
					opacity: 0,
					y: -100,
				},
				stagger: 0.1,
				delay: 0.5,
				duration: 0.6,
			});
		} else {
			gsap.to('.dvstudios-album-item__inner.is-inview', {
				css: {
					opacity: 0,
					x: -100,
				},
				stagger: 0.1,
				delay: 0.5,
				duration: 0.6,
			});
		}
		if (dvstudios_ribbon.$bar) {
			gsap.to(dvstudios_ribbon.$bar[0], {
				opacity: 0,
				y: 20,
				duration: 1,
			});
		}
	}

	// Unload Albums Slider Content
	if (jQuery('.dvstudios-albums-slider').length) {
		if (jQuery('.dvstudios-album-item__title').length) {
			setTimeout("jQuery('.dvstudios-album-item__title').removeClass('is-loaded')", 300);
			gsap.to('.dvstudios-album-item__title', {
				css: {
					top: '0%',
				},
				delay: 1.2,
				duration: 1,
			});
		}
		if (jQuery('.dvstudios-album-item__explore').length) {
			setTimeout("jQuery('.dvstudios-album-item__explore').removeClass('is-loaded')", 300);
			gsap.to('.dvstudios-album-item__explore', {
				css: {
					top: '200%',
				},
				delay: 1.2,
				duration: 1,
			});
		}
		gsap.fromTo('.dvstudios-slider-prev', {
			x: 0,
		},{
			x: -50,
			duration: 0.5,
			onStart: function() {
				jQuery('.dvstudios-slider-prev').removeClass('is-loaded');
			}
		});
		gsap.fromTo('.dvstudios-slider-next', {
			x: 0,
		},{
			x: 50,
			duration: 0.5,
			onStart: function() {
				jQuery('.dvstudios-slider-next').removeClass('is-loaded');
			}
		});
		gsap.to('.dvstudios-album-item__image', {
			css: {
				scale: 1.05,
				opacity: 0,
			},
			duration: 1,
			delay: dvstudios.config.content_load_delay*1.7,
		});
	}

	// Remove Logo
	gsap.to('.dvstudios-logo', {
		css: {
			x: '-50%',
			opacity: 0,
		},
		duration: 0.5,
		delay: 0.5
	});

	// Remove Menu
	gsap.to('.dvstudios-nav ul.main-menu > li',
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
	gsap.to('.dvstudios-mobile-header > a',
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
	if (jQuery('.dvstudios-footer__socials').length) {
		gsap.to('.dvstudios-footer__socials li',
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
	if (jQuery('.dvstudios-footer__copyright').length) {
		gsap.to('.dvstudios-footer__copyright', {
			css: {
				x: '50%',
				opacity: 0,
			},
			duration: 0.5,
			delay: 0.5
		});
	}

	// Remove Page Title and Guides
	if (jQuery('.dvstudios-page-title-wrap').length) {
		setTimeout("jQuery('.dvstudios-page-title-wrap:not(.is-inactive)').removeClass('is-loaded')", 600);
		gsap.to('.dvstudios-page-title-wrap', 0.5, {
			css: {
				top: 0,
			},
			delay: 1.1,
		});
	}
	if (jQuery('.dvstudios-back-wrap').length) {
		setTimeout("jQuery('.dvstudios-back-wrap:not(.is-inactive)').removeClass('is-loaded')", 600);
		gsap.to('.dvstudios-back-wrap', 0.5, {
			css: {
				top: '200%',
			},
			delay: 1.1,
		});
	}

	// Home Template Unloading
	if ($dvstudios_body.hasClass('dvstudios-home-template')) {
		if (!$dvstudios_body.hasClass('dvstudios-home-state--contacts') && !$dvstudios_body.hasClass('dvstudios-home-state--works')) {
			var links_delay = 0.5,
				links_timeout = 0;
		} else {
			var links_delay = 1.1,
				links_timeout = 600;
		}
		setTimeout("jQuery('.dvstudios-home-link--works:not(.is-inactive)').removeClass('is-loaded')", links_timeout);
		gsap.to('.dvstudios-home-link--works:not(.is-inactive)', 0.5, {
			css: {
				top: 0,
			},
			delay: links_delay,
		});
		setTimeout("jQuery('.dvstudios-home-link--contacts:not(.is-inactive)').removeClass('is-loaded')", links_timeout);
		gsap.to('.dvstudios-home-link--contacts:not(.is-inactive)', 0.5, {
			css: {
				top: '200%',
			},
			delay: links_delay,
		});
	}

	// Remove Page Background
	if (jQuery('.dvstudios-page-background').length) {
		gsap.to('.dvstudios-page-background', {
			css: {
				scale: 1.05,
				opacity: 0,
			},
			duration: 1,
			delay: dvstudios.config.content_load_delay*1.7,
		});
	}

	setTimeout( function() {
		window.location = this_href;
	}, 2100, this_href);
}

// DOM Ready. Init Template Core.
jQuery(document).ready( function() {
    dvstudios.init();
});

$dvstudios_window.on('resize', function() {
	// Window Resize Actions
    dvstudios.layout();
	setTimeout(dvstudios.layout(), 500);
}).on('load', function() {
	// Window Load Actions
    dvstudios.layout();
}).on('scroll', function() {
	if ($dvstudios_body.hasClass('dvstudios-aside-shown')) {
		$dvstudios_window.scrollTop(dvstudios.old_scroll_top);
	}
	if ($dvstudios_body.hasClass('dvstudios-mobile-menu-shown')) {
		$dvstudios_window.scrollTop(dvstudios.old_scroll_top);
	}
	dvstudios.sScroll.target = $dvstudios_window.scrollTop();
	if (dvstudios.sScroll.target > ($dvstudios_scroll.height() - $dvstudios_window.height())) {
		dvstudios.sScroll.layout();
	}

	//Window Scroll Actions
	if (jQuery('.dvstudios-back.is-to-top:not(.in-action)').length) {
		if ($dvstudios_window.scrollTop() > $dvstudios_window.height()/2) {
			$dvstudios_body.addClass('has-to-top');
		} else {
			$dvstudios_body.removeClass('has-to-top');
		}
	}
});

// Keyboard Controls
jQuery(document).on('keyup', function(e) {
	switch(e.keyCode) {
  		case 27:  // 'Esc' Key
			if ($dvstudios_body.hasClass('dvstudios-aside-shown')) {
				$dvstudios_body.removeClass('dvstudios-aside-shown');
			}
    	break;
  		default:
    	break;
	}
});

// Init Content After Loading
dvstudios.content_loaded = function() {
	// Observing Counters
	if (jQuery('.dvstudios-counter-item').length) {
		if ('IntersectionObserver' in window) {
			jQuery('.dvstudios-counter-item').each(function() {
				dvstudios.counter_observer.observe(this);
			});
		}
	}
	// Circle Progress Bar Init
	if (jQuery('.dvstudios-progress-item').length) {
		if ('IntersectionObserver' in window) {
			jQuery('.dvstudios-progress-item').each(function() {
				dvstudios.progress.observer.observe(this);
			});
		}
	}
	dvstudios.layout();
}

// Firefox Back Button Fix
window.onunload = function(){};

// Safari Back Button Fix
jQuery(window).on('pageshow', function(event) {
    if (event.originalEvent.persisted) {
        window.location.reload()
    }
});
