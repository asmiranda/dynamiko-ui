class EmployeeUI { 
    loadRecordToForm(obj) {
        var moduleName = $(obj).attr("module");
        if (moduleName!="EmployeeUI") {
            return;
        }
        var selectedId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/findRecord/${moduleName}/${selectedId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            dynamikoCache.setLastRecordId(selectedId);
            utils.loadJsonToForm(mainForm, data);
            utils.loadJsonAddInfo(data);

            childTabs.reloadAllDisplayTabs();
            for (const [key, value] of dynaRegister.saasMap) {
                value.loadToForm(employeeUI);
            }
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    doMainSearchData(evt) {
        var moduleName = evt.detail.text();
        if (moduleName!="EmployeeUI") {
            return;
        }
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${moduleName}/quickMainSearcher/${localStorage.filterText}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(".quickMainSearcherResult").empty();
            $(data).each(function(index, obj) {
                var recordId = obj.getPropDefault("id", "0");
                var lastName = obj.getPropDefault("lastName", "");
                var firstName = obj.getPropDefault("firstName", "");
                var contact = obj.getPropDefault("contact", "");
                var email = obj.getPropDefault("email", "");

                var str = `
                    <a href="#" class="loadRecordToForm" module="${moduleName}" recordid="${recordId}" style="font-weight: bold;">${firstName} ${lastName}</a>
                    <p class="text-muted">
                        <i class="fa fa-phone margin-r-5"></i>: ${contact}<br/>
                        <i class="fa fa-envelope margin-r-5"></i>: ${email}
                    </p>
                    <hr>
                `
                $(".quickMainSearcherResult").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback); 
    }

    changeModule(evt) {
        var moduleName = evt.detail.text();
        if (moduleName=="EmployeeUI") {
        }
    }
}

