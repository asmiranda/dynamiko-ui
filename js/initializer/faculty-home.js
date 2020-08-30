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
    }

    btnScreenSharing() {
        console.log("btnScreenSharing");
    }
}


$(function () {
    studentHome = new FacultyHome();
})