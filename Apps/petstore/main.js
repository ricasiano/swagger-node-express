// ### Swagger Sample Application
// 
// This is a sample application which uses the [swagger-node-express](https://github.com/wordnik/swagger-node-express)
// module.  The application is organized in the following manner:
//
// #### petResources.js
// 
// All API methods for this petstore implementation live in this file and are added to the swagger middleware.
//
// #### models.js
//
// This contains all model definitions which are sent & received from the API methods. 
//
// #### petData.js
//
// This is the sample implementation which deals with data for this application

// Include express and swagger in the application.
var express = require("express")
  , url = require("url")
  , cors = require("cors")
  , swagger = require("../../Common/node/swagger.js");

//cors and swagger api configs
var defaultConfig = require("configs/defaults/");
//let's reuse the swagger config
var urlConfig = require("../../swagger-ui/mainconfig.js");

var myConfig = urlConfig.myconfig,
  swaggerKey = defaultConfig,
  corsSettings = defaultConfig.corsSettings;

var app = express();

// Enables CORS
var enableCORS = function(req, res, next) {
  //add config
  corsSettings.allowedCors.each(function(allowedSite){
    if (req.headers.origin === allowedSite)
      res.header('Access-Control-Allow-Origin',  allowedSite)
  });
  res.header('Access-Control-Allow-Methods', corsSettings.allowedMethods);
  res.header('Access-Control-Allow-Headers', corsSettings.allowedHeaders);
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};
//enable use of the libs
app.use(enableCORS);
app.use(express.json());
app.use(express.urlencoded());
app.use(cors(corsOptions));

// Set the main handler in swagger to the express app
swagger.setAppHandler(app);

//validate if client is allowed to access resource
swagger.addValidator(
  function validate(req, path, httpMethod) {
    var apiDefaultKey = swaggerKey;
    var apiKey = req.headers["api_key"];
    //assume non-authenticated access for docs and actual api
    if (!apiKey) {
      //get the key from query string instead of headers
      apiKey = url.parse(req.url,true).query["api_key"];
      //key found?
      if (apiKey !== undefined) {
        //create a custom header to allow actual requests
        if (apiDefaultKey == apiKey) {
          req.headers.apiauth = swaggerBackdoor;
          return true
        }
        else {
          return false
        }
      }
      //non-authenticated but has authorization headers sent
      else {

        if(req.headers.authorization)
          return true
      }
    }
  }
);

//all resources are included here
var petResources = require("./petResources.js");

//the model schema
var models = require("./models.js");

// Add models and methods to swagger
swagger.addModels(models)
  .addGet(petResources.findById)
  .addGet(petResources.findByTags)
  .addGet(petResources.findByStatus)
  .addPost(petResources.addPet)
  .addPut(petResources.updatePet)
  .addDelete(petResources.deletePet);

// set api info
swagger.setApiInfo({
  title: "Swagger Sample App",
  description: "This is a sample server Petstore server. You can find out more about Swagger at <a href=\"http://swagger.wordnik.com\">http://swagger.wordnik.com</a> or on irc.freenode.net, #swagger.  For this sample, you can use the api key \"special-key\" to test the authorization filters",
  termsOfServiceUrl: "http://helloreverb.com/terms/",
  contact: "apiteam@wordnik.com",
  license: "Apache 2.0",
  licenseUrl: "http://www.apache.org/licenses/LICENSE-2.0.html"
});

swagger.setAuthorizations({
  apiKey: {
    type: "apiKey",
    passAs: "header"
  }
});

// Configures the app's base path and api version.
swagger.configureSwaggerPaths("", "api-docs", "");
swagger.configure("http://"+myConfig.url+":"+myConfig.port, "1.0.0");

// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/../../swagger-ui/');
app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
  if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
    res.writeHead(302, { 'Location' : req.url + '/' });
    res.end();
    return;
  }
  // take off leading /docs so that connect locates file correctly
  req.url = req.url.substr('/docs'.length);
  return docs_handler(req, res, next);
});

// Start the server on port 8002
app.listen(myConfig.port);