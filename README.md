jQuery Autosize
=

Created because other libraries didn't calculate very well for me.

This plugin uses the scrollHeight of the textarea to determine the needed height instead of using a ghost element.

Usage
```javascript
$('textarea').autosize({
	onresize: function() {
		// optional; fired when size changes
	},
	minHeight: 30 // optional; minimum height in pixels; defaults to the line height
});
```

Limitations:
1. If the textarea gets wider, you'll have to call `.autosize()` again (e.g. if a textarea has a percent-width based on the window and the window is resized)
2. If you have placeholder text that wraps to a new line, you'll need to manually set minHeight

Note:
1. Calling `.autosize()` removes all handlers, reinitializes and performs initial resizing; multiple calls to `.autosize()` is ok.
2. You can extend functionality by editing or extending the $.AutosizedTextarea class this plugin creates. See the source code.

License
==
MIT License

Credits
==

Based on the following code and documentation:
https://github.com/jackmoore/autosize
https://github.com/javierjulio/textarea-autosize
https://github.com/AndrewDryga/jQuery.Textarea.Autoresize
https://developer.mozilla.org/en-US/docs/Web/API/Element.scrollHeight