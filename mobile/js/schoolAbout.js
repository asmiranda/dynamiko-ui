class SchoolAbout {
    constructor() {

    }

    onReactMessage(receivedMessage) {
        document.getElementById("objectRequest").innerHTML = receivedMessage;
        document.getElementById("stringify").innerHTML = JSON.stringify(receivedMessage);
        document.getElementById("callingMobile").innerHTML = receivedMessage.key;
        document.getElementById("mobileResponse").innerHTML = receivedMessage.value;
    }

    init() {
        let context = this;
        window.ReactNativeWebView.postMessage("loaded");
        // window.addEventListener("message", receivedMessage => { context.onReactMessage(receivedMessage) });

        if (navigator.appVersion.includes('Android')) {
            document.addEventListener("message", function (data) {
                alert("you are in android OS " + data);
            });
        }
        else {
            window.addEventListener("message", function (data) {
                alert("you are in android OS " + data);
            });
        }
    }
}

$(function () {
    schoolAbout = new SchoolAbout();
})