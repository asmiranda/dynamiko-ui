var server = "localhost";
var MAIN_URL = `https://${server}:8443`;
var MAIN_SIGNAL_URL = `wss://${server}:4343`;
var MAIN_SIGNAL_HTTP_URL = `https://${server}:8443`;

var MOBILE_MAIN_URL = `http://10.0.2.2:8888`;
var MOBILE_MAIN_SIGNAL_URL = `ws://10.0.2.2:7788`;
var MOBILE_MAIN_SIGNAL_HTTP_URL = `http://10.0.2.2:7788`;

var dynaRegister;

class Config {
    getDateFormat() {
        return 'yyyy-mm-dd';
    }
}

$(function () {
    config = new Config();
})