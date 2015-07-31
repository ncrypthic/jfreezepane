# jFreezepane

This jQuery plugins helps you to create _**freeze pane**_ like view in a spreadsheet application
from your html table. This library will create a scrolling container with 4 inner containers
(top-left, top-right, bottom-left, bottom-right) to simulate a _**freeze pane**_. Every inner 
containers will contain a copy of your table element.

## Basic use

1. Load jfreezepane
  * Using Bower 

    Just install ```ncrypthic/jfreezepane``` package
    ```
    bower install ncrypthic/jfreezepane
    ```

  * On browser

    Just include ```jfreezepane.js``` after ```jquery.js``` inside your html file
    ```html
    <script src="jquery.js"></script>
    <script src="jfreezepane.js"></script>
    ```

2. Initalize jfreezepane on table element
  ```javascript
  $('#myTable').freezePane({col: 2, row: 2});
  ```
  
  * Initialization Options
  
    | Name | Type | Description |
    |------|------|-------------|
    | row  | number (default: 1) | Row index to be freeze |
    | col  | number (default: 1) | Column index to be freeze |
    | autohide | boolean (default: true) | Auto hide original column |

## Events

As explained above, this library creates 4 different containers each with a copy of the original table. That 
means each of these table is an individual DOMElement with its own event handlers. If you have any event handlers
inside your table element before you initialize freezePane, then all the event handlers will get copied. 

From performance consideration this is not recommended, so instead of attaching event handlers to the original
table, please consider to attach the handler directly to the freeze panel internal tables then if you need to
update other cloned tables inside freezepane container, you can trigger ```fp.update``` on freezepane container.

```fp.update``` will trigger other tables to replace their row with a copy of a _**whole**_ row where the events 
happened.

**Example:**

Suppose we have an input text box in our table row and we want every time the input value changed,
it will also be shown in column 5 within the same row. To do this, normally we wrote something like this:

```javascript
$('table#myTable .input-text').on('change', function() {
  $(this).parents('tr').find('td').eq(5).text($(this).val());
});
```
  
With jfreezepane, you must detect changes happened inside the freeze-container rather that the original table.
So achieve the same function as above with jfreezepane, we must change our code like this:

```javascript
jQuery('.freeze-container table .input-text').on('change', function() {
  $(this).parents('tr').find('td').eq(5).text('hahahah');
  // Send message to other tables inside the .freeze-container to
  // to reflect the changes
  $(this).trigger('fp.update');
});
```

## License

The MIT License (MIT)

Copyright © 2015 Lim Afriyadi, http://blog.afriyadi.me

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
