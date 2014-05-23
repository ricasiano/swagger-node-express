/**
 *
 * Authentication Module, check if this particular endpoint needs token authentication
 *
 *
 */

var mysqlConn = require('../configs/mysql.js').mysqlConnect();
var authenticator = function validate(authHeader, apiauth, callback){
  var authorizations =  authHeader.split(" ");
  var apiClientId = authorizations[1];
  var apiToken = authorizations[2];
  //no authentication headers found, request coming from swagger
  if (authHeader === undefined && apiauth === '1001') {
    callback(200, apiClientId)
  }
  else {
    if(authHeader !== undefined && apiauth === undefined) {
      var query = "SELECT * FROM `users` " +
        "WHERE `id` = '" + apiClientId + "' " +
        "AND `token` LIKE '" + apiToken + "' " +
        "AND `active` = 1 " +
        "AND `deleted` = 0";
      mysqlConn.query(query, apiClientId, function(err, rows) {
        //db error
        if (err) {
          callback(403, apiClientId)
        }
        else {
          //token validation successful
          if (rows.length > 0) {
            callback(200, apiClientId);
          }
          else {
            //token validation failed
            callback(403, apiClientId);
          }
        }
      })
    }
    else {
      callback(403, apiClientId)
    }
  }
};
module.exports.headerAuth = authenticator;