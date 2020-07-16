class SchoolAbout {
    constructor() {

    }

    onReactMessage(receivedMessage) {
        console.log("receivedMessage", receivedMessage.key, receivedMessage.value)
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