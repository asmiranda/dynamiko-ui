// var server = "dynamikosoft.com";
var server = window.location.hostname;
var MAIN_URL = `http://${server}:8888`;

var dynaRegister;

class Config {
    getDateFormat() {
        return 'yyyy-mm-dd';
    }
}

const config = new Config();
