class SchoolAbout {
    constructor() {

    }

    init() {
        window.ReactNativeWebView.postMessage("Loaded");
        document.getElementById("callingMobile").innerHTML = "The javascript works?";
        window.addEventListener("message", message => {
            // alert(message.data);
            document.getElementById("mobileResponse").innerHTML += `${message.data}`;
        });
    }
}

$(function () {
    schoolAbout = new SchoolAbout();
})