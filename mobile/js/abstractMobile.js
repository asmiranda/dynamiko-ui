class AbstractMobile {
    init() {
        let context = this;
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage("Loaded");
            window.addEventListener("message", message => {
                context.onReactMessage(message.data);
            });
        }
        else {
            var user = utils.getUrlParamValue(window.location.href, "user");
            // alert(`User == ${user}`);

            loginJS.testLogin(user, function () {
                MOBILE_MAIN_URL = MAIN_URL;
                MOBILE_MAIN_SIGNAL_URL = MAIN_SIGNAL_URL;
                MOBILE_MAIN_SIGNAL_HTTP_URL = MAIN_SIGNAL_HTTP_URL;
                context.onReactMessage(sessionStorage.token);
            });
        }
    }
}