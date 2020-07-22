var server = "service.dynamikosoft.com";
var MAIN_URL = `https://${server}:8443`;
var MAIN_SIGNAL_URL = `wss://${server}:4343`;
var MAIN_SIGNAL_HTTP_URL = `https://${server}:8443`;

var MOBILE_MAIN_URL = `https://${server}:8443`;
var MOBILE_MAIN_SIGNAL_URL = `wss://${server}:4343`;
var MOBILE_MAIN_SIGNAL_HTTP_URL = `https://${server}:4343`;

var dynaRegister;

class Config {
    getDateFormat() {
        return 'yyyy-mm-dd';
    }
}

$(function () {
    config = new Config();
})
