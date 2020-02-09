class PayrollObj {
    constructor() {
        this.payrollName;
        this.startDate;
        this.endDate;
        this.chosenYear;
        this.chosenMonth;
        this.payrollTypes;
        this.employees;
    }
}
class PayrollScheduleUI {
    constructor() {
        var dt = new Date();
        this.chosenYear = dt.getFullYear();
        this.chosenMonth = dt.getMonth();
    }

    changeModule(evt) {
        payrollScheduleUI.init();
        payrollScheduleUI.loadActiveMonth();
        payrollScheduleUI.loadPayrollTypes();
        payrollScheduleUI.loadEmployeesForSelectedPayrollTypes();

        payrollScheduleUI.loadChoosePayrollList();
    }

    init() {
        $("#dynamikoMainSearch").hide();
    }

    chooseEmployeeForUpdate(obj) {
        var recordId = "";
        if (obj == null || obj == undefined) {
            recordId = localStorage.lastEmployeePayrollId;
        }
        else {
            recordId = $(obj).attr("recordId");
        }
        localStorage.lastEmployeePayrollId = recordId;
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/PayrollScheduleUI/getEmployeePayrollDetail/${recordId}`;
        console.log(url);
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(".PayrollScheduleUI-ListEmployeePayrollDetail").empty();
            $(data).each(function(index, obj) {
                var recordId = obj.getProp("EmployeePayrollId");
                var employeeTimeSheetId = obj.getProp("employeeTimeSheetId");
                var employeePayrollDetailId = obj.getProp("employeePayrollDetailId");
                var workDate = obj.getProp("workDate");
                var totalHours = obj.getPropDefault("totalHours", "0");
                var totalHoursAmount = obj.getPropDefault("totalHoursAmount", "0");
                var totalOtHours = obj.getPropDefault("totalOtHours", "0");
                var totalOtAmount = obj.getPropDefault("totalOtAmount", "0");
                var attendanceType = obj.getPropDefault("attendanceType", "GENERATED");
                var str = `                    
                    <p class="text-muted row">
                        <div class="col-md-12"><strong>${workDate} </strong><span>[${attendanceType}]</span></div>

                        <div class="col-md-4">Total Hours:</div>
                        <div class="col-md-4 text-right">                            
                            <a href="#" class="quickUpdaterCallback font-weight-bold" callback="payrollScheduleUI.chooseEmployeeForUpdate()" updater="text" module="PayrollScheduleUI" recordId="${employeePayrollDetailId}" fieldName="totalHours">${totalHours}</a>
                        </div>
                        <div class="col-md-4 text-right">
                            <a href="#" class="quickUpdaterCallback font-weight-bold" callback="payrollScheduleUI.chooseEmployeeForUpdate()" updater="text" module="PayrollScheduleUI" recordId="${employeePayrollDetailId}" fieldName="totalHoursAmount">${totalHoursAmount}</a>
                        </div>

                        <div class="col-md-4">OT Total:</div>
                        <div class="col-md-4 text-right">
                            <a href="#" class="quickUpdaterCallback font-weight-bold" callback="payrollScheduleUI.chooseEmployeeForUpdate()" updater="text" module="PayrollScheduleUI" recordId="${employeePayrollDetailId}" fieldName="totalOtHours">${totalOtHours}</a>
                        </div>
                        <div class="col-md-4 text-right">
                            <a href="#" class="quickUpdaterCallback font-weight-bold" callback="payrollScheduleUI.chooseEmployeeForUpdate()" updater="text" module="PayrollScheduleUI" recordId="${employeePayrollDetailId}" fieldName="totalOtAmount">${totalOtAmount}</a>
                        </div>
                    </p>
                `;
                $(".PayrollScheduleUI-ListEmployeePayrollDetail").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    choosePayrollSchedule(obj) {
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/PayrollScheduleUI/getEmployeePayrollList/${recordId}`;
        console.log(url);
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(".PayrollScheduleUI-ListEmployeeForUpdate").empty();
            $(data).each(function(index, obj) {
                var recordId = obj.getProp("EmployeePayrollId");
                var firstName = obj.getProp("firstName");
                var lastName = obj.getProp("lastName");
                var basicPay = obj.getProp("basicPay");
                var monthlyRate = obj.getProp("monthlyRate");
                var dailyRate = obj.getProp("dailyRate");
                var hourlyRate = obj.getProp("hourlyRate");
                var payrollType = obj.getProp("payrollType");
                var taxPackage = obj.getProp("taxPackage");
                var str = `
                    <a href="#" class="btnChooseEmployeeForUpdate" recordId=${recordId}><strong>${lastName}, ${firstName}</strong><span class="pull-right"> [${taxPackage} - ${payrollType}]</span></a>
                    <p class="text-muted">
                        Basic Pay: <span class="pull-right"><b>${basicPay}</b></span><br/>
                        Rates: <span class="pull-right">M - <b>${monthlyRate}</b>, D - <b>${dailyRate}</b>, H - <b>${hourlyRate}</b></span>
                    </p>
                `;
                $(".PayrollScheduleUI-ListEmployeeForUpdate").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadChoosePayrollList() {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/PayrollScheduleUI/getPayrollList/${payrollScheduleUI.chosenYear}/${payrollScheduleUI.chosenMonth+1}`;
        console.log(url);
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(".PayrollScheduleUI-ChoosePayrollList").empty();
            $(data).each(function(index, obj) {
                var name = obj.getProp("name");
                var startDate = obj.getProp("cutOffStartDate");
                var endDate = obj.getProp("cutOffEndDate");
                var payrollTypes = obj.getProp("payrollTypes");
                var yearAndMonth = obj.getProp("yearAndMonth");
                var recordId = obj.getProp("PayrollScheduleId");
                var str = `
                    <a href="#" class="btnChoosePayrollSchedule" recordId=${recordId}><strong>${name}</strong> <span class="pull-right">${startDate} to ${endDate}</span></a>
                    <p class="text-muted">
                        Payroll Types: ${payrollTypes}
                    </p>
                    <hr/>
                `;
                $(".PayrollScheduleUI-ChoosePayrollList").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    savePayroll() {
        console.log("SAVE PAYROLL CALLED");
        var payrollObj = new PayrollObj();
        payrollObj.payrollName = $(`.displayEdit[name="runPayrollName"]`).val();
        payrollObj.startDate = $(`.displayEdit[name="startDate"]`).val();
        payrollObj.endDate = $(`.displayEdit[name="endDate"]`).val();
        payrollObj.chosenYear = payrollScheduleUI.chosenYear;
        payrollObj.chosenMonth = payrollScheduleUI.chosenMonth+1;

        var payrollTypes = [];
        $(".EmployeePayrollType_CheckBox:checked").each(function(index, obj) {
            var payrollType = $(obj).val();
            if (payrollType) {
                payrollTypes.push(payrollType);
            }
        });
        payrollObj.payrollTypes = payrollTypes;

        var employees = [];
        $(".AllEmployee_CheckBox:checked").each(function(index, obj) {
            var employee = $(obj).val();
            if (employee) {
                employees.push(employee);
            }
        });
        payrollObj.employees = employees;

        var vdata = JSON.stringify(payrollObj);
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/PayrollScheduleUI/post/runPayroll`;
        console.log(url);
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log(data);
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback);
    }

    loadEmployeesForSelectedPayrollTypes() {
        var payrollTypes = [];
        $(".EmployeePayrollType_CheckBox:checked").each(function(index, obj) {
            var payrollType = $(obj).val();
            if (payrollType) {
                payrollTypes.push(payrollType);
            }
        });
        var vdata = JSON.stringify(payrollTypes);
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/PayrollScheduleUI/post/getEmployeesForSelectedPayrollTypes`;
        console.log(url);
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log(data);
            $(".PayrollScheduleUI_EmployeePayrollList").empty();
            $(data).each(function(index, obj) {
                var employeeName = obj.getProp("lastName")+", "+obj.getProp("firstName");
                var personId = obj.getProp("personId");
                var str = `
                    <div class="checkbox col-md-4" style="flex: 1; margin: auto;">
                        <label>
                            <input class="AllEmployee_CheckBox" type="checkbox" value="${personId}" checked>
                            <b>${employeeName}</b>
                        </label>
                    <div>
                `;
                $(".PayrollScheduleUI_EmployeePayrollList").append(str);
            });
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback);
    }

    loadPayrollTypes() {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/PayrollScheduleUI/getEmployeePayrollTypes`;
        console.log(url);
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(".PayrollScheduleUI_EmployeePayrollTypes").empty();
            $(data).each(function(index, obj) {
                var str = `
                    <div class="checkbox" style="flex: 1; margin: auto;">
                        <label>
                            <input class="EmployeePayrollType_CheckBox" type="checkbox" value="${obj}">
                            <b>${obj}</b>
                        </label>
                    </div>
                `;
                $(".PayrollScheduleUI_EmployeePayrollTypes").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadActiveMonth() {
        console.log("Called Load Active Month");
        var months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
        var monthNum = payrollScheduleUI.chosenMonth;;
        var currentYear = payrollScheduleUI.chosenYear;
        var currentMonth = months[monthNum];
        var prevMonth = months[(monthNum > 0)?monthNum-1:-1];
        var nextMonth = months[(monthNum > 11)?1:monthNum+1];
        $(months).each(function(index, obj) {
            $(`[module="PayrollScheduleUI"][month="${obj}"]`).removeClass("bg-active-month");
            $(`[module="PayrollScheduleUI"][month="${obj}"]`).removeClass("bg-inactive-month");
            $(`[module="PayrollScheduleUI"][month="${obj}"]`).removeClass("bg-before-active-month");
            $(`[module="PayrollScheduleUI"][month="${obj}"]`).removeClass("bg-after-active-month");
            if (currentMonth==obj) {
                $(`[module="PayrollScheduleUI"][month="${obj}"]`).addClass("bg-active-month");
                $(`[module="PayrollScheduleUI"][month="${obj}"] a.status-display`).html("Current"); 
            }
            else if (prevMonth==obj) {
                $(`[module="PayrollScheduleUI"][month="${obj}"]`).addClass("bg-before-active-month");
                $(`[module="PayrollScheduleUI"][month="${obj}"] a.status-display`).html("Past");
            }
            else if (nextMonth==obj) {
                $(`[module="PayrollScheduleUI"][month="${obj}"]`).addClass("bg-after-active-month");
                $(`[module="PayrollScheduleUI"][month="${obj}"] a.status-display`).html("Next");
            }
            else {
                $(`[module="PayrollScheduleUI"][month="${obj}"]`).addClass("bg-inactive-month");
                $(`[module="PayrollScheduleUI"][month="${obj}"] a.status-display`).html("-- --");
            }
        });
        $(".PayrollMonthName").html(currentMonth);
        $(".PayrollYear").html(currentYear);
        payrollScheduleUI.loadPayrollDetailForMonth();
    }

    loadPayrollDetailForMonth() {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/PayrollScheduleUI/loadPayrollDetailForMonth/${payrollScheduleUI.chosenYear}/${payrollScheduleUI.chosenMonth+1}`;
        console.log(url);
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    // onfocusout(obj) {
    //     console.log("PayrollScheduleUI change "+obj);
    //     if ("|basicPay|totalBasicPay|".includes("|"+obj.name)+"|") {
    //         this.calculateAmounts();
    //     }
    // }

    // calculateAmounts(index) {
    //     console.log("PayrollScheduleUI chooseEmployees");
    //     var recordId = $(mainId).val();
    //     var url = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/specialaction/PayrollScheduleUI/getPayroll/"+recordId;
    //     var ajaxRequestDTO = new AjaxRequestDTO(url, "");
    //     var successCallback = function(data) {
    //         console.log(data);

    //         var totalBasicPay = zeroNaN(data[0].getProp("basicPay"));
    //         var totalOtAmount = zeroNaN(data[0].getProp("totalOtAmount"));

    //         var benefit01 = zeroNaN(data[0].getProp("benefitAmount01"));
    //         var benefit02 = zeroNaN(data[0].getProp("benefitAmount02"));
    //         var benefit03 = zeroNaN(data[0].getProp("benefitAmount03"));
    //         var benefit04 = zeroNaN(data[0].getProp("benefitAmount04"));
    //         var benefit05 = zeroNaN(data[0].getProp("benefitAmount05"));
    //         var benefit06 = zeroNaN(data[0].getProp("benefitAmount06"));
    //         var benefit07 = zeroNaN(data[0].getProp("benefitAmount07"));
    //         var benefit08 = zeroNaN(data[0].getProp("benefitAmount08"));
    //         var benefit09 = zeroNaN(data[0].getProp("benefitAmount09"));
    //         var benefit10 = zeroNaN(data[0].getProp("benefitAmount10"));

    //         var totalBenefitAmount = zeroNaN(benefit01+benefit02+benefit03+benefit04+benefit05+benefit06+benefit07+benefit08+benefit09+benefit10);
    //         var totalAdjustmentAmount = zeroNaN(data[0].getProp("totalAdjustmentAmount"));
    //         var totalTaxAmount = zeroNaN(data[0].getProp("totalTaxAmount"));
    
    //         var totalGrossAmount = zeroNaN(totalBasicPay+totalOtAmount+totalBenefitAmount+totalAdjustmentAmount+totalTaxAmount);
    
    //         $("input[mainmodule='PayrollSchedule'][name='totalBasicPay']").val(totalBasicPay);
    //         $("input[mainmodule='PayrollSchedule'][name='totalOtAmount']").val(totalOtAmount);
    //         $("input[mainmodule='PayrollSchedule'][name='totalBenefitAmount']").val(totalBenefitAmount);
    //         $("input[mainmodule='PayrollSchedule'][name='totalAdjustmentAmount']").val(totalAdjustmentAmount);
    //         $("input[mainmodule='PayrollSchedule'][name='totalGrossAmount']").val(totalGrossAmount);
    //         $("input[mainmodule='PayrollSchedule'][name='totalTaxAmount']").val(totalTaxAmount);
    //     };
    //     ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    // }

    // onsaveChild(subModuleName) {
    //     console.log("PayrollScheduleUI saveChild "+subModuleName);
    //     this.calculateAmounts();
    // }

    // doSpecialAction(data) {
    //     console.log("PayrollScheduleUI doSpecialAction "+data);
    //     if (data == "chooseEmployees") {
    //         this.chooseEmployees();
    //     }
    //     else {
    //         showModalAny.show("Payroll", data);
    //     }
    // }

    // chooseEmployees() {
    //     console.log("PayrollScheduleUI chooseEmployees");
    //     var recordId = $(mainId).val();
    //     var url = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/specialaction/PayrollScheduleUI/getEmployees/"+recordId;
    //     var ajaxRequestDTO = new AjaxRequestDTO(url, "");
    //     var successCallback = function(data) {
    //         console.log(data);
    //         var str = `
    //             <table>
    //                 <thead style="display:block;">
    //                     <tr style="display:block;">
    //                         <th style="width: 150px;">Last Name</th>
    //                         <th style="width: 150px;">First Name</th>
    //                         <th style="width: 150px;">Include</th>
    //                     <tr>
    //                 </thead>
    //                 <tbody style="display:block; overflow:auto; height:300px;">
    //         `;
    //         $(data).each(function(ind, obj) {
    //             var id = obj.getProp("personId");
    //             var firstName = obj.getProp("firstName");
    //             var lastName = obj.getProp("lastName");
    //             str += `
    //                 <tr class="addToPayroll_${id}">
    //                     <td style="width: 150px;">${firstName}</td>
    //                     <td style="width: 150px;">${lastName}</td>
    //                     <td style="width: 150px;"><button class="btn btn-primary specialAction PayrollScheduleUI addToPayroll" value="${id}">Add to Payroll</button></td>
    //                 </tr>
    //             `;
    //         });
    //         str += "    </tbody>";
    //         str += "</table>";
    //         showModalAny500.show("Choose Employees", str, function() {
    //             console.log("Callback Called for Choose Employee");
    //         });
    //     };
    //     ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    // }

    // addToPayroll(obj) {
    //     var recordId = $(mainId).val();
    //     var code = $(obj).attr("value");
    //     var url = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/specialaction/PayrollScheduleUI/addEmployee/"+recordId+"_"+code;
    //     console.log(url);
    //     var ajaxRequestDTO = new AjaxRequestDTO(url, "");
    //     var successCallback = function(data) {
    //         console.log(data);
    //         $("tr.addToPayroll_"+code).hide();
    //     };
    //     ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    // }
}
