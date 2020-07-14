var server = "service.dynamikosoft.com";
var dynamikoPort = "8443";
var roomSignalPort = "4343";
var MAIN_URL = `https://${server}:${dynamikoPort}`;
var MAIN_SIGNAL_URL = `wss://${server}:${roomSignalPort}`;
var MAIN_SIGNAL_HTTP_URL = `https://${server}:${roomSignalPort}`;

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