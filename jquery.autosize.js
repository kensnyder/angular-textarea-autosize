/*!
 * jQuery autosize v1.0.0
 * (c) 2015 Ken Snyder
 * MIT License
 * 
 * Based on the following code and documentation:
 * https://github.com/jackmoore/autosize
 * https://github.com/javierjulio/textarea-autosize
 * https://github.com/AndrewDryga/jQuery.Textarea.Autoresize
 * https://developer.mozilla.org/en-US/docs/Web/API/Element.scrollHeight
 */
(function($, window) {
	
	// we need window later to prevent page jumping
	var $window = $(window);
	
	$.AutosizedTextarea = function() {
		this.initialize.apply(this, [].slice.call(arguments));
	};
	
	$.AutosizedTextarea.prototype = {
		initialize: function(textarea, options) {
			this.$textarea = $(textarea);
			this.textarea = this.$textarea.get(0);
			this.options = options || {};
			this.setup();
			this.observe();
			this.adjust();
		},
		setup: function() {
			if (
				this.$textarea.css('box-sizing') == 'border-box' ||
				this.$textarea.css('-webkit-box-sizing') == 'border-box' ||
				this.$textarea.css('-moz-box-sizing') == 'border-box'
			) {
				// border-box box sizing already includes padding
				this.verticalPadding = 0;
			}
			else {
				// other box sizing do not so calculate vertical padding here
				this.verticalPadding = parseInt(this.$textarea.css('padding-top') || 0, 10) 
					+ parseInt(this.$textarea.css('padding-bottom') || 0, 10);
			}
			// just in case we are splitting pixels, 
			// we would rather see descending letters get cut off
			// than have the scrollbar display and mess up our calculations
			this.textarea.style.overflow = 'hidden';
			this.lineHeight = $(this.textarea).css('line-height');
		},
		observe: function() {
			var events = 'input.autosize';
			if ('onpropertychange' in this.textarea) {
				// Detects IE9. IE9 does not fire oninput for deletions,
				// so binding to onkeyup to catch most of those occasions.
				events += ' keyup.autosize';
			}
			this.$textarea
				// stop observing if .autosize() has been called before
				.off(events)
				// observe with this.adjust() (bind is supported by IE9+)
				.on(events, this.adjust.bind(this))
			;
		},
		adjust: function() {
			if (this.options.onresize) {
				var heightBefore = this.textarea.style.height;
			}
			var currentWindowScroll = $window.scrollTop();
			// ensure that content can't fit so scrollHeight will be correct
			this.textarea.style.height = '0';
			// set height that is just tall enough
			// add one pixel in case the scrollHeight was rounded down
			var requiredHeight = this.textarea.scrollHeight - this.verticalPadding + 1;
			if (requiredHeight < 10) {
				requiredHeight = this.options.minHeight || this.lineHeight;
			}
			this.textarea.style.height = requiredHeight + 'px';
			// put the window scroll position back
			// since setting height to 0 may cause window scroll to change
			$window.scrollTop(currentWindowScroll);
			// trigger resize callback if height has changed
			if (this.options.onresize && heightBefore != this.textarea.style.height) {
				this.options.onresize.call( this, parseFloat(heightBefore), parseFloat(this.textarea.style.height) );
			}
		}
	};
	
    $.fn.autosize = function(options) {
        return this.each(function() {
            new $.AutosizedTextarea(this, options);
        });
    };

})(jQuery, window);
