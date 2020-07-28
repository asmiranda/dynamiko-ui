class MainInitializer {
    initialize() {
        if (localStorage.token) {
            leftMenu.init();
            uiService.initHome();
        }
        else {
            window.location.href = "login.html";
        }
    }
}

$(function () {
    mainInitializer = new MainInitializer();
    mainInitializer.initialize();
})