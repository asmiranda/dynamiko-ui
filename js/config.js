var server = "dynamikosoft.com";
var MAIN_URL = `https://${server}:8888`;
var MAIN_SIGNAL_URL = `https://${server}:8888`;
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