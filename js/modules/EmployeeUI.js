class EmployeeUI { 
    changeMainId(obj) {
        var moduleName = $(obj).attr("module");
        if (moduleName!="EmployeeUI") {
            return;
        }
        employeeUI.loadRecordToForm(obj, employeeUI);
        employeeUI.loadEmployeeSupervisor();
        employeeUI.loadTeamOrgData();
    }

    loadRecordToForm(obj, classToUse) {
        var moduleName = $(obj).attr("module");
        if (moduleName!="EmployeeUI") {
            return;
        }
        var selectedId = $(obj).attr("recordId");
        if (selectedId==null || selectedId=="" || selectedId==undefined) {
            selectedId = $(obj).val();
        }
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/findRecord/${moduleName}/${selectedId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            dynamikoCache.setLastRecordId(selectedId);
            employeeUI.loadEmployeeSupervisor();
            employeeUI.loadTeamOrgData();

            // utils.loadJsonToForm(mainForm, data);
            utils.loadJsonAddInfo(data);

            childTabs.reloadAllDisplayTabs();
            for (const [key, value] of dynaRegister.saasMap) {
                value.loadToForm(classToUse);
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



    changeSupervisor() {
        console.log("changeSupervisor called");
        console.log(quickUpdater.callbackObject);
        console.log(quickUpdater.callbackData);
        $(`.EmployeeUI_MyTeam[name="supervisorName"]`).html(quickUpdater.callbackData.recordTitle);
        $(`.EmployeeUI_MyTeam[name="supervisorDesignation"]`).html(quickUpdater.callbackData.getPropDefault("specialization", "Not Specified"));
    }

    loadEmployeeSupervisor() {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/EmployeeUI/getSupervisor/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            $(`.EmployeeUI_MyTeam[name="supervisorName"]`).html(data.getPropDefault("recordTitle", "Not Specified"));
            $(`.EmployeeUI_MyTeam[name="supervisorDesignation"]`).html(data.getPropDefault("specialization", "Not Specified"));
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTeamOrgData() {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/EmployeeUI/getTeamMembers/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            console.log(data);
            $(".EmployeeUI_MyTeamMembers").empty();
            $(data).each(function(index, obj) {
                var str = `
                    <div class="user-block col-md-5">
                        <img class="img-circle img-bordered-sm EmployeeUI_MyTeam" name="teamMemberProfile">
                        <span class="username">
                            <a href="#" class="EmployeeUI_MyTeamMember" name="fullName">${obj.getProp("firstName")} ${obj.getProp("lastName")}</a>
                            <i class="fa fa-fw fa-pencil quickUpdaterCallback" callback="employeeUI.changeTeamMember()" module="EmployeeUI" recordId="${obj.getProp("PersonId")}" fieldName="personCode"
                            updater="autoComplete"></i>
                        </span>
                        <span class="description EmployeeUI_MyTeamMember" name="specialization">${obj.getPropDefault("specialization", "Not Specified")}</span>
                    </div>   
                `;
                $(".EmployeeUI_MyTeamMembers").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }
}

