class GlobalEventsHr {
    initializeGlobalEvents() {
        
        $(document).on('change', '#selectPayrollYear', function() {
            payrollScheduleUI.changePayrollPeriod(this, "year");
        });
        $(document).on('click', '.btnPayrollMonth', function() {
            payrollScheduleUI.changePayrollPeriod(this, "month");
        });

        $(document).on('click', '.btnChooseEmployeeForUpdate', function() {
            payrollScheduleUI.chooseEmployeeForUpdate(this);
        });
        $(document).on('click', '.btnChoosePayrollSchedule', function() {
            payrollScheduleUI.choosePayrollSchedule(this);
        });
        $(document).on('click', '.btnSavePayroll', function() {
            payrollScheduleUI.savePayroll();
        });
        $(document).on('click', '.EmployeePayrollType_CheckBox', function() {
            payrollScheduleUI.loadEmployeesForSelectedPayrollTypes();
        });

        $(document).on('click', '.btnRemoveSupervisor', function() {
            employeeUI.removeSupervisor(this);
        });
        $(document).on('click', '.btnRemoveTeamMember', function() {
            employeeUI.removeTeamMember(this);
        });


        
        
        $(document).on('click', '.HrRequisitionUI_btnCancelInterview', function() {
            hrRequisitionUI.cancelInterview(this);
        });
        $(document).on('click', '.HrRequisitionUI_btnAddInterviewScheduleClose', function() {
            hrRequisitionUI.addInterviewScheduleAndClose(this);
        });
        $(document).on('click', '.HrRequisitionUI_btnGotoApplicantProfile', function() {
            hrRequisitionUI.gotoApplicantProfile(this);
        });
        $(document).on('click', '.HrRequisitionUI_btnGotoRecruiterProfile', function() {
            hrRequisitionUI.gotoRecruiterProfile(this);
        });
        $(document).on('click', '.HrRequisitionUI_btnGotoJobListing', function() {
            hrRequisitionUI.gotoJobListing(this);
        });
        $(document).on('click', '.HrRequisitionUI_btnGotoManagerProfile', function() {
            hrRequisitionUI.gotoManagerProfile(this);
        });


        $(document).on('click', '.HrRequisitionUI_btnShowAddTask', function() {
            hrRequisitionUI.showAddTask(this);
        });
        $(document).on('click', '.HrRequisitionUI_btnShowUpdateTask', function() {
            hrRequisitionUI.showUpdateTask(this);
        });
        $(document).on('click', '.HrRequisitionUI_btnAddTaskNew', function() {
            hrRequisitionUI.saveTask(this, "NEW");
        });
        $(document).on('click', '.HrRequisitionUI_btnAddTaskClose', function() {
            hrRequisitionUI.saveTask(this, "CLOSE");
        });
        $(document).on('click', '.HrRequisitionUI_btnDeleteTask', function() {
            hrRequisitionUI.deleteTask(this);
        });
        $(document).on('click', '.btnAcceptApplicant', function() {
            hrRequisitionUI.acceptApplicant(this);
        });
        $(document).on('click', '.btnCreateJob', function() {
            hrRequisitionUI.createJob(this);
        });
        $(document).on('click', '.btnRemoveApplicant', function() {
            hrRequisitionUI.removeApplicant(this);
        });
    }
}
