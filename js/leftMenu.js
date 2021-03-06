class LeftMenu {
    init() {
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

        var url = MAIN_URL + '/api/generic/getLeftMenu';
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
        storage.setModule($(obj).attr("data"));
        storage.setModuleCode($(obj).attr("code"));

        $(registeredModules).each(function (index, data) {
            var areEqual = data.toUpperCase() == storage.getModule().toUpperCase();
            if (areEqual) {
                var objEval = `${data}.loadUI()`;
                eval(objEval);
            }
        });
    }

    loadLatestUI() {
        // registerDatatable.clearRegister();
        constructMainForm.construct(storage.getModule(), storage.getModuleCode());
    }
}

$(function () {
    leftMenu = new LeftMenu();
})