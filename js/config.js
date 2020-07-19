// var dynamikoPort = "8888";
// var roomSignalPort = "7788";

var server = "localhost";
var dynamikoPort = "8443";
var roomSignalPort = "4343";

var MAIN_URL = `https://${server}:${dynamikoPort}`;
var MAIN_SIGNAL_URL = `wss://${server}:${roomSignalPort}`;
var MAIN_SIGNAL_HTTP_URL = `https://${server}:${roomSignalPort}`;

// var server = "service.dynamikosoft.com";
// var dynamikoPort = "8443";
// var roomSignalPort = "4343";
// var MAIN_URL = `https://${server}:${dynamikoPort}`;
// var MAIN_SIGNAL_URL = `wss://${server}:${roomSignalPort}`;
// var MAIN_SIGNAL_HTTP_URL = `https://${server}:${roomSignalPort}`;

var TOKEN;
var USERNAME;
var PROFILENAME;
var dynaRegister;

var USER;
var PERSON;
var ROLES;

class Config {
    getDateFormat() {
        return 'yyyy-mm-dd';
    }

    loadProfile(token) {
        sessionStorage.token = token;
        // alert(`loadProfile token = ${sessionStorage.token}`);
        let url = `${MAIN_URL}/api/auth/getProfile`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");
        let successFunction = function (data) {
            // alert(`loadProfile success = ${data}`);
            sessionStorage.companyCode = data.getPropDefault("companyCode", "--");
            // alert(`loadProfile companyCode = ${sessionStorage.companyCode}`);
            USER = data.getPropDefault("user", "--");
            PERSON = data.getPropDefault("person", "--");
            ROLES = data.getPropDefault("roles", "--");
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }
}

$(function () {
    config = new Config();
})