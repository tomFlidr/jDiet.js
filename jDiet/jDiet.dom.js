// static variables and functions
jDiet['trim'] = function (str, charlist) {
    // Strips whitespace from the beginning and end of a string  
    // 
    // version: 905.1001
    // discuss at: http://phpjs.org/functions/trim
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: mdsjack (http://www.mdsjack.bo.it)
    // +   improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
    // +      input by: Erkekjetter
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: DxGx
    // +   improved by: Steven Levithan (http://blog.stevenlevithan.com)
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // *     example 1: trim('    Kevin van Zonneveld    ');
    // *     returns 1: 'Kevin van Zonneveld'
    // *     example 2: trim('Hello World', 'Hdle');
    // *     returns 2: 'o Wor'
    // *     example 3: trim(16, 1);
    // *     returns 3: 6
    var whitespace, l = 0, i = 0;
    str += '';

    if (!charlist) {
        // default list
        whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
};

// local static variables and objects
jDiet.local.createElm = function (elmRawName, attrsStylesElmsAndHtml)
{
	var elmName = elmRawName.substr(1, elmRawName['length'] - 2);
	var $elm = new jDiet(doc.createElement(elmName));
	if (typeof(attrsStylesElmsAndHtml) != 'undefined') {
		if (attrsStylesElmsAndHtml['attrs']) {
			$elm['setAttr'](attrsStylesElmsAndHtml['attrs']);
		};
		if (attrsStylesElmsAndHtml['css']) {
			$elm['css'](attrsStylesElmsAndHtml['css']);
		};
		if (attrsStylesElmsAndHtml['elms']) {
			for (var i = 0, l = attrsStylesElmsAndHtml['elms']['length']; i < l; i += 1) {
				var elmRecord = attrsStylesElmsAndHtml['elms'][i];
				var $newElm = arguments.callee(elmRecord[0], elmRecord[1]);
				$elm['append']($newElm[0]);
			}
		} else if (attrsStylesElmsAndHtml['html']) {
			$elm[0]['innerHTML'] = attrsStylesElmsAndHtml['html'];
		};
	};
	return $elm;
}
jDiet.local.makeResult = function (selectorsResult, context, selectors)
{
	for (var i = 0, l = selectorsResult['length']; i < l; i += 1) {
		this[i] = selectorsResult[i];
	};
	this['length'] = l;
	this['context'] = context || doc;
	this['selector'] = (selectors) ? selectors : 'this';
	return this;
};
jDiet.local.getElementsBySelectorsAndContext = function (selectors, context)
{
	context = context || doc;
	var 
		result = [],
		localResult = [],
		childsResults = [],
		explodedSelectorLocal = [],
		selectorLocal = '',
		// ".a div span, .b div span" => [".a div span", ".b div span"]
		selectorsArr = selectors.replace(/,[\s]*/gi, ',').split(',')
	;
	for(var s = 0, l = selectorsArr['length']; s < l; s += 1) {
		// ".a div span"
		selectorLocal = jDiet['trim'](selectorsArr[s]);
		if (selectorLocal.indexOf(' ') > -1) {
			// this is selector with childs
			explodedSelectorLocal = selectorLocal.split(' ');
			// results for selector ".a" => could be like this - childsResults[0] = [.a, .a, .a]
			childsResults = [this.getElementsBySelectorAndContext(explodedSelectorLocal[0], context)];
			// for [div, span]
			for (var i = 1; i < explodedSelectorLocal.length; i += 1) {
				// parents for current child selector - [.a, .a, .a] | [.a div, .a div]
				localResult = childsResults[i - 1];
				childsResults[i] = [];
				for (var j = 0; j < localResult.length; j += 1) {
					childsResults[i] = childsResults[i].concat(
						jDiet.local.catchChildNodesBySelector(
							localResult[j], 
							jDiet.local.parseSelector(explodedSelectorLocal[i])
						)
					);
				}
			}
			result = result.concat(childsResults[childsResults.length - 1]);
		} else {
			// basic selector
			localResult = this.getElementsBySelectorAndContext(selectorLocal, context);
			result = result.concat(localResult);
		}
	}
	return [result, context, selectors];
};
jDiet.local.getElementsBySelectorAndContext = function (selector, context)
{
	var rawResult = [];
	var result = [];
	if (selector.indexOf('#') > -1 && selector.indexOf('#') + 1 < selector.length) {
		var resultById = context.getElementById(selector.substr(selector.indexOf('#') + 1));
		if (resultById !== null) rawResult = [resultById];
	} else if (selector.indexOf('.') > -1 && selector.indexOf('.') + 1 < selector.length) {
		if (jDiet['browser']['msie'] && jDiet['browser']['version'] < 8 || typeof(context['querySelectorAll']) == 'undefined') {
			rawResult = this.getElementsBySelectorAndContextInOldIE(selector, context);
		} else {
			rawResult = context['querySelectorAll'](selector);
		}
	} else {
		rawResult = context['getElementsByTagName'](selector);
	};
	if (jDiet['browser']['msie']) {
		for (var r in rawResult) {
			if (rawResult[r] !== null && typeof(rawResult[r]) == 'object' && typeof(rawResult[r].nodeName) == 'string') {
				result.push(rawResult[r]);
			}
		}
	} else {
		result = [].slice.apply(rawResult);
	}
	return result;
};
jDiet.local.getElementsBySelectorAndContextInOldIE = function (selector, context)
{
	var result = [];
	var nodeName = '';
	var pos = 0;
	if (selector.indexOf('#') > -1) {
		pos = selector.indexOf('#');
		nodeName = String(selector.substr(0, pos)).toLowerCase();
		selector = selector.substr(pos + 1);
	};
	if (selector.indexOf('.') > -1) {
		pos = selector.indexOf('.');
		nodeName = String(selector.substr(0, pos)).toLowerCase();
		selector = selector.substr(pos + 1);
	};
	if (!nodeName) {
		nodeName = '*';
	};
	var allElms = context.getElementsByTagName(nodeName);
	var classNameWithSpaces = ' ' + selector + ' ';
	for (var e in allElms) {
		if (String(' ' + allElms[e].className + ' ').indexOf(classNameWithSpaces) !== -1) {
			result.push(allElms[e]);
		}
	};
	return result;
};
jDiet.local.catchElementBySelector = function (el, sel)
{
	var localResult = [
		0, // nodeName
		0, // id
		0  // className
	];
	// check matches
	if (sel === false) {
		if (el !== null && typeof(el) == 'object' && String(el['nodeName'])['toLowerCase']() !== '#text') {
			return true;
		} else {
			return false;
		}
	} else {
		if (sel['nodeName']) {
			if (String(el['nodeName'])['toLowerCase']() == sel['nodeName']) {
				localResult[0] = 1;
			}
		};
		if (sel['id']) {
			if (el['id'] == sel['id']) {
				localResult[1] = 1;
			}
		};
		if (sel['className'] && typeof(el['className']) == 'string') {
			var className =  ' ' + el['className'].replace(/\t/, ' ').replace(/\s\s/, ' ') + ' ';
			var r = new RegExp(' ' + sel['className'] + ' ', 'gi');
			if (r.test(className)) {
				localResult[2] = 1;
			}
		};
		// decide result
		if (
			(sel['nodeName'] && !localResult[0]) ||
			(sel['id'] && !localResult[1]) ||
			(sel['className'] && !localResult[2])
		) {
			return false;
		} else {
			return true;
		}
	}
};
jDiet.local.parseSelector = function (selector)
{
	if (typeof(selector) == 'undefined') return false;
	var parsedSel = [];
	var result = {
		'nodeName'	: '',
		'id'		: '',
		'className'	: ''
	};
	if (selector['indexOf']('#') > 0) {
		parsedSel = selector['split']('#');
		result['nodeName'] = parsedSel[0]['toLowerCase']();
		result['id'] = parsedSel[1];
	} else if (selector['indexOf']('.') > 0) {
		parsedSel = selector['split']('.');
		result['nodeName'] = parsedSel[0]['toLowerCase']();
		result['className'] = parsedSel[1];
	} else if (selector['indexOf']('#') === 0) {
		parsedSel = selector['split']('#');
		result['id'] = parsedSel[1];
	} else if (selector['indexOf']('.') === 0) {
		parsedSel = selector['split']('.');
		result['className'] = parsedSel[1];
	} else {
		result['nodeName'] = selector['toLowerCase']();
	}
	return result;
};
jDiet.local.catchChildNodesBySelector = function (parentNode, selector)
{
	var elms = [];
	var child;
	for (var i = 0; i < parentNode['childNodes']['length']; i += 1) {
		child = parentNode['childNodes'][i];
		if (jDiet.local.catchElementBySelector(child, selector)) {
			elms.push(child);
		}
	}
	return elms;
};
jDiet.local.cleanClassName = function (className)
{
	className = className.replace(/\s{2,}/g, ' ');
	return jDiet['trim'](className);
};

// jDiet()... prototype dom methods
jDiet['prototype']['children'] = function (selector)
{
	var scope = this;
	var sel = jDiet.local.parseSelector(selector);
	var elms = [];
	this.eachCall(function() {
		elms = elms.concat(jDiet.local.catchChildNodesBySelector(this, sel));
	});
	var currentSel = this['selector'] ? this['selector'] : 'this';
	return jDiet.local.makeResult.call(
		new jDiet(),
		elms, this['context'], currentSel + ' > ' + ((selector) ? selector : '' )
	);
};
jDiet['prototype']['parent'] = function ()
{
	var elms = [];
	this.eachCall(function() {
		if (typeof(this['parentNode']) != 'undefined') {
			elms.push(this['parentNode']);
		}
	});
	var currentSel = this['selector'] ? this['selector'] : 'this';
	return jDiet.local.makeResult.call(
		new jDiet(),
		elms, this['context'], currentSel + ' < parent'
	);
};
jDiet['prototype']['prepend'] = function (newElm)
{
	var elms = [];
	var single = this['length'] === 1 ? 1 : 0 ;
	this.eachCall(function() {
		var cont = this;
		var prependedElm = single ? newElm : newElm['cloneNode'](true);
		if (jDiet['browser']['msie'] && jDiet['browser']['version'] < 9) {
			elms.push(cont['insertAdjacentElement']('afterBegin', prependedElm));
		} else {
			elms.push(cont['insertBefore'](prependedElm, cont['firstChild']));
		}
	});
	return jDiet.local.makeResult.call(
		new jDiet(),
		elms, this['context'] ? this['context'] : undefined
	);
};
jDiet['prototype']['append'] = function (newElm)
{
	var elms = [];
	var single = this['length'] === 1 ? 1 : 0 ;
	this.eachCall(function() {
		var cont = this;
		var prependedElm = single ? newElm : newElm['cloneNode'](true);
		if (jDiet['browser']['msie'] && jDiet['browser']['version'] < 9) {
			elms.push(cont['insertAdjacentElement']('beforeEnd', prependedElm));
		} else {
			elms.push(cont['appendChild'](prependedElm));
		}
	});
	return jDiet.local.makeResult.call(
		new jDiet(),
		elms, this['context'] ? this['context'] : undefined
	);
};
jDiet['prototype']['addClass'] = function (str)
{
	var result = false;
	var scope = this;
	this.eachCall(function() {
		var className = jDiet.local.cleanClassName(this['className']);
		var classes = className.split(' ');
		var classCatched = false;
		for (var c = 0, d = classes.length; c < d; c += 1) {
			if (classes[c] == str) {
				classCatched = true;
				break;
			}
		};
		if (!classCatched) {
			this['className'] = className + ' ' + str;
		}
	});
	return this;
};
jDiet['prototype']['removeClass'] = function (str)
{
	var rg = new RegExp(' ' + str + ' ', 'gi');
	var scope = this;
	this.eachCall(function() {
		var className = ' ' + jDiet.local.cleanClassName(this['className']) + ' ';
		className = className.replace(rg, ' ');
		this['className'] = jDiet.local.cleanClassName(className);
	});
	return this;
};
jDiet['prototype']['hasClass'] = function (str)
{
	var result = false;
	var scope = this;
	this.eachCall(function() {
		var className = ' ' + jDiet.local.cleanClassName(this['className']) + ' ';
		if (className.indexOf(' ' + str + ' ') > -1) {
			result = true;
		}
		return false;
	});
	return result;
};
jDiet['prototype']['setAttr'] = function(attrsNamesAndValues)
{
	this.eachCall(function() {
		for(var anav in attrsNamesAndValues) {
			if (anav == 'class') {
				this['className'] = String(this['className'] + ' ' + attrsNamesAndValues[anav]).replace(/\s\s/gm, ' ');
			} else {
				this['setAttribute'](anav, attrsNamesAndValues[anav]);
			}
		}
	});
	return this;
};
jDiet['prototype']['getAttr'] = function(name)
{
	var name = name.toLowerCase(),
		result = null,
		b = jDiet['browser'],
		ie = b['msie'],
		v = b['version'],
		isStyle = Boolean(name == 'style');

	if (isStyle && ie && v < 8) {
		// http://quirksmode.org/dom/core/#t123
		this.eachCall(function() {
			// try to get raw html string from outerHTML property and parse a style attribute
			var outerCode = String(this['outerHTML']),
				nodeBeginEndCharPos = outerCode.indexOf('>');
			if (nodeBeginEndCharPos > -1) {
				outerCode = outerCode
					.substr(0, nodeBeginEndCharPos + 1)
					.toLowerCase()
					.replace(/\t\r\n/g, '')		// remove whitespaces except spaces
					.replace(/(\s)*=/g, '=')	// remove any spaces before isequalto character
					.replace(/=(\s)*"/g, '="')	// remove any spaces between isequalto character and first double quote
					.replace(/=(\s)*'/g, "='")	// remove any spaces between isequalto character and single quote
					.replace(/[']/g, '"');		// replace all single quotes with double quotes
				var styleAttrBeginPos = outerCode.indexOf('style="'),
					styleAttrEndPos = outerCode.indexOf('"', Math.max(styleAttrBeginPos, 0)),
					styleAttr = '';
				if (styleAttrBeginPos > -1 && styleAttrEndPos > -1) {
					styleAttr = jDiet['trim'](outerCode.substring(styleAttrBeginPos + 7, styleAttrEndPos));
				}
			} else {
				return false;
			}
		});
	} else {
		this.eachCall(function() {
			var resultLocal = this['getAttribute'](name);
			if (typeof(resultLocal) == 'string') {
				result = resultLocal;
				return false;
			};
		});
		if (isStyle && ie && v == 8 && typeof(result) == 'string' && result.length > 0) {
			// http://quirksmode.org/dom/core/#t123
			result = result.toLowerCase() + ';';
		}
	}
	return result;
};
jDiet['prototype']['removeAttr'] = function(name)
{
	this.eachCall(function() {
		this['removeAttribute'](name);
	});
	return this;
};
jDiet['prototype']['val'] = function ()
{
	var contextDoc = this['context'].ownerDocument || doc;
	var result = '';
	this.eachCall(function() {
		var resultLocal;
		var classicGetting = true;
		var getter = 'innerHTML';
		var nodeName = String(this['nodeName'])['toLowerCase']();
		if (nodeName == 'input' || nodeName == 'select' || nodeName == 'textarea') {
			getter = 'value';
			if (nodeName == 'input') {
				var type = String(this['getAttribute']('type'))['toLowerCase']();
				if (type == 'checkbox') {
					classicGetting = false;
					if (this['checked']) {
						resultLocal = this[getter];
						if (resultLocal == '') resultLocal = 'on';
					}
				} else if (type == 'radio') {
					classicGetting = false;
					resultLocal = '';
					var name = this.name;
					var radios = contextDoc['getElementsByName'](name);
					for (var r in radios) {
						if (String(radios[r]['nodeName'])['toLowerCase']() == 'input' && radios[r].getAttribute('type') == 'radio') {
							if (radios[r]['checked']) {
								resultLocal = radios[r][getter];
								break;
							}
						}
					}
				}
			}
		}
		if (classicGetting) {
			resultLocal = this[getter];
		}
		if (typeof(resultLocal) == 'string') {
			result = resultLocal;
			return false;
		};
	});
	return result;
};
jDiet['prototype']['checked'] = function (val)
{
	var getter = typeof(val) == 'undefined';
	var result;
	this.eachCall(function() {
		if (getter) {
			result = Boolean(this['checked']);
			return false;
		} else {
			this['checked'] = Boolean(val);
		}
	});
	if (getter) {
		return result;
	} else {
		return this;
	}
};

// overwrite document.write and document.writeln on document ready
try {
	doc.write = (function(oldDocWrite) {
		return function(str) {
			if (jDiet['domReady']['loaded']) {
				var $elm = new jDiet('<div>',{'html':str});
				var $appended = new jDiet(doc.body).append($elm[0].firstChild);
				return $appended[0];
			} else {
				if (jDiet['browser']['msie'] && jDiet['browser']['version'] < 8) {
					return oldDocWrite(str);
				} else {
					return oldDocWrite.call(this, str);
				}
			}
		}
	})(doc.write);
	doc.writeln = (function(oldDocWrite) {
		return function(str) {
			if (jDiet['domReady']['loaded']) {
				var $elm = new jDiet('<div>',{'html':str});
				var $appended = new jDiet(doc.body).append($elm[0]);
				return $appended[0];
			} else {
				if (jDiet['browser']['msie'] && jDiet['browser']['version'] < 8) {
					return oldDocWrite(str);
				} else {
					return oldDocWrite.call(this, str);
				}
			}
		}
	})(doc.writeln);
} catch (e) {};
