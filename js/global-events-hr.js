class GlobalEventsHr {
    initializeGlobalEvents() {
        
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
