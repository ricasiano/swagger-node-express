//define which sites are allowed to consume the resources
var corsSettings = {};
var allowedCors = ['http://127.0.0.1'];

corsSettings.allowedCors = allowedCors;

//cors settings
corsSettings['allowedMethods'] = 'GET,PUT,POST,DELETE,OPTIONS';
corsSettings['allowedHeaders'] = 'Content-Type, Authorization, Content-Length, X-Requested-With';

//swagger api key, to allow access in api-docs section
var swaggerKey = 'ap1f0rl33t';


module.exports.corsSettings = corsSettings;
module.exports.swaggerKey = swaggerKey;