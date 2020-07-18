var MAIN_URL = `http://10.0.2.2:8888`;
var MAIN_SIGNAL_URL = `ws://10.0.2.2:7788`;
var MAIN_SIGNAL_HTTP_URL = `http://10.0.2.2:7788`;

// var MAIN_URL = `https://service.dynamikosoft.com:8443`;
// var MAIN_SIGNAL_URL = `wss://service.dynamikosoft.com:4343`;
// var MAIN_SIGNAL_HTTP_URL = `https://service.dynamikosoft.com:4343`;

var TOKEN;
var USERNAME;
var PROFILENAME;
var dynaRegister; 

class Config {
    getDateFormat() {
        return 'yyyy-mm-dd';
    }
}

$(function() {
    config = new Config();
})
