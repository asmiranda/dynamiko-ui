// var server = "dynamikosoft.com";
var server = window.location.hostname;
var port = window.location.port;
var servicePort = port + 1000;
var MAIN_URL = `https://${server}:${servicePort}`;
// if (server == "localhost" || server == "10.0.2.2") {
//     MAIN_URL = `http://${server}:${servicePort}`;
// }

var dynaRegister;

class Config {
    getDateFormat() {
        return 'yyyy-mm-dd';
    }
}

const config = new Config();
