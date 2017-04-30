/*!
 * angular-textarea-autosize v2.0.0
 * (c) 2017 Ken Snyder
 * MIT License
 *
 * Based on the following code and documentation:
 * https://github.com/jackmoore/autosize
 * https://github.com/javierjulio/textarea-autosize
 * https://github.com/AndrewDryga/jQuery.Textarea.Autoresize
 * https://developer.mozilla.org/en-US/docs/Web/API/Element.scrollHeight
 */
(function(angular) {

	angular.module('textareaAutosize', [])
		.directive('autosize', function autosizeDirective() {
			/*
			 Usage:
			 <!-- min rows of 1 -->
			 <textarea ng-model="note" autosize></textarea>
			 <!-- min rows of 2 -->
			 <textarea ng-model="note" autosize rows="2"></textarea>
			 */
			return {
				restrict: 'A',
				require: 'ngModel',
				link: function autosizeDirectiveLink($scope, $textarea, attrs, ngModel) {
					var sizer = setupAutosizer($textarea[0]);

					var run = function($0) {
						if (!sizer.minHeight) {
							sizer.measure();
						}
						sizer.adjust();
						return $0;
					};

					// respond to final changes from user input
					ngModel.$viewChangeListeners.push(run);
					// respond to final changes from model
					$scope.$watch(attrs.ngModel, run);
					// respond to changes in padding or border
					if ($textarea[0].style.transition === '') {
						$textarea[0].style.transition = [
							'border-top-width 1ms',
							'border-bottom-width 1ms',
							'padding-top 1ms',
							'padding-bottom 1ms',
							'line-height 1ms'
						].join(', ');
					}
					$textarea.on('transitionend', function() {
						sizer.measure();
						sizer.adjust();
					});
					// provide a way to force resize programmatically
					$textarea[0].reinitAutosize = run;
				}
			};
		});

	function setupAutosizer(textarea) {

		var minHeight, lineHeight, extraHeight;

		function _throttle(ms, fn) {
			var inprogress = false;
			return function() {
				if (!inprogress) {
					fn();
				}
				inprogress = true;
				setTimeout(function() {
					inprogress = false;
				}, ms);
			};
		}

		function _getBoxSizing(style) {
			return style.getPropertyValue('box-sizing') || 'content-box';
		}

		function _getLineHeight(style) {
			lineHeight = style.getPropertyValue('line-height');
			// line height will be returned in px or with keyword "normal" which is about 1.14 * font-size
			if (lineHeight == 'normal') {
				lineHeight = (parseFloat(style.getPropertyValue('font-size')) || 16) * 1.14;
			}
			else {
				lineHeight = parseFloat(lineHeight);
			}
			return lineHeight;
		}

		function _getBorderHeight(style) {
			// border thickness can be a number value or one of thin, medium or thick
			// regardless of the keyword or units, px values are returned by all browsers
			// http://codepen.io/kendsnyder/pen/vOKRwZ
			return parseFloat(style.getPropertyValue('border-top-width') || 0) || 0 +
				parseFloat(style.getPropertyValue('border-bottom-width') || 0) || 0;
		}

		function _getPaddingHeight(style) {
			return parseFloat(style.getPropertyValue('padding-top') || 0) || 0 +
				parseFloat(style.getPropertyValue('padding-bottom') || 0) || 0;
		}

		function setOverflow() {
			// just in case we are splitting pixels,
			// we would rather see descending letters get cut off
			// than have the scrollbar display and mess up our calculations
			textarea.style.overflow = 'hidden';
			textarea.style.resize = 'none';
		}

		function measure() {
			// get effective property values for height
			var style = window.getComputedStyle(textarea, null);
			// note that css values can be fractional
			lineHeight = _getLineHeight(style);
			// calculate the final extra height based on box sizing
			extraHeight = 0;
			switch (_getBoxSizing(style)) {
				// border-box includes border height and padding height
				case 'border-box': extraHeight += _getBorderHeight(style);
				// padding-box includes only padding height
				case 'padding-box': extraHeight += _getPaddingHeight(style);
			}
			minHeight = Math.ceil(
				(parseFloat(textarea.getAttribute('rows')) || 1) * lineHeight + extraHeight
			);
		}

		function _adjuster() {
			var currentWindowScroll = window.scrollY;
			// ensure that content can't fit so scrollHeight will be correct
			textarea.style.height = '0';
			// set height that is just tall enough
			// note that scrollHeight is always an integer
			// Adding 1 seems to fix some cases where textarea jumps to scrollTop 1
			var newHeight = Math.max(minHeight, textarea.scrollHeight) + 1;
			textarea.style.height = newHeight + 'px';
			// put the window scroll position back
			// since setting height to 0 may cause window scroll to change
			if (currentWindowScroll != window.scrollY) {
				window.scroll(window.scrollX, currentWindowScroll);
			}
		}

		var adjust = _throttle(0, _adjuster);

		setOverflow();

		return {
			minHeight: minHeight,
			measure: measure,
			adjust: adjust
		};
	}

})(angular);
