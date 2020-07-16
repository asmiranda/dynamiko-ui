class SchoolAbout {
    constructor() {

    }

    onReactMessage(receivedMessage) {
        console.log("receivedMessage", receivedMessage.key, receivedMessage.value);
    }

    init() {
        var context = this;
        let postMessage = {};
        postMessage["key"] = "loaded";
        postMessage["value"] = "loaded";

        window.ReactNativeWebView.postMessage(JSON.stringify(postMessage));
        window.addEventListener("message", receivedMessage => { context.onReactMessage(receivedMessage) });
        // document.getElementById("callingMobile").innerHTML = "The javascript works?";
        // window.addEventListener("message", message => {
        //     document.getElementById("mobileResponse").innerHTML += `${message.data}`;
        // });
    }
}

$(function () {
    schoolAbout = new SchoolAbout();
})