class EmployeeUI { 
    changeMainId(obj) {
        utils.loadRecordToForm(obj, employeeUI);
        employeeUI.loadEmployeeSupervisor();
        employeeUI.loadTeamOrgData();
    }

    doMainSearchData(evt) {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/EmployeeUI/quickMainSearcher/${localStorage.filterText}`;
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
                    <a href="#" class="loadRecordToForm" module="EmployeeUI" recordid="${recordId}" style="font-weight: bold;">${firstName} ${lastName}</a>
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
        employeeUI.init();
        employeeUI.loadEmployeeSupervisor();
        employeeUI.loadTeamOrgData();
    }

    init() {
        $("#dynamikoMainSearch").hide();
    }

    removeSupervisor(obj) {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/EmployeeUI/removeSupervisor/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            employeeUI.supervisorWriter(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    removeTeamMember(obj) {
        var recordId = $(mainId).val();
        var teamMemberId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/EmployeeUI/removeTeamMember/${recordId}/${teamMemberId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            console.log(data);
            employeeUI.teamMembersWriter(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    changeSupervisor() {
        console.log("changeSupervisor called");
        console.log(quickUpdater.callbackObject);
        console.log(quickUpdater.callbackData);
        $(`.EmployeeUI_MyTeam[name="supervisorName"]`).html(quickUpdater.callbackData.recordTitle);
        $(`.EmployeeUI_MyTeam[name="supervisorDesignation"]`).html(quickUpdater.callbackData.getPropDefault("specialization", "Not Specified"));
        var src = `${MAIN_URL}/api/generic/${localStorage.companyCode}/profilePic/EmployeeUI/${quickUpdater.callbackData.getPropDefault("PersonId", "0")}`
        $(`.EmployeeUI_MyTeam[name="supervisorProfile"]`).attr("src", src);        
    }

    loadEmployeeSupervisor() {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/EmployeeUI/getSupervisor/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            employeeUI.supervisorWriter(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTeamOrgData() {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/EmployeeUI/getTeamMembers/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            console.log(data);
            employeeUI.teamMembersWriter(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    supervisorWriter(data) {
        $(`.EmployeeUI_MyTeam[name="supervisorName"]`).html(data.getPropDefault("recordTitle", "Not Specified"));
        $(`.EmployeeUI_MyTeam[name="supervisorDesignation"]`).html(data.getPropDefault("specialization", "Not Specified"));
        var src = `${MAIN_URL}/api/generic/${localStorage.companyCode}/profilePic/EmployeeUI/${data.getPropDefault("PersonId", "0")}`
        $(`.EmployeeUI_MyTeam[name="supervisorProfile"]`).attr("src", src);        
    }
    teamMembersWriter(data) {
        $(".EmployeeUI_MyTeamMembersBox").empty();
        $(data).each(function(index, obj) {
            var src = `${MAIN_URL}/api/generic/${localStorage.companyCode}/profilePic/EmployeeUI/${data.getPropDefault("PersonId", "0")}`

            var str = `
                <div class="user-block EmployeeUI_MyTeamMemberBox">
                    <img class="img-circle img-bordered-sm EmployeeUI_MyTeam" name="teamMemberProfile" src="${src}">
                    <span class="username">
                        <a href="#" class="EmployeeUI_MyTeamMember" name="fullName">${obj.getProp("firstName")} ${obj.getProp("lastName")}</a>
                        <i class="fa fa-fw fa-remove pull-right hand btnRemoveTeamMember" title="Remove Team Member" module="EmployeeUI" recordId="${obj.getProp("PersonId")}"></i>
                        <i class="fa fa-fw fa-pencil pull-right hand quickUpdaterCallback" title="Change Member" callback="employeeUI.changeTeamMember()" module="EmployeeUI" recordId="${obj.getProp("PersonId")}" fieldName="removeTeamMemberCode" updater="autoComplete"></i>
                    </span>
                    <span class="description EmployeeUI_MyTeamMember" name="specialization">${obj.getPropDefault("specialization", "Not Specified")}</span>
                </div>   
            `;
            $(".EmployeeUI_MyTeamMembersBox").append(str);
        });
    }
}

