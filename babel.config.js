module.exports = function(api) {
	api.cache(false);

	const plugins = ['babel-plugin-macros'];

	const definitions = {
		SOME_VALUE: 2,
		'process.env.NODE_ENV': 'development'
	};

	if (process.env.USE_FULL_DEFINE) {
		plugins.push(['babel-plugin-transform-define', definitions]);
	} else if (process.env.USE_DEFINE) {
		plugins.push(['./src/plugin/3_1-plugin-transform-defined.js', definitions]);
	}
	return {
		// presets: ['@babel/env'],
		plugins
	};
};
