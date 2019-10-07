class MyLinksWidget {
    constructor() {
    }

    init() {
        var context = this;
        console.log("MyLinksWidget");

        $(".myLink.attendance").click(function () {
            context.showAttendance();
        });
        $(".myLink.payslip").click(function () {
            context.showPayslip();
        });
        $(".myLink.holiday").click(function () {
            context.showHoliday();
        });
        // $(".myLink.travel").click(function() {
        //     context.showTravel();
        // });
        // $(".myLink.projects").click(function() {
        //     context.showProjects();
        // });
        // $(".myLink.training").click(function() {
        //     context.showTraining();
        // });
        // $(".myLink.accounting").click(function() {
        //     context.showAccounting();
        // });
        // $(".myLink.helpdesk").click(function() {
        //     context.showHelpdesk();
        // });
    }

    showAttendance() {
        var context = this;
        var url = MAIN_URL + '/api/generic/widget/MyLinksWidget/attendance';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function (data) {
            console.log(data);
            $("#MyLinksBody").empty();
            var str = `
            <table class="table table-hover">
                <tbody id="myLast30Attendance">
                    <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Total Hours</th>
                    </tr>
                </tbody>
            </table>
            `;
            $("#MyLinksBody").append(str);
            $(data).each(function (index, obj) {
                console.log(obj);
                var workDate = obj.getProp("workDate");
                var attendanceType = obj.getProp("attendanceType");
                var totalHours = obj.getProp("totalHours");

                var trStr = `
                <tr>
                    <td>${workDate}</td>
                    <td>${attendanceType}</td>
                    <td>${totalHours}</td>
                </tr>
                `;
                $("#myLast30Attendance").append(trStr);
            });
            $("#myLinksModalLabel").html("My Last 30 Attendance");
            $('#myLinksModal').modal();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    showPayslip() {
        var context = this;
        var myframe = "myPayslipFrame";
        $("#MyLinksBody").empty();
        var str = `<iframe id="${myframe}" src="${url}" style="width: 100%; height: 100%"></iframe>`;
        $("#MyLinksBody").append(str);

        var url = MAIN_URL + '/api/generic/widget/MyLinksWidget/payslip';
        var ajax = new AjaxBytesLoader();
        ajax.load(url, myframe, function(data_url) {
            document.querySelector('#myPayslipFrame').src = data_url;
            $('#myLinksModal').modal();
        });
    }

    showHoliday() {
        var context = this;
    }

    // showAttendance() {
    //     var context = this;
    // }

    // showTravel() {
    //     var context = this;
    // }

    // showProjects() {
    //     var context = this;
    // }

    // showTraining() {
    //     var context = this;
    // }

    // showAccounting() {
    //     var context = this;
    // }

    // showHelpdesk() {
    //     var context = this;
    // }
}

