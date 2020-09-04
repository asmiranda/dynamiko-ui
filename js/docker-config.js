var server = window.location.hostname;
var MAIN_URL = `https://${server}:8888`;

var dynaRegister;

class Config {
    getDateFormat() {
        return 'yyyy-mm-dd';
    }
}

$(function () {
    config = new Config();
})