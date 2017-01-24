jDiet.js
========

* [jDiet.js download](https://tomflidr.github.io/jDiet.js/latest/jDiet.js)
* [jDiet.min.js download](https://tomflidr.github.io/jDiet.js/latest/jDiet.min.js)

```html
<script type="text/javascript" src="https://tomflidr.github.io/jDiet.js/latest/jDiet.js"></script> 
<script type="text/javascript" src="https://tomflidr.github.io/jDiet.js/latest/jDiet.min.js"></script> 
```
Tiny client JS framework for nerds, exhausted by corpulent jQuery, syntax based on jQuery, min. and gzip.: 7.23 KB, JIT
[Archived Google code project](https://code.google.com/p/jdiet-js/)


## jDiet Mission
- create very fast and comfort framework to develop frontend JS features (supporting IE6+ with JScript syntax)
- create small library as much as possible under limits: minimized and gziped to max 5 - 10 KB
- create cool library with the same method names from jQuery (to not learn anything new to start using it)

### jDiet Syntax
Syntax is based mostly on jQuery framework (with something more and less).
It is possible to replace jQuery with jDiet, if you are using jDiet methods only

#### The supersmart object for whole universe, when u use this framework is just:

```javascript
jDiet
```

```javascript
// You can use dollar(s) as usual:
var $ = jDiet;
// Or:
var $$ = jDiet;
```

#### Selectors to create jDiet element object

```javascript
jDiet('#element-id')
jDiet('.element-class')
jDiet('.one.more')
jDiet('a.element-class')
jDiet('a')
jDiet('a, .other')
jDiet('a .first. second b, .other .content p')

// It is the same in the .children() function:
jDiet('a, .other').children('span.bold') ...

/**
 * REMEMBER - build apps without so complicated selectors (you don't need them!): 
 *   a > .first
 *   a[href^=#any]
 *   div:first-child()
 *   div.nth-child(even)
 *   ...
 */
```

#### Available methods for jDiet Element object

```javascript
.children(selector)
.parent(selector - optional)
.each(function)
.bind(event names, function)
.unbind(event names, function)
.animate(
  size properties - object [top,left,bottom,right,width,height],
  time - integer,
  easing - string,
  callback - function
)
.prepend(element)
.append(element)
.setCss(key & value object)
.getCss(string)
.hide()
.show()
.addClass(string)
.hasClass(string)
.removeClass(string)
.offset()
.setAttr(key & value object)
.getAttr(string)
.removeAttr(string)
.val()
.checked(boolean)
// It is also possible to use non JIT methods like "css()" and "attr()" to stay compatible with jQuery
.css(object with any property | string to get any property | two string to set property)
.attr(object with any attr | string to get any attr | two strings to set attr)
```

#### Events
```javascript
jDiet("a.js-click").bind('mouseover,focus', function (e) {
	// this - means scope of "a.js-click" element - all browsers
	// e.preventDefault() - all browsers
	// e.type = "mouseover" | "focus" - all browsers - naturally
	// e.pageX, e.pageY - document mouse position from left top corner - all browsers
});
```

#### Animation easing
(possible to use easing jquery plugin, interface is the same)
```javascript
"easeIn"
"easeOut"
"easeInOut"
"easeOutBackIn"
"backOutEaseIn"
"backInOut"
"linear"
```

#### jDiet static features
```javascript
jDiet.browser // see your self (browser names and versions)
jDiet.ajax // see help by calling jDiet.ajax() - without any params
jDiet.typeOf // get javascript real type
jDiet.trim // remove trailing space chracters
jDiet.clone // recursively clone object with base type props or any other objects or arrays
jDiet.isset // recursively get existence of property inside of huge object
jDiet.isset(hugeObject, 'firstLevelProperty.secondLevelProperty.finalProperty')
jDiet.FRAMERATE // framerate to change all jDiet running animations, 20 by default
```

#### Goodies
```javascript
jDiet(document).ready(function(){
  // you know what is this place:-)
});

jDiet.fn // place for any jDiet plugin, the same behaviour in jQuery

// DOM structure building
jDiet('<a>',{
	html: 'link text content',
	attrs: {
		href: '?createdBy=jDiet'
	},
	css: {
		color: 'red'
	}//,
	// it is possible to use "elms" property to define childs, but do not use "html" with "elms" together
	/*elms: [
		['<span>', css: {'text-decoration': 'underline'}]
	]*/
});

/**
 * After document ready fires - document.write() and document.writeln() 
 * is overwrited by function, which use DOM building mechanism above
 */

// jDiet brings you backwards compatibility for JS features like:

JSON.stringify() // thanks Douglass:)

Function.prototype.bind()
  // when you use ajax call inside your class or any other callback for anything
  // and as callback you need to call any method in your class, you can do so:

jDiet.ajax({
	// mandatory params
	uri: "?anything", 		// string
	// optional params:
	async: true, 			// boolean, true as default
	data: {}, 				// object to bee stringified
	method: 'POST', 		// string, 'GET' as default 
	success: function(){}	// function called when everything is fine
	error: function(){}		// function called in exception
	headers: {}, 			// key value object with headers to be sent
	cache: false			// boolean, false as default
});
```
