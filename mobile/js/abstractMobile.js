class AbstractMobile {
    init() {
        let context = this;
        if (window.ReactNativeWebView) {
            MAIN_URL = MOBILE_MAIN_URL;
            MAIN_SIGNAL_URL = MOBILE_MAIN_SIGNAL_URL;
            MAIN_SIGNAL_HTTP_URL = MOBILE_MAIN_SIGNAL_HTTP_URL;

            window.ReactNativeWebView.postMessage("Loaded");
            window.addEventListener("message", message => {
                if (message.data) {
                    context.onReactMessageWithLogin(message.data);
                }
                else {
                    context.onReactMessageWithNoLogin(message.data);
                }
            });
        }
        else {
            var user = utils.getUrlParamValue(window.location.href, "user");
            // alert(`User == ${user}`);
            if (user && user != '') {
                loginJS.testLogin(user, function () {
                    context.onReactMessageWithLogin(storage.getToken());
                });
            }
            else {
                context.onReactMessageWithNoLogin(storage.getToken());
            }
        }
    }
}