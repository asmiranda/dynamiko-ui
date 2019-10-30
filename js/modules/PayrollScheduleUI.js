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
        if ("|basicPay|totalBasicPay|".includes("|"+obj.name)+"|") {
            this.calculateAmounts();
        }
    }

    calculateAmounts(index) {
        console.log("PayrollScheduleUI chooseEmployees");
        var context = this;
        var recordId = $("input.mainId").val();
        var url = MAIN_URL+"/api/generic/"+localStorage.companyCode+"/specialaction/PayrollScheduleUI/getPayroll/"+recordId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);

            var totalBasicPay = zeroNaN(data[0].getProp("basicPay"));
            var totalOtAmount = zeroNaN(data[0].getProp("totalOtAmount"));
            var totalBenefitAmount = zeroNaN(data[0].getProp("totalBenefitAmount"));
            var totalAdjustmentAmount = zeroNaN(data[0].getProp("totalAdjustmentAmount"));
            var totalTaxAmount = zeroNaN(data[0].getProp("totalTaxAmount"));
    
            var totalGrossAmount = zeroNaN(totalBasicPay+totalOtAmount+totalBenefitAmount+totalAdjustmentAmount+totalTaxAmount);
    
            $("input[mainmodule='PayrollSchedule'][name='totalBasicPay']").val(totalBasicPay);
            $("input[mainmodule='PayrollSchedule'][name='totalOtAmount']").val(totalOtAmount);
            $("input[mainmodule='PayrollSchedule'][name='totalBenefitAmount']").val(totalBenefitAmount);
            $("input[mainmodule='PayrollSchedule'][name='totalAdjustmentAmount']").val(totalAdjustmentAmount);
            $("input[mainmodule='PayrollSchedule'][name='totalGrossAmount']").val(totalGrossAmount);
            $("input[mainmodule='PayrollSchedule'][name='totalTaxAmount']").val(totalTaxAmount);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    onsaveChild(subModuleName) {
        console.log("PayrollScheduleUI saveChild "+subModuleName);
        this.calculateAmounts();
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
        var url = MAIN_URL+"/api/generic/"+localStorage.companyCode+"/specialaction/PayrollScheduleUI/getEmployees/"+recordId;
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
        var url = MAIN_URL+"/api/generic/"+localStorage.companyCode+"/specialaction/PayrollScheduleUI/addEmployee/"+recordId+"_"+code;
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
