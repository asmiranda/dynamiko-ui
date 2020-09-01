class FacultyHome extends StudentHome {
    initListeners() {
        super.initListeners();
        let context = this;
        $(document).on('click', '.btnUploadPDF', function () {
            context.btnUploadPDF();
        });
        $(document).on('click', '.btnStartWebinar', function () {
            context.btnStartWebinar();
        });
        $(document).on('click', '.btnScreenSharing', function () {
            context.btnScreenSharing();
        });
        $(document).on('click', '.btnUploadFile', function () {
            context.btnUploadFile(this);
        });
        $(document).on('click', '.btnRemoveDailyReading', function () {
            context.btnRemoveDailyReading(this);
        });
        $(document).on('click', '.btnAddActivity', function () {
            context.btnAddActivity(this);
        });
        $(document).on('click', '.btnEditActivity', function () {
            context.btnEditActivity(this);
        });
        $(document).on('click', '.btnDeleteActivity', function () {
            context.btnDeleteActivity(this);
        });
        $(document).on('click', '.btnNewActivity', function () {
            context.btnNewActivity(this);
        });
        $(document).on('click', '.btnSaveActivity', function () {
            context.btnSaveActivity(this);
        });
        $(document).on('click', '.btnEditActivity', function () {
            context.btnEditActivity(this);
        });
        $(document).on('click', '.btnDeleteActivity', function () {
            context.btnDeleteActivity(this);
        });
    }

    btnNewActivity() {
        let scheduleCode = storage.get("scheduleCode");
        $(".selectedActivityCodeDisplay").attr("code", scheduleCode);
        $(".selectedActivityCodeDisplay").html("");
        $(`#selectedActivityCode`).val("");
        $(`#selectActivityType`).val("Quiz");
        $(`#activityText`).val("");
    }

    btnSaveActivity() {
        let context = this;
        let scheduleCode = storage.get("scheduleCode");
        let taskCode = $(`#selectedActivityCode`).val();
        let taskType = $(`#selectActivityType`).val();
        let taskDetail = $(`#activityText`).val();

        var tmp = {};
        tmp["scheduleCode"] = scheduleCode;
        tmp["taskCode"] = taskCode;
        tmp["type"] = taskType;
        tmp["detail"] = taskDetail;
        var vdata = JSON.stringify(tmp);

        let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/SchoolUI/saveActivity/${scheduleCode}`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        let successFunction = function (data) {
            console.log(data);
            context.arrangeActivities(data);
            alert("Activity Saved!");
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successFunction);
    }

    btnEditActivity(obj) {
        let activityCode = $(obj).attr("code");
        let taskType = $(`.taskType[code="${activityCode}"]`).html();
        let taskDetail = $(`.taskDetail[code="${activityCode}"]`).html();

        $("#selectedActivityCode").val(activityCode);
        $(".selectedActivityCodeDisplay").html(`Editing - ${activityCode}`);
        $("#selectActivityType").val(taskType);
        $("#activityText").val(taskDetail.trim());
    }

    btnDeleteActivity(obj) {
        let context = this;
        let scheduleCode = storage.get("scheduleCode");
        let activityCode = $(obj).attr("code");
        let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/SchoolUI/removeActivity/${scheduleCode}/${activityCode}`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");
        let successFunction = function (data) {
            console.log(data);
            context.arrangeActivities(data);
            alert("Selected Activity Removed!");
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeActivities(data) {
        $("#ActivityList").empty();
        $(data).each(function (index, obj) {
            let code = obj.getPropDefault("code", "");
            let SchoolScheduleTaskId = obj.getPropDefault("SchoolScheduleTaskId", "");
            let startDate = obj.getPropDefault("taskDate", "");
            let endDate = obj.getPropDefault("endDate", "");
            let taskType = obj.getPropDefault("taskType", "");
            let detail = obj.getPropDefault("detail", "");
            let str = `
                <li>
                    <div class="timeline-item">
                        <span class="pull-right" style="margin: 10px; margin-right: 30px;">
                            <i class="fas fa-edit btnEditActivity" style="color: green;" code="${code}"></i> 
                            <i class="fas fa-trash btnDeleteActivity" style="margin-left: 10px; color: red;" code="${code}"></i> 
                        </span>
                        <h3 class="timeline-header"><a href="#" class="taskType" code="${code}">${taskType}</a></h3>
                        <div class="timeline-body taskDetail" code="${code}">
                            ${detail}
                        </div>
                    </div>
                </li>
            `;
            $("#ActivityList").append(str);
        });
    }

    btnRemoveDailyReading() {
        console.log("btnRemoveDailyReading");
        let scheduleCode = storage.get("scheduleCode");
        let url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/widget/SchoolUI/removeDailyReading/${scheduleCode}`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");
        let successFunction = function (data) {
            console.log(data);
            alert("Daily Reading Removed!");
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    btnUploadFile() {
        console.log("btnUploadFile");
        let scheduleCode = storage.get("scheduleCode");

        var data = new FormData();
        var file = $('input#pdfFile').prop('files')[0];
        if (file.name.endsWith(".pdf")) {
            console.log("Received File");
            console.log(file.name);
            data.append("file", file);

            let successFunction = function (data) {
                alert(data);
                console.log(data);
            };
            ajaxCaller.uploadFile(successFunction, "SchoolUI", scheduleCode, "pdf", data);
        }
        else {
            alert("Please select a PDF file.");
        }
    }

    btnUploadPDF() {
        console.log("btnUploadPDF");
        $(`#activities`).hide();
        $(`#studentList`).hide();
        $(`#myModules`).hide();
        $(`#dailyRead`).hide();
        $(`#chatScreen`).hide();

        $(`#uploadScreen`).show();
    }

    btnStartWebinar() {
        console.log("btnStartWebinar");
        if (this.webinarMode) {
            socketIOP2P.loadWebinar();
            this.webinarMode = false;
        }
        else {
            var r = confirm("Start webinar mode?");
            if (r) {
                socketIOP2P.unloadWebinar();
            }
            this.webinarMode = true;
        }
    }

    btnScreenSharing() {
        console.log("btnScreenSharing");
    }
}


$(function () {
    studentHome = new FacultyHome();
})