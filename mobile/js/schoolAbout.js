class SchoolAbout {
    constructor() {

    }

    onReactMessage(receivedMessage) {
        document.getElementById("objectRequest").innerHTML = receivedMessage;
        document.getElementById("callingMobile").innerHTML = receivedMessage.key;
        document.getElementById("mobileResponse").innerHTML = receivedMessage.value;
    }

    init() {
        var context = this;
        window.ReactNativeWebView.postMessage("loaded");
        window.addEventListener("message", receivedMessage => { context.onReactMessage(receivedMessage) });
    }
}

$(function () {
    schoolAbout = new SchoolAbout();
})