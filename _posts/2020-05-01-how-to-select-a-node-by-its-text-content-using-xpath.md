---
layout: post
title: How to Select a Node by it's Text Content Using XPath
tags: xpath
updated: 2020-05-01
---
When scraping the web, XPath is your best friend. It's a very powerful, and not very simple tool. You can select a node by its text content in two ways. `text()` or. ``.

Say you have the following HTML

```html
<html>
<a>Some Link Text</a>
</html>
```

Then you can select the `a` element, and any other `a` element that has the text 'Some Link Text' using `//a[.='Some Link Text'` or `//a[text()='Some Link Text']`.

However, be careful. If the HTML were instead.


```html
<html>
<a>Some Link Text</a><other/>
</html>
```

Then `text()` will return the node but `.` will not. That's because `text()` will return true if any of the text nodes of an element contain the text 'Some Link Text'. While `.` returns true if the string value of the element is identical to 'Some Link Text'.