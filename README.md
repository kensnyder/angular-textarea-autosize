Angular Textarea Autosize
=

v1.1.1 May 2015

Created because other libraries use ghost elements which didn't calculate very well for me.

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

Limitations:
1. If you have placeholder text that wraps to a new line, you'll need to manually set the rows attribute to fit the placeholder

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