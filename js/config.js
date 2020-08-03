var server = "localhost";
var MAIN_URL = `https://${server}:8778`;
var MAIN_SIGNAL_URL = `https://${server}:8778`;

var MOBILE_MAIN_URL = `https://10.0.2.2:8778`;
var MOBILE_MAIN_SIGNAL_URL = `wss://10.0.2.2:8778`;

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