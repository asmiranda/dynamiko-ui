var server = "localhost";
var MAIN_URL = `https://${server}:8888`;
var MAIN_SIGNAL_URL = `https://${server}:8888`;
var ANNOUNCEMENT_URL = "http://mobilewebui.dynamikosoft.com/"

var dynaRegister;

class Config {
    getDateFormat() {
        return 'yyyy-mm-dd';
    }
}

const config = new Config();

$(function () {
    if (utils.isLocal()) {
        if (utils.isAndroid()) {
            console.log("device is android...");
            server = "10.0.2.2";
            MAIN_URL = `http://${server}:8888`;
            MAIN_SIGNAL_URL = `http://${server}:8888`;
        }
        else {
            server = "localhost";
            MAIN_URL = `http://${server}:8888`;
            MAIN_SIGNAL_URL = `http://${server}:8888`;
        }
    }
})