var server = "localhost";
// var server = "ip-198-12-255-40.ip.secureserver.net";

var MAIN_URL = `https://${server}:8443`;
var MAIN_SIGNAL_URL = `wss://${server}:4343`;
var MAIN_SIGNAL_HTTP_URL = `https://${server}:4343`;

var TOKEN;
var USERNAME;
var PROFILENAME;
var dynaRegister; 

class Config {
    getDateFormat() {
        return 'yyyy-mm-dd';
    }
}
