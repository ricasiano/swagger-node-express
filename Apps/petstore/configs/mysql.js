//template for mysql connection, up to you if you'll be using connection pool
var mysql = function mysqlConnect(){
  return require('mysql').createConnection({
    host: 'hostname',
    user: 'user',
    password: 'password',
    database: 'database'
  });
};
module.exports.mysqlConnect = mysql;
