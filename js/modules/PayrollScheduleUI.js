class PayrollScheduleUI {
    constructor() {
        this.init();
    }

    init() {
        var context = this;
        $("input").focusout(function() {
            context.onfocusout(this);
        });
    }

    onfocusout(obj) {
        console.log("PayrollScheduleUI change "+obj);
    }

    onsaveChild(subModuleName) {
        console.log("PayrollScheduleUI onsaveChild "+subModuleName);
    }

    doSpecialAction(data) {
        console.log("PayrollScheduleUI doSpecialAction "+data);
        if (data == "chooseEmployees") {
            this.chooseEmployees();
        }
        else {
            var showModalAny = new ShowModalAny("Payroll", data);
            showModalAny.show();
        }
    }

    chooseEmployees() {
        console.log("PayrollScheduleUI chooseEmployees");
        var context = this;
        var recordId = $("input.mainId").val();
        var url = MAIN_URL+"/api/generic/specialaction/PayrollScheduleUI/getEmployees_"+recordId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            var str = `
                <table>
                    <thead style="display:block;">
                        <tr style="display:block;">
                            <th style="width: 150px;">Last Name</th>
                            <th style="width: 150px;">First Name</th>
                            <th style="width: 150px;">Include</th>
                        <tr>
                    </thead>
                    <tbody style="display:block; overflow:auto; height:300px;">
            `;
            $(data).each(function(ind, obj) {
                var id = obj.getProp("personId");
                var firstName = obj.getProp("firstName");
                var lastName = obj.getProp("lastName");
                str += `
                    <tr class="addToPayroll_${id}">
                        <td style="width: 150px;">${firstName}</td>
                        <td style="width: 150px;">${lastName}</td>
                        <td style="width: 150px;"><button class="btn btn-primary specialAction PayrollScheduleUI addToPayroll" value="${id}">Add to Payroll</button></td>
                    </tr>
                `;
            });
            str += "    </tbody>";
            str += "</table>";
            var showModalAny = new ShowModalAny500("Choose Employees", str, function() {
                console.log("Callback Called for Choose Employee");
                $(".addToPayroll").click(function() {
                    console.log("addToPayroll Click Called");
                    context.addToPayroll(this);
                });
            });
            showModalAny.show();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    addToPayroll(obj) {
        var context = this;
        var recordId = $("input.mainId").val();
        var code = $(obj).attr("value");
        var url = MAIN_URL+"/api/generic/specialaction/PayrollScheduleUI/addEmployee_"+recordId+"_"+code;
        console.log(url);
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $("tr.addToPayroll_"+code).hide();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }
}
