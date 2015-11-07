Angular Textarea Autosize
=

v1.2.0 May 2015

Created because other libraries use ghost elements which didn't calculate very well for me, especially when using web fonts.

This plugin uses the scrollHeight of the textarea to determine the needed height instead of using a ghost element.

Usage
```html 
<!-- min rows of 1 -->
<textarea ng-model="note" autosize></textarea>
<!-- min rows of 2 -->
<textarea ng-model="note" autosize rows="2"></textarea>
<!-- min rows of 3, callback when size changes -->
<textarea ng-model="note" autosize="{minRows:3, onresize:myHandler}"></textarea>
```

Edge cases:

1. If you have placeholder text that wraps to a new line, you'll need to manually set the rows attribute to fit the placeholder.
2. The css property "resize" is forced to "none" so the textbox will have no resize handle
3. If the textarea has a CSS transition that applies to the height, calculations will be off and size changes may appear janky
4. If the textarea has a percent width and the window changes size, the autosizer will be triggered until the next keystroke
5. The autosizer will not respond to changes in the rows attribute or the computed css values for border, padding, box-sizing or line-height. A hack is to call .reinitAutosize() on the raw DOM element if you know any of those things happen.
6. Only supports IE9+.

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