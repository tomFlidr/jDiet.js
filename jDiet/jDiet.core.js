// static constants
jDiet['browser'] = {'version':0};

// public static methods
jDiet['toString'] = function () {
	return '[jDiet]';
};

// local static variables and objects
jDiet.local.browserRecognizers = {
	// http://www.useragentstring.com/pages/useragentstring.php
	'msie': {
		bmatch: /MSIE [0-9]|Trident\/[0-9]/g,
		vmatch: function(ua){
			if (/MSIE [0-9]/g.test(ua)){
				return ua.replace(/(.*)MSIE ([0-9\.]*);(.*)/g, '$2');
			} else {
				return ua.replace(/(.*)rv:([0-9\.]*)(.*)/g, '$2');
			}
		}
	},
	'chrome': {
		bmatch: /Chrome/g,
		vmatch: [/(.*)Chrome\/(.*) Safari(.*)/g, '$2']
	},
	'safari': {
		bmatch: /Safari/g,
		vmatch: [/(.*)Version\/(.*) Safari(.*)/g, '$2']
	},
	'opera': {
		bmatch: /Opera/g,
		vmatch: function(ua){
			if(ua.indexOf('Version') > -1){
				return ua.replace(/(.*)Version\/(.*)scope/g, '$2');
			}else{
				var substr = ua.replace(/(.*)Opera.([0-9])/g, '$2');
				return substr.replace(/([0-9]*) (.*)/g, '$1');
			}
		}
	},
	'firefox': {
		bmatch: /Firefox\//g,
		vmatch: function(ua){
			var substr = ua.replace(/(.*) Firefox\/(.*)/g, '$2');
			if(substr.indexOf(' ') > -1){
				substr = substr.substr(0, substr.indexOf(' '));
			}
			return substr;
		}
	},
	'gecko': {
		bmatch: /Gecko\//g,
		vmatch: [/(.*); rv:(.*)\)(.*)/g, '$2']
	},
	'other': {
		bmatch: /(.*)/g,
		vmatch: [/[^0-9\.]/g, '']
	}
};
jDiet.local.recognizeBrowser = function(){
	var scope = this;
	var ua = navigator['userAgent'];
	for(var browserName in scope.browserRecognizers){
		jDiet['browser'][browserName] = 0;
	};
	for(browserName in scope.browserRecognizers){
		var browser = scope.browserRecognizers[browserName];
		if(browser.bmatch.test(ua)){
			// complete browser name
			jDiet['browser'][browserName] = 1;
			jDiet['browser']['name'] = browserName;
			// complete browser version
			var versionStr = '';
			if(typeof(browser.vmatch) == 'function'){
				versionStr = browser.vmatch(ua);
			}else{
				versionStr = ua.replace(browser.vmatch[0], browser.vmatch[1]);
			}
			jDiet['browser']['version'] = parseFloat(versionStr);
			break;
		}
	}
	if (ua.indexOf('Gecko/') > -1) {
		jDiet['browser']['gecko'] = 1;
		if (/rv\:[0-9]{1}/gi.test(ua)) {
			jDiet['browser']['geckoVersion'] = parseFloat(ua.substr(ua.indexOf('rv:') + 3));
			
		}
	}
};

// init calls
jDiet.local.recognizeBrowser();

// jDiet()... prototype dom methods
jDiet.prototype.eachCall = function (handler)
{
	return this['each'].call(this, handler);
};
jDiet['prototype']['each'] = function ()
{
	var args = [].slice.apply(arguments);
	var fn = args[0];
	var length = typeof(this['length']) == 'number' ? this['length'] : 1 ;
	for (var i = 0; i < length; i += 1) {
		if (typeof(this[i]) == 'undefined') continue;
		args[0] = parseInt(i, 10);
		var r = fn.apply(this[i], args);
		if (r === false) {
			break;
		}
	}
	return this;
};
jDiet['prototype']['toString'] = function ()
{
	return jDiet['toString']();
};

// plugins place
jDiet['fn'] = jDiet['prototype'];