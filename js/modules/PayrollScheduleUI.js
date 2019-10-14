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
        var url = MAIN_URL+"/api/generic/specialaction/PayrollScheduleUI/getEmployees";
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
                    <tr>
                        <td style="width: 150px;">${firstName}</td>
                        <td style="width: 150px;">${lastName}</td>
                        <td style="width: 150px;"><button class="btn btn-primary specialAction PayrollScheduleUI addToPayroll" value="${id}">Add to Payroll</button></td>
                    </tr>
                `;
            });
            str += "    </tbody>";
            str += "</table>";
            var showModalAny = new ShowModalAny500("Choose Employees", str);
            showModalAny.show();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }
}
