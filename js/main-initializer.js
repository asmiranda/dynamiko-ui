class MainInitializer {
    initialize() {
        console.log("Initializer")
        if (storage.getToken()) {
            leftMenu.init();
            uiService.initHome();
        }
        else {
            // window.location.href = "login.html";
        }
    }
}

$(function () {
    mainInitializer = new MainInitializer();
    mainInitializer.initialize();
})