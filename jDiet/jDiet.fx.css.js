// static constants
jDiet['FRAMERATE'] = 20;
// local static variables and objects
jDiet.local.displayPropertiesNodeNames = [
	'table',
	'table-row',
	'table-cell',
	'inline'
];
jDiet.local.displayPropertiesNodeNameIndexes = {
	'table'		: 0,
	'tr'		: 1,
	'th'		: 2,
	'td'		: 2,
	'span'		: 3,
	'i'			: 3,
	'b'			: 3,
	'strong'	: 3,
	'em'		: 3,
	'img'		: 3,
	'br'		: 3,
	'input'		: 3,
	'abbr'		: 3,
	'acronym'	: 3,
	'u'			: 3,
	'a'			: 3
};
// set up css display properties for old browsers
new function ()
{
	// old ies fix
	if (jDiet['browser']['msie'] && jDiet['browser']['version'] < 8) {
		jDiet.local.displayPropertiesNodeNames[1] = '';
		jDiet.local.displayPropertiesNodeNames[2] = '';
	}
}();
//static methods
jDiet.local.styleOne = function (elm, props)
{
	if (jDiet['DEBUG']) {
		try {
			jDiet.local.styleOneElm(elm, props);
		} catch (e) {
			var caller = arguments.callee.caller;
			while (true) {
				if (caller.toString() == '[jDiet]') {
					caller = caller.caller.caller;
					break;
				} else {
					caller = caller.caller; 
				}
			}
			jDiet['DEBUG']("Wrong args called from:\r\n" + caller.toString());
		}
	} else {
		jDiet.local.styleOneElm(elm, props);
	}
};
jDiet.local.styleOneElm = function (elm, props)
{
	for (var p in props) {
		if (
			(p == 'width' ||
			p == 'height' ||
			p == 'top' ||
			p == 'bottom' ||
			p == 'left' ||
			p == 'right') && 
			/^[0-9\-\.]*$/g.test(props[p])
		) {
			elm['style'][p] = props[p] + 'px';
		} else {
			elm['style'][p] = props[p];
		}
	}
};
jDiet['prototype']['fx'] = {
	'easing': {
		'easeIn': function (x, tr, b, f, t) {
			return this.makeSinusEase({
				begin		: 0,
				finall		: Math.PI / 2,
				range		: 1
			}, tr, b, f, t);
		},
		'easeOut': function (x, tr, b, f, t) {
			return this.makeSinusEase({
				begin		: - (Math.PI / 2),
				finall		: 0,
				range		: 1
			}, tr, b, f, t);
		},
		'easeInOut': function (x, tr, b, f, t) {
			return this.makeSinusEase({
				begin		: - (Math.PI / 2),
				finall		: Math.PI / 2,
				range		: 2
			}, tr, b, f, t);
		},
		'easeOutBackIn': function (x, tr, b, f, t) {
			this['easing']['easeOutBackIn']['sinEndMarginWatcher'] = this['easing']['easeOutBackIn']['sinEndMarginWatcher'] || [0, 0];
			return this.makeSinusEase({
				begin		: - (Math.PI / 2),
				finall		: (Math.PI / 2) + 0.75,
				range		: (jDiet['browser'].msie) ? 1.8 : 1.9
			}, tr, b, f, t);
		},
		'backOutEaseIn': function (x, tr, b, f, t) {
			// this['easing']['backOutEaseIn']['sinBeginMarginWatcher'] = this['easing']['backOutEaseIn']['sinBeginMarginWatcher'] || [0, 0];
			return this.makeSinusEase({
				begin		: - (Math.PI / 2) - 0.75,
				finall		: (Math.PI / 2),
				range		: 1.7
			}, tr, b, f, t);
		},
		'backInOut': function (x, tr, b, f, t) {
			//this['easing']['backInOut']['sinBeginMarginWatcher'] = this['easing']['backInOut']['sinBeginMarginWatcher'] || [0, 0];
			this['easing']['backInOut']['sinEndMarginWatcher'] = this['easing']['backInOut']['sinEndMarginWatcher'] || [0, 0];
			return this.makeSinusEase({
				begin		: - (Math.PI / 2) - 0.75,
				finall		: (Math.PI / 2) + 0.75,
				range		: 1.5
			}, tr, b, f, t);
		},
		'linear': function (x, tr, b, f, t) {
			/**
			x - jQuery compatible argument
			tr	- actual time from animation begin
			b - begin property value
			f - final property value
			t - time for whole animation
			*/
			return b + ((f - b) * (tr / t));
		}
	},
	getEasingFn: function (easing) {
		var result = this['easing'][(easing) ? easing : 'linear'];
		if ((result.sinBeginMarginWatcher) != 'undefined') {
			result.sinBeginMarginWatcher = [0, 0];
		};
		if ((result.sinEndMarginWatcher) != 'undefined') {
			result.sinEndMarginWatcher = [0, 0];
		};
		return result;
	},
	completeBeginAnimateProps: function (elm, finalProps) {
		var beginProps = {};
		var offsetSettersGetters = {
			'width'	: 'offsetWidth',
			'height': 'offsetHeight',
			'left'	: 'offsetLeft',
			'top'	: 'offsetTop'
		};
		var propValue = 0;
		for (var p in offsetSettersGetters) {
			if (typeof(finalProps[p]) != 'undefined') {
				beginProps[p] = elm[offsetSettersGetters[p]];
			}
		}
		return [beginProps, finalProps];
	},
	makeSinusEase: function (config, tr, b, f, t)
	{
		var piDiff = config.finall - config.begin;
		var propDiff = f - b;
		var per = (tr / t);
		var sin = Math.sin(config.begin + (per * piDiff));
		// make sin on range verticaly
		var shift1 = (Math.sin(config.finall) * (-1)) + 1;
		var shift2 = Math.sin(config.begin);
		shift2 = (shift2 < 0) ? shift2 * (-1) : 0 ;
		var shift = Math.max(shift1, shift2);
		sin += shift;
		// fix range
		sin = sin / config.range;
		// special fixes for back easing
		var marginWatchers = ['sinEndMarginWatcher'];
		for (var mw in marginWatchers) {
			var propertyName = marginWatchers[mw];
			if (typeof(arguments.callee.caller) != 'undefined' && typeof(arguments.callee.caller[propertyName]) != 'undefined') {
				var watcher = arguments.callee.caller[propertyName];
				if (watcher[0] == 1) {
					if (mw === 0 && sin < watcher[1]) {
						sin = 1;
					} else {
						watcher = [1, sin];
					}
				} else if ((mw === 0 && sin > 1)) {
					watcher = [1, sin];
				}
				arguments.callee.caller[propertyName] = watcher;
			}
		}
		return b + (sin * propDiff);
	},
	animateOne: function (elm, finalProps, time, easing, callback)
	{
		var elmScope = this;
		var startTime = (new Date()).getTime();
		var easingFn = this.getEasingFn(easing);
		var propsResult = this.completeBeginAnimateProps(elm, finalProps);
		var beginProps = propsResult[0];
		finalProps = propsResult[1];
		var loopCall = function () {
			var now = (new Date()).getTime();
			var nowRelative = now - startTime;
			if (nowRelative < time) {
				var currentProps = {};
				for(var p in finalProps) {
					currentProps[p] = easingFn.apply(elmScope, [null, nowRelative, beginProps[p], finalProps[p], time]);
				}
				jDiet.local.styleOne(elm, currentProps);
				elm['jDietFxId'] = setTimeout(loopCall, 1000 / jDiet['FRAMERATE']);
			} else {
				jDiet.local.styleOne(elm, finalProps);
				if (callback) callback();
			}
		};
		elm['jDietFxId'] = setTimeout(loopCall, 1000 / jDiet['FRAMERATE']);
	}
};
jDiet['prototype']['animate'] = function (props, time, easing, callback)
{
	easing = (easing) ? easing : 'linear' ;
	var scope = this;
	this.eachCall(function(i) {
		scope['fx'].animateOne(this, props, time, easing, callback);
	});
	return this;
};
jDiet['prototype']['stop'] = function ()
{
	this.eachCall(function(i) {
		clearTimeout(this['jDietFxId']);
	});
	return this;
};
jDiet['prototype']['hide'] = function ()
{
	this.eachCall(function() {
		this['style']['display'] = 'none';
	});
	return this;
};
jDiet['prototype']['show'] = function ()
{
	var nodeName = '';
	var displayProperty = '';
	this.eachCall(function() {
		nodeName = String(this['nodeName']).toLowerCase();
		displayProperty = (typeof(jDiet.local.displayPropertiesNodeNameIndexes[nodeName]) != 'undefined')
				?
			jDiet.local.displayPropertiesNodeNames[jDiet.local.displayPropertiesNodeNameIndexes[nodeName]]
				:
			'block'
		;
		this['style']['display'] = displayProperty;
	});
	return this;
};
jDiet['prototype']['setCss'] = function (props)
{
	this.eachCall(function () {
		jDiet.local.styleOne(this, props);
	});
	return this;
};
jDiet['prototype']['getCss'] = function (propertyName)
{
	var result = '';
	var contextDocument = this['context'].ownerDocument || doc;
	this.eachCall(function() {
		var resultLocal;
		if (contextDocument['defaultView'] && contextDocument['defaultView']['getComputedStyle']) {
			resultLocal = contextDocument['defaultView']['getComputedStyle'](this, '')['getPropertyValue'](propertyName);
		} else if (this['currentStyle']) {
			propertyName = propertyName['replace'](/\-(\w)/g, function (strMatch, p1) {
				return p1['toUpperCase']();
			});
			resultLocal = this['currentStyle'][propertyName];
		};
		if (resultLocal !== null) {
			result = resultLocal;
			return false;
		};
		return true;
	});
	return result;
};
jDiet['prototype']['getCssFloat'] = function (propertyName)
{
	var success = false,
		resultFloat = 0.0,
		resultStr = this['getCss'](propertyName);
	
	resultStr = resultStr.replace(/[^0-9\.]/g, '');
	
	if (resultStr.length && resultStr!== '.') {
		success = true;
		resultFloat = parseFloat(resultStr);
	}
	
	return [success, resultFloat];
};
jDiet['prototype']['offset'] = function()
{
	var result = {
		'left': 0,
		'top': 0
	};
	if (typeof(this[0]) != 'undefined') {
		var elm = this[0];
		if (typeof(elm['x']) != 'undefined' && typeof(elm['y']) != 'undefined') {
			result['left'] = elm['x'];
			result['top'] = elm['y'];
		} else {
			while (true) {
				result['left'] += elm['offsetLeft'];
				result['top'] += elm['offsetTop'];
				if (elm['offsetParent']) {
					elm = elm['offsetParent'];
				} else {
					break;
				}
			}
		}
	};
	return result;
};
