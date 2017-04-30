/*!
 * angular-textarea-autosize v1.2.1
 * (c) 2015 Ken Snyder
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
	.directive('autosize', ['$timeout', function autosizeDirective($timeout) {
		/*
		Usage:
		<!-- min rows of 1 -->
		<textarea ng-model="note" autosize></textarea>
		<!-- min rows of 2 -->
		<textarea ng-model="note" autosize rows="2"></textarea>
		<!-- min rows of 1, callback when size changes -->
		<textarea ng-model="note" autosize="myOnResizeHandler"></textarea>
		*/
		return {
			restrict: 'A',
			scope: {
				onResize: '&?autosize'
			},
			require: '?ngModel',
			link: function autosizeDirectiveLink($scope, $textarea, attrs, ngModel) {
				var sizer = setupAutosizer($textarea[0], $scope.onResize);
				
				if (ngModel) {
					ngModel.$formatters.push(function(value) {
						sizer.adjust();
						return value;
					});
				}
				$timeout(function() {
					sizer.measure();
					sizer.adjust();
				});
				// The autosizer will not respond to changes in the rows attribute 
				// or the computed css values for border, padding, box-sizing or line-height
				// so we add sort of hack to reinit manually if needed.
				// Those changes could be auto detected with a MutationObserver 
				// but that is outside the scope of this project right now.
				$textarea[0].reinitAutosizer = function() {
					sizer.measure();
					sizer.adjust();
				};
			}
		};
	}]);

	function setupAutosizer(textarea, onResize) {
	  
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
			return style.getPropertyValue('box-sizing') ||
				style.getPropertyValue('-webkit-box-sizing') ||
				style.getPropertyValue('-moz-box-sizing') ||
				'content-box';
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
		
		function observe() {
			textarea.addEventListener('input', adjust, false);
			if ('onpropertychange' in textarea) {
				// Detects IE9. IE9 does not fire oninput for deletions,
				// so binding to onkeyup to catch most of those occasions.
				textarea.addEventListener('keyup', adjust, false);
			}
		}
		
		function unobserve() {
			textarea.removeEventListener('input', adjust);
			textarea.removeEventListener('keyup', adjust);
		}
		
		function _adjuster() {
			// if we have an onresize callback, we need to note the "before" height
			if (onResize) {
				var oldHeight = textarea.style.height;
			}
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
			// trigger resize callback if height has changed
			if (onResize && oldHeight != newHeight) {
				onResize(parseFloat(oldHeight), newHeight);
			}			
		}
		
		var adjust = _throttle(0, _adjuster);
		
		setOverflow();
		measure();
		observe();
		
		return {
			setOverflow: setOverflow,
			observe: observe,
			unobserve: unobserve,
			measure: measure,
			adjust: adjust
		};
	}

})(angular);
