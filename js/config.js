var server = "localhost";
var MAIN_URL = `http://${server}:5000`;
var MAIN_SIGNAL_URL = `http://${server}:5000`;

var MOBILE_MAIN_URL = `http://10.0.2.2:5000`;
var MOBILE_MAIN_SIGNAL_URL = `ws://10.0.2.2:5000`;

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