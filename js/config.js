// var dynamikoPort = "8888";
// var roomSignalPort = "7788";

var server = "localhost";
var dynamikoPort = "8443";
var roomSignalPort = "4343";

var MAIN_URL = `https://${server}:${dynamikoPort}`;
var MAIN_SIGNAL_URL = `wss://${server}:${roomSignalPort}`;
var MAIN_SIGNAL_HTTP_URL = `https://${server}:${roomSignalPort}`;

// var server = "service.dynamikosoft.com";
// var dynamikoPort = "8443";
// var roomSignalPort = "4343";
// var MAIN_URL = `https://${server}:${dynamikoPort}`;
// var MAIN_SIGNAL_URL = `wss://${server}:${roomSignalPort}`;
// var MAIN_SIGNAL_HTTP_URL = `https://${server}:${roomSignalPort}`;

var dynaRegister;

class Config {
    getDateFormat() {
        return 'yyyy-mm-dd';
    }
}

$(function () {
    config = new Config();
})