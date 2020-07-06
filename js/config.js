var server = "localhost";
var MAIN_URL = `http://${server}:8888`;
var MAIN_SIGNAL_URL = `ws://${server}:7788`;
var MAIN_SIGNAL_HTTP_URL = `http://${server}:7788`;

// var server = "service.dynamikosoft.com";
// var MAIN_URL = `https://${server}:8443`;
// var MAIN_SIGNAL_URL = `wss://${server}:4343`;
// var MAIN_SIGNAL_HTTP_URL = `https://${server}:4343`;

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