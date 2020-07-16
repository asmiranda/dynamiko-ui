class SchoolAbout {
    constructor() {

    }

    onReactMessage(data) {
        document.getElementById("mobileResponse").innerHTML = data;
    }

    init() {
        let context = this;
        let request = new MobileRequestDTO("Loaded", "");
        window.ReactNativeWebView.postMessage(JSON.stringify(request));

        window.addEventListener("message", message => {
            context.onReactMessage(message.data);
        });
    }
}

$(function () {
    schoolAbout = new SchoolAbout();
})