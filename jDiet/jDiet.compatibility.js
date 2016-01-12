// jQuery popular function "attr" with variable count of arguments, variable types of arguments and variable types of results,
// which causes no JIT - just in time compilation in modern browsers, but developers still allways use this fn in their plugins...
jDiet['prototype']['attr'] = function ()
{
	var args = [].slice.apply(arguments);
	if (typeof(args[0]) == 'object' && args['length'] === 1) {
		// multiple setter
		return this['setAttr'](args[0]);
	} else if (typeof(args[0]) == 'string' && args['length'] === 2) {
		// single setter
		var o = {};
		o[args[0]] = args[1];
		return this['setAttr'](o);
	} else if (typeof(args[0]) == 'string') {
		// getter
		return this['getAttr'](args[0]);
	}
};
// jQuery popular function "css" with variable count of arguments, variable types of arguments and variable types of results,
// which causes no also JIT, but also, developers still allways use this fn in their plugins, stupid...
jDiet['prototype']['css'] = function ()
{
	var args = [].slice.apply(arguments);
	if (typeof(args[0]) == 'object' && args['length'] === 1) {
		// multiple setter
		return this['setCss'](args[0]);
	} else if (typeof(args[0]) == 'string' && args['length'] === 2) {
		// single setter
		var o = {};
		o[args[0]] = args[1];
		return this['setCss'](o);
	} else if (typeof(args[0]) == 'string') {
		// getter
		return this['getCss'](args[0]);
	}
};
//jQuery popular function $(document).ready(handler) alias for $(document).bind("ready",handler):
jDiet['prototype']['ready'] = function (handler)
{
	if (!handler) return;
	this.eachCall(function(){
		if (typeof(this) == 'object' && this['nodeName'] == '#document') {
			jDiet['domReady']['add'](handler);
		}
	});
	return this;
};