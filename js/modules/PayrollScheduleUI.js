class PayrollScheduleUI {
    onfocusout(obj) {
        console.log("PayrollScheduleUI change "+obj);
        if ("|basicPay|totalBasicPay|".includes("|"+obj.name)+"|") {
            this.calculateAmounts();
        }
    }

    calculateAmounts(index) {
        console.log("PayrollScheduleUI chooseEmployees");
        var recordId = $(mainId).val();
        var url = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/specialaction/PayrollScheduleUI/getPayroll/"+recordId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);

            var totalBasicPay = zeroNaN(data[0].getProp("basicPay"));
            var totalOtAmount = zeroNaN(data[0].getProp("totalOtAmount"));

            var benefit01 = zeroNaN(data[0].getProp("benefitAmount01"));
            var benefit02 = zeroNaN(data[0].getProp("benefitAmount02"));
            var benefit03 = zeroNaN(data[0].getProp("benefitAmount03"));
            var benefit04 = zeroNaN(data[0].getProp("benefitAmount04"));
            var benefit05 = zeroNaN(data[0].getProp("benefitAmount05"));
            var benefit06 = zeroNaN(data[0].getProp("benefitAmount06"));
            var benefit07 = zeroNaN(data[0].getProp("benefitAmount07"));
            var benefit08 = zeroNaN(data[0].getProp("benefitAmount08"));
            var benefit09 = zeroNaN(data[0].getProp("benefitAmount09"));
            var benefit10 = zeroNaN(data[0].getProp("benefitAmount10"));

            var totalBenefitAmount = zeroNaN(benefit01+benefit02+benefit03+benefit04+benefit05+benefit06+benefit07+benefit08+benefit09+benefit10);
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
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
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
            showModalAny.show("Payroll", data);
        }
    }

    chooseEmployees() {
        console.log("PayrollScheduleUI chooseEmployees");
        var recordId = $(mainId).val();
        var url = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/specialaction/PayrollScheduleUI/getEmployees/"+recordId;
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
            showModalAny500.show("Choose Employees", str, function() {
                console.log("Callback Called for Choose Employee");
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    addToPayroll(obj) {
        var recordId = $(mainId).val();
        var code = $(obj).attr("value");
        var url = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/specialaction/PayrollScheduleUI/addEmployee/"+recordId+"_"+code;
        console.log(url);
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $("tr.addToPayroll_"+code).hide();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }
}
