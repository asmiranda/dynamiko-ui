$(function () {
    mainForm = '#mainForm';
    mainSearchForm = '#searchTable';
    mainId = 'input.mainId';
    QUICK_UPDATER_COUNTER=0;

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
    config = new Config();
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

    constructMainForm = new ConstructMainForm();
    searchTable = new SearchTable();
    formControlButton = new FormControlButton();
    formRule = new FormRule();
    profilePicLoader = new ProfilePicLoader();
    customReport = new CustomReport();
    dataVisualizer = new DataVisualizer();
    widgetChartRule = new WidgetChartRule();
    fieldConstructor = new FieldConstructor();
    fieldMultiSelect = new FieldMultiSelect();
    formLinker = new FormLinker();
    userUI = new UserUI();
    myReportViewer = new MyReportViewer();
    quickUpdater = new QuickUpdater();   
    dynaRegister = new DynaRegister();
    uploadDataFile = new UploadDataFile();
    utils = new Utils();

    // #################for saas and modules
    reviewCenter = new ReviewCenter();

    purchaseOrderUI = new PurchaseOrderUI();
    salesOrderUI = new SalesOrderUI();

    // #####################Initializers
    mainInitializer = new MainInitializer();
    mainInitializer.initialize();

    globalEvents = new GlobalEvents();
    globalEvents.initializeGlobalEvents();

    dynaRegister.registerSaas("ReviewCenter", reviewCenter);
});
