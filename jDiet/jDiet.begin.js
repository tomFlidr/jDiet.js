// base function init
jDiet = function () {
	var args = [].slice.apply(arguments);
	if (typeof(jDiet.local.makeResult) == 'undefined') {
		this['length'] = 0;
		return this;
	} else if (typeof(args[0]) == 'string' && args[0].substr(0, 1) == '<' && args[0].substr(args[0]['length'] - 1, 1) == '>') {
		// create html nodes
		return jDiet.local.createElm.apply(
			this,
			args
		);
	} else if (typeof(args[0]) == 'string' && (typeof(args[1]) == 'undefined' || typeof(args[1]) == 'string' || typeof(args[1]) == 'object')) {
		// select elements by selector
		jDiet.local.makeResult.apply(
			this,
			jDiet.local.getElementsBySelectorsAndContext.apply(
				jDiet.local,
				args
			)
		);
	} else if (typeof(args[0]) == 'object' && (typeof(args[0]['nodeType']) != 'undefined' || typeof(args[0]['frames']) != 'undefined')) {
		// return result by given html object or window object
		jDiet.local.makeResult.call(
			this,
			[args[0]],
			args[0]
		);
	}
};

// if you want to debug - set here any debug function call
jDiet['DEBUG'] = false;

// local static variables and objects
jDiet.local = {};