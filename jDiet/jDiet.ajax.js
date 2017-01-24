jDiet['ajax'] = function (o) {
	var help = "mandatory params: \n\t'uri' (String)\noptional params: \n\t'async' (Boolean), \n\t'data' (Mixed), \n\t'method' (Sring), \n\t'success' (Function), \n\t'error' (Function), \n\t'headers' (Object), \n\t'cache' (Boolean)";
	if (!o) return help;
	var dataStr = '';
	o['async'] = o['async'] || true;
	o['method'] = String(o['method']).toUpperCase() || 'GET';
	o['headers'] = o['headers'] || {'Content-Type': 'application/x-www-form-urlencoded'};
	if (o['data'] && o['data'] !== null && typeof(o['data']) == 'object') {
		var i = 0;
		var v = '';
		for (var key in o['data']) {
			if (typeof(o['data'][key]) !== null && typeof(o['data'][key]) == 'object') {
				v = JSON.stringify(o['data'][key]);
			} else {
				v = String(o['data'][key]);
			}
			dataStr += ((i > 0) ? '&' : '' ) + key + '=' + v;
			i += 1;
		}
	}
	if (o['uri']) {
		// add datastring into uri if necesary
		var uri = o['uri'];
		var splitter = (uri.indexOf('?') > -1) ? '&' : '?' ;
		if (uri.charAt(uri['length'] - 1) == '&') {
			uri = uri.substr(1, uri['length'] - 2);
		};
		if (o['method'] == 'GET' && dataStr['length'] > 0) {
			uri += splitter + dataStr;
		}
		if (!o['cache']) {
			splitter = (uri.indexOf('?') > -1) ? '&' : '?' ;
			uri += splitter + String('_=' + Math.random() + Math.random() + Math.random()).replace(/\./g, '');
		}
		// initializing
		var xhrObject = this.local.getXhrObject();
		xhrObject['open'](o['method'], uri, o['async']);
		var xrwHeaderStr = 'X-Requested-With';
		var headers = o['headers'];
		if (typeof(headers[xrwHeaderStr]) == 'undefined') {
			headers[xrwHeaderStr] = 'XMLHttpRequest';
		};
		for (var rh in headers) {
			if (String(headers[rh])['length'] > 0) {
				xhrObject['setRequestHeader'](rh, headers[rh]);
			}
		};
		// callbacks
		xhrObject['onreadystatechange'] = function(){
			if(xhrObject['readyState'] == 4){
				var method = function () {};
				if(xhrObject['status'] == 200){
					if (o['success']) method = o['success'];
				} else {
					if (o['error']) method = o['error'];
				}
				method(
					xhrObject['responseText'],
					xhrObject['status'],
					xhrObject,
					xhrObject['getAllResponseHeaders']()
				);
			};
		};
		// sending
		if (dataStr && o['method'] == 'POST') {
			xhrObject['send'](dataStr);
		} else {
			xhrObject['send']();
		}
	}
};

// local static variables and objects
jDiet.local.getXhrObject = function () {};
jDiet.local.setUpXhrObject = function ()
{
	var constructors = [
		function(){return new XMLHttpRequest;},
		function(){return new ActiveXObject("Microsoft.XMLHTTP");},
		function(){return new ActiveXObject("Msxml2.XMLHTTP");}
	];
	var xhr;
	for(var i = 0; i < constructors['length']; i++){
		try{
			xhr = constructors[i]();
		}catch(e){};
		if (xhr) break;
	};
	this.getXhrObject = constructors[i];
};

// init call
jDiet.local.setUpXhrObject();

// include json2
if(!window.JSON){window.JSON=function(){function f(n){return n<10?'0'+n:n;}
Date.prototype.toJSON=function(){return this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z';};var m={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};function stringify(value,whitelist){var a,i,k,l,r=/["\\\x00-\x1f\x7f-\x9f]/g,v;switch(typeof value){case'string':return r.test(value)?'"'+value.replace(r,function(a){var c=m[a];if(c){return c;}
c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+
(c%16).toString(16);})+'"':'"'+value+'"';case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
if(typeof value.toJSON==='function'){return stringify(value.toJSON());}
a=[];if(typeof value.length==='number'&&!(value.propertyIsEnumerable('length'))){l=value.length;for(i=0;i<l;i+=1){a.push(stringify(value[i],whitelist)||'null');}
return'['+a.join(',')+']';}
if(whitelist){l=whitelist.length;for(i=0;i<l;i+=1){k=whitelist[i];if(typeof k==='string'){v=stringify(value[k],whitelist);if(v){a.push(stringify(k)+':'+v);}}}}else{for(k in value){if(typeof k==='string'){v=stringify(value[k],whitelist);if(v){a.push(stringify(k)+':'+v);}}}}
return'{'+a.join(',')+'}';}}
return{stringify:stringify,parse:function(text,filter){var j;function walk(k,v){var i,n;if(v&&typeof v==='object'){for(i in v){if(Object.prototype.hasOwnProperty.apply(v,[i])){n=walk(i,v[i]);if(n!==undefined){v[i]=n;}}}}
return filter(k,v);}
if(/^[\],:{}\s]*$/.test(text.replace(/\\./g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof filter==='function'?walk('',j):j;}
throw new SyntaxError('parseJSON');}};}();}