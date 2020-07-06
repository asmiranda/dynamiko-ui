class MainInitializer {
    initialize() {
        uiService.initHome();
    }
} 

$(function() {
    mainInitializer = new MainInitializer();
    mainInitializer.initialize();
})