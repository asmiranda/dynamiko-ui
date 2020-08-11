var server = "service.dynamikosoft.com";
var MAIN_URL = `https://${server}:8888`;
var MAIN_SIGNAL_URL = `https://${server}:8888`;

var MOBILE_MAIN_URL = `https://10.0.2.2:8888`;
var MOBILE_MAIN_SIGNAL_URL = `wss://10.0.2.2:8888`;

var ANNOUNCEMENT_URL = "http://mobilewebui.dynamikosoft.com/"

var dynaRegister;

class Config {
    getDateFormat() {
        return 'yyyy-mm-dd';
    }
}

$(function () {
    config = new Config();
})