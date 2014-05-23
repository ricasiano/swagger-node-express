//define which sites are allowed to consume the resources
var corsSettings = {};
var allowedCors = [];
allowedCors.push('http://yoursitehere.com');
allowedCors.push('http://yourothersitehere.com');

corsSettings['allowedCors'] = allowedCors;
//cors settings
corsSettings['allowedMethods'] = 'GET,PUT,POST,DELETE,OPTIONS';
corsSettings['allowedHeaders'] = 'Content-Type, Authorization, Content-Length, X-Requested-With';

//swagger api keys
var swaggerKeys = {};
//this will let you access the api-docs section(http://yourapisite/api-docs)
swaggerKeys['apiKey'] = 'ap1f0rl33t';

module.exports.corsSettings = corsSettings;
module.exports.swaggerKeys = swaggerKeys;