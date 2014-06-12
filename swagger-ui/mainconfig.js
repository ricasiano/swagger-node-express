var config = {};
config.url = 'localhost';
config.port = 1337;


try{
  if(typeof(module) !== 'undefined') {
    module.exports.myconfig = config;
  }
}catch(e){

}