class GlobalEventsHr {
    initializeGlobalEvents() {
        $(document).on('doMainSearchData', function(evt) {
            hrRequisitionUI.doMainSearchData(evt);
            employeeUI.doMainSearchData(evt);
        });
        $(document).on('click', '.loadRecordToForm', function() {
            hrRequisitionUI.loadRecordToForm(this);
            employeeUI.loadRecordToForm(this);
        });
        $(document).on('change', mainId, function() {
            hrRequisitionUI.changeMainId(this);
            employeeUI.changeMainId(this);

        });
        $(document).on('changeModule', function(evt) {
            hrRequisitionUI.changeModule(evt);
            employeeUI.changeModule(evt);
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
