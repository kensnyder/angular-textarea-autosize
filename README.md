Angular Textarea Autosize
=

v2.0.0 April 2017

Created because other libraries use ghost elements which didn't calculate very well for me, especially when using web fonts.

This plugin uses the scrollHeight of the textarea to determine the needed height instead of using a ghost element.

Usage
```html 
<!-- min rows of 1 -->
<textarea ng-model="note" autosize></textarea>
<!-- min rows of 2 -->
<textarea ng-model="note" autosize rows="2"></textarea>
```

Edge cases:

1. If you have placeholder text that wraps to a new line, you'll need to manually set the rows attribute to fit the placeholder.
2. The css property "resize" is forced to "none" so the textbox will have no resize handle
3. If the textarea has a CSS transition that applies to the height, calculations will be off and size changes may appear janky
4. If the textarea has a percent width and the window changes size, the autosizer will not be triggered until the next keystroke
5. The autosizer will not respond to changes in the rows attribute
6. If the autosizer uses the transitioned to catch the changes in the computed css values for border, padding, box-sizing and line-height.
Examples. If `transition: all` and you change the padding, autosizer will respond.
If `transition: line-height` and you change the line-height, autosizer will respond.
If `transition: opacity` and you change the border, autosizer will NOT respond.
If you have no transition defined and you change the padding, autosizer will respond.

A hack is to call .reinitAutosize() on the raw DOM element if you need to manually trigger the autosize.

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