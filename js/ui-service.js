class UIService {
    initHome() {
        uiService.initCompany();
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
        localStorage.latestModule = moduleName;
        registerDatatable.clearRegister();
    
        constructMainForm.construct(moduleName);
    }    

    initCompany() {
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

        if (localStorage.latestModule) {
            leftMenu.loadLatestUI();
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
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
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
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }
}

class LeftMenu {
    constructor() {
        console.log("LEFT MENU CALLED WITH DASHBOARD...");

        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/getLeftMenu';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Left Menu Extracted");
            leftMenu.addDashboard(data);
            
            var menus = ["School", "Admin", "HR", "Accounting", "Procurement", "Production", "Supply Chain", "Marketing", "CRM", "Reference"];
            $.each(menus, function(i, obj) {
                leftMenu.addMenu(obj, data);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
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

    loadUI(obj) {
        localStorage.latestModule = $(obj).attr("data");
        leftMenu.loadLatestUI();
    }    

    loadLatestUI() {
        registerDatatable.clearRegister();
    
        constructMainForm.construct(localStorage.latestModule);
    }    
}

class ToggleForm {
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

class RegisterDatatable {
    register(datatable) {
        console.log("register");
        if (datatable) {
            console.log("register datatable");
            allTable.push(datatable);
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
    getUIHtml(uiName) {
        var storedHTML = sStorage.get(uiName+"-HTML");
        return storedHTML;
    }

    setUIHtml(uiName, uiHtml) {
        sStorage.set(uiName+"-HTML", uiHtml);
    }
}

class SearchCache {
    initSearchCache() {
        var allCache = sStorage.get("allCache");
        if (allCache=="true") {
            return;
        }
        else {
            sStorage.set("allCache", "true");
            var url = MAIN_URL + '/api/clientcache/all/search';
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            var successCallback = function(data) {
                console.log(data);
        
                $.each(data, function(index, obj) {
                    var uiName = obj.getProp("key");
                    var clientCache = obj.getProp("value");
    
                    searchCache.setCacheConfig(uiName, clientCache);
                });
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
        }
    }

    setCacheConfig(uiName, clientCache) {
        sStorage.set(uiName+"-SearchCache", clientCache);
    }

    getSearchCache(uiName, uri) {
        searchCache.initSearchCache();
        var searchData = "";
        var canCache = sStorage.get(uiName+"-SearchCache");
        if (canCache=="true") {
            searchData = sStorage.get(uri);
        }
        return searchData;
    }

    setNewSearchCache(uiName, uri, searchData) {
        searchCache.initSearchCache();
        var canCache = sStorage.get(uiName+"-SearchCache");
        if (canCache=="true") {
            sStorage.set(uri, searchData);
        }
    }
}
