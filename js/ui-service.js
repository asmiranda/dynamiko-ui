class UIService {
    constructor() {
        this.profileName;
        $(document).on('click', '.manageUserRoles', function () {
            uiService.manageUserRoles();
        });
        $(document).on('click', '.manageDepartment', function () {
            uiService.manageDepartment();
        });
        $(document).on('click', '.manageTaxCategory', function () {
            uiService.manageTaxCategory();
        });
        $(document).on('click', '.manageAccountChart', function () {
            uiService.manageAccountChart();
        });
        $(document).on('click', '.manageBenefit', function () {
            uiService.manageBenefit();
        });
        $(document).on('click', '.manageEmployee', function () {
            uiService.manageEmployee();
        });
        $(document).on('click', '.manageSupplier', function () {
            uiService.manageSupplier();
        });
        $(document).on('click', '.manageProduct', function () {
            uiService.manageProduct();
        });
        $(document).on('click', '.choiceCompany', function () {
            uiService.changeCompany($(this).attr("companyCode"), $(this).attr("companyName"));
        });
    }

    initHome() {
        // uiService.initCompany();
        uiService.initProfile();
    }

    manageEmployee() {
        uiService.loadUI('EmployeeUI');
    }

    manageSupplier() {
        uiService.loadUI('SupplierUI');
    }

    manageProduct() {
        uiService.loadUI('ProductUI');
    }

    manageUserRoles() {
        uiService.loadUI('UserUI');
    }

    manageDepartment() {
        uiService.loadUI('DepartmentUI');
    }

    manageTaxCategory() {
        uiService.loadUI('TaxCategoryUI');
    }

    manageAccountChart() {
        uiService.loadUI('AccountGroupUI');
    }

    manageBenefit() {
        uiService.loadUI('HrBenefitUI');
    }

    loadUI(myui) {
        var moduleName = myui;
        Storage.putLatestModule(moduleName);
        registerDatatable.clearRegister();

        constructMainForm.construct(moduleName);
    }

    initCompany() {
        var url = MAIN_URL + '/api/ui/' + sessionStorage.companyCode + '/company';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        $(".chooseCompanyList").empty();
        var successCallback = function (data) {
            console.log(data);
            $(data).each(function (index, obj) {
                var companyCode = obj.getProp("code");
                var companyName = obj.getProp("name");
                var str = `
                    <li>
                        <a href="#" class="choiceCompany" companyCode="${companyCode}" companyName="${companyName}">${companyName}</a>
                    </li>
                `;
                $(".chooseCompanyList").append(str);
                uiService.changeCompany(companyCode, companyName);
            });
            uiService.initLogo();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    changeCompany(companyCode, companyName) {
        sessionStorage.companyCode = companyCode;
        sessionStorage.companyName = companyName;
        var useCompanyStr = `
            <span style="padding-right: 15px;">${companyName}</span><i class="fa fa-bank"></i>
        `;
        $("#useCompany").empty();
        $("#useCompany").append(useCompanyStr);

        if (storage.getLatestModule()) {
            leftMenu.loadLatestUI();
        }
    }

    initLogo() {
        var url = MAIN_URL + '/api/ui/' + sessionStorage.companyCode + '/logo';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function (data) {
            console.log("logo ==");
            console.log(data);
            $(".logo").html(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    initProfile() {
        var url = MAIN_URL + '/api/ui/' + sessionStorage.companyCode + '/profile';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function (data) {
            console.log("profile ==");
            console.log(data);
            sessionStorage.uname = data.getProp("userName");
            sessionStorage.profileName = data.getProp("profileName");
            $(".profileName").html(sessionStorage.profileName);

            meetingLoader.loadMeetings();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }
}

class LeftMenu {
    constructor() {
        console.log("LEFT MENU CALLED WITH DASHBOARD...");
        $(document).on('click', '.leftDashboardItem', function () {
            dashboard.load(this);
        });
        $(document).on('click', '.leftMenuItem[report="true"]', function () {
            mainReport.constructMainReport(this);
        });
        $(document).on('click', '.leftMenuItem[report="false"]', function () {
            leftMenu.loadUI(this);
        });

        var url = MAIN_URL + '/api/generic/' + sessionStorage.companyCode + '/getLeftMenu';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function (data) {
            console.log("Left Menu Extracted");
            leftMenu.addDashboard(data);

            var menus = ["School", "Admin", "HR", "Accounting", "Procurement", "Production", "Supply Chain", "Marketing", "CRM", "Reference"];
            $.each(menus, function (i, obj) {
                leftMenu.addMenu(obj, data);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    };

    addMenu(menu, data) {
        var counter = 0;
        $.each(data, function (i, obj) {
            if (obj.getProp("group") == menu) {
                var menuId = menu.replace(/ /g, '')
                counter++;
                var str = `<li><a href="#" class="leftMenuItem ${obj.getProp("name")}" data="${obj.getProp("name")}" code="${obj.getProp("code")}" report="false"><i class="${obj.getProp("icon")}"></i> <span>${obj.getProp("label")}</span></a></li>`;
                $(".mysidemenu").append(str);
            }
        });
    }

    addDashboard(data) {
        $.each(data, function (i, obj) {
            if (obj.getProp("dashboard")) {
                $(".mysidemenu").append('<li><a href="#" class="leftDashboardItem" data="' + obj.getProp("name") + '"><i class="' + obj.getProp("icon") + '"></i> <span>' + obj.getProp("label") + '</span></a></li>');
            }
        });
    }

    loadUI(obj) {
        storage.putLatestModule($(obj).attr("data"));
        storage.putLatestModuleCode($(obj).attr("code"));
        leftMenu.loadLatestUI();
    }

    loadLatestUI() {
        registerDatatable.clearRegister();

        constructMainForm.construct(storage.getLatestModule(), storage.getLatestModuleCode());
    }
}

class ToggleForm {
    readOnly() {
        console.log("ToggleForm readOnly");
        setTimeout(
            function () {
                $('.displayEdit').each(function (index, obj) {
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

class RegisterDatatable {
    register(datatable) {
        console.log("register");
        if (datatable) {
            console.log("register datatable");
            allTable.push(datatable);
            console.log("length : " + allTable.length);
        }
    }

    clearRegister() {
        console.log("clearRegister");
        $.each(allTable, function (index, obj) {
            console.log(index);
            console.log(obj);
            try {
                $(obj).destroy();
            }
            catch (err) {
                console.log(err);
            }
        });
        allTable = [];
    }
}

class UICache {
    getUIHtml(uiName) {
        var storedHTML = sStorage.get(uiName + "-HTML");
        return storedHTML;
    }

    setUIHtml(uiName, uiHtml) {
        sStorage.set(uiName + "-HTML", uiHtml);
    }
}

class SearchCache {
    initSearchCache() {
        var allCache = sStorage.get("allCache");
        if (allCache == "true") {
            return;
        }
        else {
            sStorage.set("allCache", "true");
            var url = MAIN_URL + '/api/clientcache/all/search';
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            var successCallback = function (data) {
                console.log(data);

                $.each(data, function (index, obj) {
                    var uiName = obj.getProp("key");
                    var clientCache = obj.getProp("value");

                    searchCache.setCacheConfig(uiName, clientCache);
                });
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
        }
    }

    setCacheConfig(uiName, clientCache) {
        sStorage.set(uiName + "-SearchCache", clientCache);
    }

    getSearchCache(uiName, uri) {
        searchCache.initSearchCache();
        var searchData = "";
        var canCache = sStorage.get(uiName + "-SearchCache");
        if (canCache == "true") {
            searchData = sStorage.get(uri);
        }
        return searchData;
    }

    setNewSearchCache(uiName, uri, searchData) {
        searchCache.initSearchCache();
        var canCache = sStorage.get(uiName + "-SearchCache");
        if (canCache == "true") {
            sStorage.set(uri, searchData);
        }
    }
}

$(function () {
    uiService = new UIService();
    leftMenu = new LeftMenu();
    toggleForm = new ToggleForm();
    registerDatatable = new RegisterDatatable();
    uiCache = new UICache();
    searchCache = new SearchCache();
})