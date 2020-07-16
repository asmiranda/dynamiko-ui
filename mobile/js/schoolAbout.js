class SchoolAbout {
    constructor() {

    }

    onReactMessage(data) {
        document.getElementById("mobileResponse").innerHTML = data;
    }

    init() {
        let context = this;
        window.ReactNativeWebView.postMessage("Loaded");

        window.addEventListener("message", message => {
            context.onReactMessage(message.data);
        });
    }
}

$(function () {
    schoolAbout = new SchoolAbout();
})