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
        // employeeUI.loadEmployeeSupervisor();
        // employeeUI.loadTeamOrgData();

        personTaskUI.loadTodoList();
        employeeUI.loadOnLeaves();
        employeeUI.loadNewHires();

        employeeUI.loadTopEmployees();
    }

    init() {
        $("#dynamikoMainSearch").hide();
    }

    loadEmployeeProfile(obj) {
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/EmployeeUI/getEmployeeProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            var applicantName = data.getProp("firstName")+" "+data.getProp("lastName");
            var job = data.getProp("specialization");
            var email = data.getProp("email");
            var contact = data.getProp("contact");

            $(".EmployeeUI_EmployeeName").html(applicantName);    
            $(".EmployeeUI_Employee_Job").html(job);    
            $(".EmployeeUI_Employee_Email").html(email);    
            $(".EmployeeUI_Employee_Contact").html(contact);   
            $(".EmployeeUI_ProfilePic").attr("src", `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/EmployeeUI/${recordId}`);   
            $(".EmployeeUI_ProfilePic").attr("recordId", recordId);   
            $(".EmployeeUI_ProfilePic").show();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    selectEmployee(obj) {
        // var recordId = $(obj).attr("recordId");
        var tabName = $(obj).attr("tabName");
        console.log(tabName);

        if (tabName=="dashboard") {
            employeeTimeSheetUI.loadTimeSheet(obj);
            employeeTeamMemberUI.loadTeamMembers(obj);
        }
    }

    searchEmployeeFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/EmployeeUI/filterEmployee/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            employeeUI.arrangeSearchedEmployees(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTopEmployees() {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/EmployeeUI/getTopEmployees`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            employeeUI.arrangeSearchedEmployees(data, "dashboard");
            employeeUI.arrangeSearchedEmployees(data, "profile");
            employeeUI.arrangeSearchedEmployees(data, "finance");
            employeeUI.arrangeSearchedEmployees(data, "performance");
            employeeUI.arrangeSearchedEmployees(data, "RecruitersAndManagers");            
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedEmployees(data, tabName) {
        console.log(data);
        var divName = `.searchEmployees[module="EmployeeUI"][tabName="${tabName}"]`;
        $(divName).empty();
        $(data).each(function(index, obj) {
            var employeeName = obj.getProp("firstName")+" "+obj.getProp("lastName");
            var email = obj.getPropDefault("email", "");
            var recordId = obj.getProp("id");
            var str = `
                <a href="#" class="employeeSelect" module="EmployeeUI" tabName="${tabName}" recordId="${recordId}" style="font-weight: bolder;">${employeeName}</a>
                <span class="text-muted">
                    ${email}
                </span>
                <hr>
            `;
            $(divName).append(str);
            
        });
    }
    loadOnLeaves() {

    }
    loadNewHires() {

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
        var src = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/EmployeeUI/${quickUpdater.callbackData.getPropDefault("PersonId", "0")}`
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
        var src = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/EmployeeUI/${data.getPropDefault("PersonId", "0")}`
        $(`.EmployeeUI_MyTeam[name="supervisorProfile"]`).attr("src", src);        
    }
    teamMembersWriter(data) {
        $(".EmployeeUI_MyTeamMembersBox").empty();
        $(data).each(function(index, obj) {
            var src = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/EmployeeUI/${data.getPropDefault("PersonId", "0")}`

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

