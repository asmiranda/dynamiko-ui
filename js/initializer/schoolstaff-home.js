class SchoolStaffHome extends FacultyHome {
    initListeners() {
        super.initListeners();
        let context = this;
        $(document).on('change', '#selectAllFacultyModule', function () {
            context.changeModule(this);
        });
    }

    changeModule(obj) {
        let code = $(obj).val();
        storage.setModuleCode(code);
        this.loadModuleDetail(code);
        this.loadActivities(code);
        this.loadStudents(code);
    }

    loadFacultyModule() {
        let key = "allFacultyModules";
        let context = this;
        let cache_data = storage.get(key);
        if (cache_data) {
            context.arrangeFacultyModules(cache_data);
        }
        else {
            let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/SchoolUI/getAllFacultyModules`;
            let ajaxRequestDTO = new AjaxRequestDTO(url, "");
            let successFunction = function (data) {
                storage.set(key, data);
                context.arrangeFacultyModules(data);
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
        }
    }

    arrangeFacultyModules(data) {
        console.log(data);
        $("#selectAllFacultyModule").empty();
        $(data).each(function (index, obj) {
            let code = obj.getPropDefault("code", "--");
            let email = obj.getPropDefault("email", "--");
            let firstName = obj.getPropDefault("firstName", "--");
            let lastName = obj.getPropDefault("lastName", "--");
            let subjectCode = obj.getPropDefault("subjectCode", "--");
            let startTime = obj.getPropDefault("startTime", "--");
            let endTime = obj.getPropDefault("endTime", "--");
            storage.setModuleCode(code);
            storage.set(code, obj);
            let str = `
                <option value="${code}">${lastName}, ${firstName} [${subjectCode} - ${startTime} to ${endTime} ]</option>
            `;
            $("#selectAllFacultyModule").append(str);
        });
        this.loadModuleDetail(storage.getModuleCode());
        this.loadActivities(storage.getModuleCode());
        this.loadStudents(storage.getModuleCode());
    }

    init() {
        this.saveMode = false;
        this.webinarMode = false;
        this.initListeners();
        if (storage.getToken() && storage.getToken().length > 20) {
            $("#welcome").show();

            this.loadProfile();
            this.loadFacultyModule();
        }
        else {
            $("#welcome").hide();
        }
    }

}


$(function () {
    studentHome = new SchoolStaffHome();
})