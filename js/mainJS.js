class UIService {
    constructor() {
    }
    
    initHome() {
        $(window).keydown(function(event){
            if(event.keyCode == 13) {
              event.preventDefault();
              return false;
            }
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

        var context = this;
        this.initCompany();
        this.initProfile();

        $(".btnSignOut").click(function() {
            window.location.href = "login.html";
        });
        $(".manageUserRoles").click(function() {
            context.manageUserRoles();
        });
        $(".manageDepartment").click(function() {
            context.manageDepartment();
        });
        $(".manageTaxCategory").click(function() {
            context.manageTaxCategory();
        });
        $(".manageAccountChart").click(function() {
            context.manageAccountChart();
        });
        $(".manageBenefit").click(function() {
            context.manageBenefit();
        });
        $(".manageEmployee").click(function() {
            context.manageEmployee();
        });
        $(".manageSupplier").click(function() {
            context.manageSupplier();
        });
        $(".manageProduct").click(function() {
            context.manageProduct();
        });
    }

    manageEmployee() {
        this.loadUI('EmployeeUI');
    }

    manageSupplier() {
        this.loadUI('SupplierUI');
    }

    manageProduct() {
        this.loadUI('ProductUI');
    }

    manageUserRoles() {
        this.loadUI('UserUI');
    }

    manageDepartment() {
        this.loadUI('DepartmentUI');
    }

    manageTaxCategory() {
        this.loadUI('TaxCategoryUI');
    }

    manageAccountChart() {
        this.loadUI('AccountGroupUI');
    }

    manageBenefit() {
        this.loadUI('HrBenefitUI');
    }

    loadUI(myui) {
        var moduleName = myui;
        localStorage.latestModule = moduleName;
    
        var registerDatatable = new RegisterDatatable();
        registerDatatable.clearRegister();
    
        constructMainForm.construct(moduleName, '#searchTable[module="'+moduleName+'"]', '#mainForm[module="'+moduleName+'"]');
    
        var fileUpload = new FileUpload();
        fileUpload.initUpload();
    }    

    initCompany() {
        var context = this;
        var url = MAIN_URL + '/api/ui/any/company';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        $(".chooseCompanyList").empty();
        var successCallback = function(data) {
            console.log(data);
            $(data).each(function(index, obj) {
                var companyCode = obj.getProp("code");
                var companyName = obj.getProp("name");
                var str = `
                    <li>
                        <a href="#" class="choiceCompany" companyCode="${companyCode}" companyName="${companyName}">${companyName}</a>
                    </li>
                `;
                $(".chooseCompanyList").append(str);
                context.changeCompany(companyCode, companyName);
            });
            context.initLogo();

            var leftMenu = new LeftMenu();
            leftMenu.init();
    
            var dataVisualizer = new DataVisualizer();
            dataVisualizer.init();
    
            var reportViewer = new MyReportViewer();
            reportViewer.init();
    
            var uploadDataFile = new UploadDataFile();
            uploadDataFile.init();

            $(".choiceCompany").click(function() {
                context.changeCompany($(this).attr("companyCode"), $(this).attr("companyName"));
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    changeCompany(companyCode, companyName) {
        sessionStorage.companyCode = companyCode;
        sessionStorage.companyName = companyName;
        var useCompanyStr = `
            <span style="padding-right: 15px;">${companyName}</span><i class="fa fa-bank"></i>
        `;
        $("#useCompany").empty();
        $("#useCompany").append(useCompanyStr);

        if (localStorage.latestModule) {
            var leftMenu = new LeftMenu();
            leftMenu.loadUI(localStorage.latestModule);
        }
    }

    initLogo() {
        var url = MAIN_URL + '/api/ui/'+sessionStorage.companyCode+'/logo';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("logo ==");
            console.log(data);
            $(".logo").html(data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    initProfile() {
        var url = MAIN_URL + '/api/ui/any/profile';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("profile ==");
            console.log(data);
            USERNAME = data.getProp("userName");
            $(".profileName").html(data.getProp("profileName"));
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }
}

class LeftMenu {
    constructor() {
    }

    init() {
        var context = this;
        console.log("LEFT MENU CALLED WITH DASHBOARD...");

        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/getLeftMenu';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Left Menu Extracted");
//            console.log(data);
            context.addDashboard(data);
            
            var menus = ["School", "Admin", "HR", "Accounting", "Procurement", "Production", "Supply Chain", "Marketing", "CRM", "Reference"];
            $.each(menus, function(i, obj) {
                context.addMenu(obj, data);
            });
            context.initialize();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    };

    addMenu(menu, data) {
        var counter = 0;
        $.each(data, function(i, obj) {
            if (obj.getProp("group")==menu) {
                var menuId = menu.replace(/ /g,'')
                counter++;
                $(".mysidemenu").append('<li><a href="#" class="leftMenuItem '+obj.getProp("name")+'" data="'+obj.getProp("name")+'" report="false"><i class="'+obj.getProp("icon")+'"></i> <span>'+obj.getProp("label")+'</span></a></li>');
            }
        });
    }

    addDashboard(data) {
        $.each(data, function(i, obj) {
            if (obj.getProp("dashboard")) {
                $(".mysidemenu").append('<li><a href="#" class="leftDashboardItem" data="'+obj.getProp("name")+'"><i class="'+obj.getProp("icon")+'"></i> <span>'+obj.getProp("label")+'</span></a></li>');
            }
        });
    }

    initialize() {
        var context = this;
        $(".leftDashboardItem").click(function() {
            console.log("leftDashboardItem CALLED...");
            var moduleName = $(this).attr("data");
            console.log("moduleName == "+moduleName);
            var dashboard = new Dashboard();
            dashboard.load(moduleName);
        });
        $(".leftMenuItem[report='true']").click(function() {
            var moduleName = $(this).attr("data");
            var constructReport = new MainReport(moduleName);
            constructReport.construct();
        });
        $(".leftMenuItem[report='false']").click(function() {
            var moduleName = $(this).attr("data");
            context.loadUI(moduleName);
        });
    }

    loadUI(myui) {
        var moduleName = myui;
        localStorage.latestModule = moduleName;
    
        var registerDatatable = new RegisterDatatable();
        registerDatatable.clearRegister();
    
        constructMainForm.construct(moduleName, '#searchTable[module="'+moduleName+'"]', '#mainForm[module="'+moduleName+'"]');
    
        var fileUpload = new FileUpload();
        fileUpload.initUpload();
    }    
}

class FileUpload {
    initUpload() {
        console.log("File Upload initUpload Called");
        setTimeout(
            function() {
                $('#fileUpload').change(function(){
                    console.log("File Upload Change Called");
                    //on change event
                    var formData = new FormData();
                    if($(this).prop('files').length > 0) {
                        var file = $(this).prop('files')[0];
                        console.log("Received File");
                        console.log(file);
                        formData.append("music", file);
                    }
                });
            }, 500
        );

    }
}

class ToggleForm {
    constructor() {
    }

    readOnly() {
        console.log("ToggleForm readOnly");
        setTimeout(
            function() {
                $('.displayEdit').each(function(index, obj){
                    console.log(index);
//                    $(obj).addClass("displayMode");
                    if ($(obj).is("span")) {
                        $(obj).css("display", "none")
                    }
                    else if ($(obj).is("textarea")) {
                        $(obj).css("border", "none")
                        $(obj).css("overflow", "hidden")
                    }
                    else {
                        $(obj).css("border", "none")
                    }
                });
            }, 50
        );
    }
}

var allTable = [];

class RegisterDatatable {
    constructor(datatable) {
        console.log("constructor");
        this.datatable = datatable;
    }

    register() {
        console.log("register");
        if (this.datatable) {
            console.log("register datatable");
            allTable.push(this.datatable);
            console.log("length : "+allTable.length);
        }
    }

    clearRegister() {
        console.log("clearRegister");
        $.each(allTable, function(index, obj) {
            console.log(index);
            console.log(obj);
            try {
                $(obj).destroy();
            }
            catch(err) {
                console.log(err);
            }
        });
        allTable = [];
    }
}

class UICache {
    constructor() {
    }

    getUIHtml(uiName) {
        var storedHTML = sStorage.get(uiName+"-HTML");
        return storedHTML;
    }

    setUIHtml(uiName, uiHtml) {
        sStorage.set(uiName+"-HTML", uiHtml);
    }
}

class SearchCache {
    constructor() {
    }

    initSearchCache() {
        var context = this;
        var url = MAIN_URL + '/api/clientcache/all/search';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
    
            $.each(data, function(index, obj) {
                var uiName = obj.getProp("key");
                var clientCache = obj.getProp("value");

                context.setCacheConfig(uiName, clientCache);
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    setCacheConfig(uiName, clientCache) {
        sStorage.set(uiName+"-SearchCache", clientCache);
    }

    getSearchCache(uiName, uri) {
        var searchData = "";
        var canCache = sStorage.get(uiName+"-SearchCache");
        if (canCache=="true") {
            searchData = sStorage.get(uri);
        }
        return searchData;
    }

    setNewSearchCache(uiName, uri, searchData) {
        var canCache = sStorage.get(uiName+"-SearchCache");
        if (canCache=="true") {
            sStorage.set(uri, searchData);
        }
    }
}
