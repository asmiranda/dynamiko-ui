$(function () {
    mainForm = '#mainForm';
    mainSearchForm = '#searchTable';
    mainId = 'input.mainId';

    lStorage = {
        set: function (key, value) {
            window.localStorage.setItem( key, JSON.stringify(value) );
        },
        get: function (key) {
            try {
                return JSON.parse( window.localStorage.getItem(key) );
            } catch (e) {
                return null;
            }
        }
    };
    sStorage = {
        set: function (key, value) {
            window.sessionStorage.setItem( key, JSON.stringify(value) );
        },
        get: function (key) {
            try {
                return JSON.parse( window.sessionStorage.getItem(key) );
            } catch (e) {
                return null; 
            }
        }
    };

    allTable = [];
    uiService = new UIService();
    leftMenu = new LeftMenu();
    fileUpload = new FileUpload();
    toggleForm = new ToggleForm();
    registerDatatable = new RegisterDatatable();
    uiCache = new UICache();
    searchCache = new SearchCache();
    dynaAutoComplete = new DynaAutoComplete();
    dynaButtonAction = new DynaButtonAction();
    childFieldConstructor = new ChildFieldConstructor();
    childFieldAutoComplete = new ChildFieldAutoComplete();
    childTabs = new ChildTabs();

    mainInitializer = new MainInitializer();
    mainInitializer.initialize();

    globalEvents = new GlobalEvents();
    globalEvents.initializeGlobalEvents();
});
