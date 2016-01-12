// return static app with base event method to return proto app
jdw = function () {
	return new jDiet(arguments[0], arguments[1]);
};
for (var j in jDiet) {
	jdw[j] = jDiet[j];
}
