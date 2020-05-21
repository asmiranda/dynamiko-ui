$(function () {
    mainForm = '#mainForm';
    mainSearchForm = '#searchTable';
    mainId = 'input.mainId';
    QUICK_UPDATER_COUNTER=0;

    Object.defineProperty(Object.prototype, "getPropDefault", {
        value: function (prop, val) {
            var retVal = val;
            var key,self = this;
            if (Object.keys(self).length > 0) {
                for (key in self) {
                    if (key.toLowerCase() == prop.toLowerCase()) {
                        retVal = self[key];
                        break;
                    }
                }
            }    
            return retVal;
        },
        //this keeps jquery happy
        enumerable: false
    });
    
    Object.defineProperty(Object.prototype, "getProp", {
        value: function (prop) {
            var key,self = this;
            for (key in self) {
                if (key.toLowerCase() == prop.toLowerCase()) {
                    return self[key];
                }
            }
        },
        //this keeps jquery happy
        enumerable: false
    });

    Object.defineProperty(Object.prototype, "setProp", {
        value: function (prop, val) {
            var key,self = this;
            var found = false;
            if (Object.keys(self).length > 0) {
                for (key in self) {
                    if (key.toLowerCase() == prop.toLowerCase()) {
                        //set existing property
                        found = true;
                        self[key] = val;
                        break;
                    }
                }
            }
    
            if (!found) {
                //if the property was not found, create it
                self[prop] = val;
            }
    
            return val;
        },
        //this keeps jquery happy
        enumerable: false
    });
    
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
    dynamikoFullScreen = new DynamikoFullScreen();
    uiService = new UIService();
    leftMenu = new LeftMenu();
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
    fieldGenerator = new FieldGenerator();
    fieldConstructor = new FieldConstructor();
    fieldMultiSelect = new FieldMultiSelect();
    formLinker = new FormLinker();
    userUI = new UserUI();
    myReportViewer = new MyReportViewer();
    quickUpdater = new QuickUpdater();   
    quickSearcher = new QuickSearcher();   
    dynaRegister = new DynaRegister();
    uploadDataFile = new UploadDataFile();
    utils = new Utils();
    dashboard = new Dashboard();
    mainReport = new MainReport();
    dynamikoCache = new DynamikoCache();

    // #################for saas and modules
    personalDashboardUI = new PersonalDashboardUI();
    recruitmentUI = new RecruitmentUI();
    employeeUI = new EmployeeUI();
    payrollUI = new PayrollUI();
    governmentUI = new GovernmentUI();
    schoolUI = new SchoolUI();
    reviewCenterUI = new ReviewCenterUI();
    hospitalUI = new HospitalUI();
    inventoryUI = new InventoryUI();
    referenceUI = new ReferenceUI();
    reportUI = new ReportUI();

    // #################for sub modules
    purchaseOrderUI = new PurchaseOrderUI();
    payrollScheduleUI = new PayrollScheduleUI();
    hrRequisitionUI = new HrRequisitionUI();
    personTaskUI = new PersonTaskUI();
    employeeTimeSheetUI = new EmployeeTimeSheetUI();
    employeeTeamMemberUI = new EmployeeTeamMemberUI();
    productUI = new ProductUI();
    supplierUI = new SupplierUI();
    accountChartUI = new AccountChartUI();
    expenseUI = new ExpenseUI();
    taxPeriodUI = new TaxPeriodUI();
    // bankingUI = new BankingUI();
    reconcileUI = new ReconcileUI();
    productRequestUI = new ProductRequestUI();
    realEstateUI = new RealEstateUI();
    citizenUI = new CitizenUI();
    communityTaxCertificateUI = new CommunityTaxCertificateUI();
    businessPermitUI = new BusinessPermitUI();
    governmentCashierUI = new GovernmentCashierUI();
    governmentAccountingUI = new GovernmentAccountingUI();
    governmentReportsUI = new GovernmentReportsUI();
    governmentPrintingUI = new GovernmentPrintingUI();
    realEstateTaxUI = new RealEstateTaxUI();
    realEstateTransferUI = new RealEstateTransferUI();
    realEstateBuildingPermitUI = new RealEstateBuildingPermitUI();
    realEstateElectricalPermitUI = new RealEstateElectricalPermitUI();
    realEstatePlumbingPermitUI = new RealEstatePlumbingPermitUI();

    // #####################Initializers
    mainInitializer = new MainInitializer();
    mainInitializer.initialize();

    globalEvents = new GlobalEvents();
    globalEvents.initializeGlobalEvents();
});
