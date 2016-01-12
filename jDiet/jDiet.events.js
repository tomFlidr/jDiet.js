jDiet['domReady'] = {
	'add': function(fn) {
		// Already loaded?
		if (jDiet['domReady']['loaded']) return fn();
		// Observers
		var observers = jDiet['domReady'].observers;
		if (!observers) observers = jDiet['domReady'].observers = [];
		// Array#push is not supported by Mac IE 5
		observers[observers['length']] = fn;
		// domReady function
		if (jDiet['domReady']['callback']) return;
		jDiet['domReady']['callback'] = function() {
			if (jDiet['domReady']['loaded']) return;

			jDiet['domReady']['loaded'] = true;
			if (jDiet['domReady'].timer) {
				clearInterval(jDiet['domReady'].timer);
				jDiet['domReady'].timer = null;
			}
			
			var observers = jDiet['domReady'].observers;
			for (var i = 0, length = observers['length']; i < length; i++) {
				var fn = observers[i];
				observers[i] = null;
				fn(); // make 'this' as win
			}
			jDiet['domReady']['callback'] = jDiet['domReady'].observers = null;
		};
		// Emulates 'onDOMContentLoaded'
		var ie = !!(win['attachEvent'] && !win['opera']);
		var webkit = navigator['userAgent']['indexOf']('AppleWebKit/') > -1;
		if (doc['readyState'] && webkit) {
			// Apple WebKit (Safari, OmniWeb, ...)
			jDiet['domReady'].timer = setInterval(function() {
				var state = doc['readyState'];
				if (state == 'loaded' || state == 'complete') {
					jDiet['domReady']['callback']();
				}
			}, 50);
		} else if (doc['readyState'] && ie) {
			// Windows IE
			var src = (win['location']['protocol'] == 'https:') ? '://0' : 'javascript:void(0)';
			doc['write'](
				'<script type="text/javascript" defer="defer" src="' + src + '" ' +
				'onreadystatechange="if(this.readyState==\'complete\')jDiet.domReady.callback();"' +
				'><\/script>');
		} else {
			if (win['addEventListener']) {
				// for Mozilla browsers, Opera 9
				doc['addEventListener']('DOMContentLoaded', jDiet['domReady']['callback'], false);
				// Fail safe
				win['addEventListener']('load', jDiet['domReady']['callback'], false);
			} else if (win.attachEvent) {
				win['attachEvent']('onload', jDiet['domReady']['callback']);
			} else {
				// Legacy browsers (e.g. Mac IE 5)
				var fn = win['onload'];
				win['onload'] = function() {
					jDiet['domReady']['callback']();
					if (fn) fn();
				}
			}
		}
	}
};
// add the first dom ready call
jDiet['domReady']['add'](function () {
	jDiet['domReady']['loaded'] = true;
});
// local static variables and objects
jDiet.local.elementsVsHandlers = [];
jDiet.local.getEventKey = function(el, eName, handler){
	var uid;
	if(el === win){
		uid = 'theWindow';
	}else if (el === doc){
		uid = 'theDocument';
	}else{
		uid = el.uniqueID;
	};
	return '{FNKEY::el_' + uid + '::evt_' + eName + '::fn_' + handler['toString']().replace(/\s/g, '') + '}';
};
jDiet.local.getMousePositions = function (ev)
{
	var result = [];
	var docScrolls = [];
	var docElm = doc['documentElement'];
	var docBody = doc['body'];
	if(jDiet['browser']['msie']){
		if(docElm && docElm['scrollTop']){
			docScrolls = [
				docElm['scrollLeft'],
				docElm['scrollTop']
			];
		}else{
			docScrolls = [
				docBody['scrollLeft'],
				docBody['scrollTop']
			];
		}
		result = [
			ev['clientX'] + docScrolls[0],
			ev['clientY'] + docScrolls[1]
		];
	}else{
		result = [
			ev['pageX'],
			ev['pageY']
		];
	}
	return result;
}
jDiet.local.bindEvent = function (el, eName, handler, useCapture)
{
	var scope = this;
	if(jDiet['browser']['msie'] && typeof(el['attachEvent']) != 'undefined'){
		var eventPrevented = false;
		var e = {
			'preventDefault': function () {
				eventPrevented = true;
			}
		};
		var preHandler = function(ev){
			// event object fixing
			ev = ev || win['event'];
			for (var i in ev) {
				e[i] = ev[i];
			};
			// scr element property fix
			e['srcElement'] = el;
			// pageX and pageY fixing
			var mousePositions = scope.getMousePositions(ev);
			e['pageX'] = mousePositions[0];
			e['pageY'] = mousePositions[1];
			// real handler call
			handler.call(el, e);
			// event fixing
			if (eventPrevented) {
				return false;
			}
			return true;
		};
		// podržení skutecné uživatelské handler funkce v jednom obrovským poli handlerù
		var key = scope.getEventKey(el, eName, handler);
		scope.elementsVsHandlers[key] = preHandler;
		// atachnutí elementu pomoci specialni metody v jscriptu
		el['attachEvent']('on' + eName, preHandler);
		// sraèky kvuli preteceni pameti v IE
		win['attachEvent']('onunload', function(){
			el['detachEvent']('on' + eName, preHandler);
		});
	} else if (typeof(el['addEventListener']) == 'function') {
		el['addEventListener'](eName, handler, useCapture);
	}
};
jDiet['prototype']['bind'] = function (eName, handler, useCapture)
{
	if (!eName || !handler) return;
	var eNames = eName.replace(/\s/g, '').split(',');
	this.eachCall(function(){
		if (typeof(this) == 'object') {
			for (var i = 0, l = eNames.length; i < l; i += 1) {
				var en = eNames[i];
				if (this['nodeName'] == '#document' && en == 'ready') {
					jDiet['domReady']['add'](handler);
				} else {
					jDiet.local.bindEvent(this, en, handler, useCapture);
				}
			}
		}
	});
	return this;
};
jDiet['prototype']['unbind'] = function (eName, handler, useCapture)
{
	if (!eName || !handler) return;
	var eNames = eName.replace(/\s/g, '').split(',');
	this.eachCall(function(){
		if (typeof(this) == 'object') {
			for (var i = 0, l = eNames.length; i < l; i += 1) {
				var en = eNames[i];
				if(jDiet['browser']['msie'] && jDiet['browser']['version'] < 9){
					var key = jDiet.local.getEventKey(this, en, handler);
					var preHandler = jDiet.local.elementsVsHandlers[key];
					if (typeof(preHandler) != 'undefined'){
						this['detachEvent']('on' + en, preHandler);
						delete jDiet.local.elementsVsHandlers[key];
					}
				}else{
					this['removeEventListener'](en, handler, useCapture);
				}
			}
		}
	});
	return this;
};
// create shim (or owerwrite in new browsers) practical bind function in Function prototype
if (!Function.prototype['bind']) {  
	Function.prototype['bind'] = function (oThis) {  
		if (typeof this !== "function") {  
			// closest thing possible to the ECMAScript 5 internal IsCallable function  
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");  
		}
		var aArgs = Array.prototype.slice.call(arguments, 1),   
			fToBind = this,   
			fNOP = function(){},  
			fBound = function(){  
				return fToBind.apply(this instanceof fNOP  
					? this  
					: oThis || win,  
					aArgs.concat(Array.prototype.slice.call(arguments)))
				;  
			};
		fNOP.prototype = this.prototype;  
		fBound.prototype = new fNOP();
		return fBound;  
	};  
};