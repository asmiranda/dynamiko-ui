var server = "localhost";
var MAIN_URL = `https://${server}/service`;
var MAIN_SIGNAL_URL = `https://${server}:service`;
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