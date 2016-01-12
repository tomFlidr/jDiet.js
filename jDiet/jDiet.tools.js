// public static methods
jDiet['isset'] = function (object, indexesStr) {
	var result = true;
	var arr = [object];
	var iterator = 0;
	if (typeof(indexesStr) == 'string') {
		var indexes = indexesStr.split('.');
	}
	this.test = this.test || function (val) {
		return (typeof(val) != 'undefined' && val !== null) ? true : false ;
	}
	if (this.test(object)) {
		if (typeof(indexesStr) != 'string') {
			return this.test(object[indexesStr]);
		}
		for (var i = 0, l = indexes.length; i < l; i += 1) {
			arr[iterator + 1] = arr[iterator][indexes[i]];
			if (!this.test(arr[iterator + 1])) {
				result = false;
			}
			iterator += 1;
		}
	} else {
		result = false;
	};
	return result;
};
jDiet['typeOf'] = function (o) {
	return String(Object['prototype']['toString']['apply'](o))['toLowerCase']()['replace']('[object ','')['replace'](']','');
};
jDiet['clone'] = function (o) {
	return jDiet.local.objectClone(o);
};

// local static variables and objects
jDiet.local.objectClone = function(obj1){
	var obj2;
	if(jDiet['typeOf'](obj1)=='array'){
		obj2 = jDiet.local.arrayClone(obj1)
	}else{
		if(typeof(obj1) == 'object'){
			if(!obj1){
				obj2 = null
			}else{
				obj2 = {};
				for(var i in obj1){
					var val = obj1[i];
					if(typeof(val) == 'object'){
						obj2[i] = arguments.callee(val)
					}else{
						obj2[i] = val
					}
				}
			}
		}else{
			obj2 = obj1
		}
	}
	return obj2
};
jDiet.local.arrayClone = function(obj1){
	var obj2;
	if(jDiet['typeOf'](obj1)=='object'){
		obj2 = jDiet.local.objectClone(obj1)
	}else{
		if(typeof(obj1) == 'object'){
			obj2 = [];
			for(var i in obj1){
				var val = obj1[i];
				if(typeof(val) == 'object'){
					if(!val){
						obj2[i] = null
					}else{
						obj2[i] = arguments.callee(val)
					}
				}else{
					obj2[i] = val
				}
			}
		}else{
			obj2 = obj1
		}
	}
	return obj2
};