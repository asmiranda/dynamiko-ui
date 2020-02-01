class GlobalEventsHr {
    initializeGlobalEvents() {
        $(document).on('doMainSearchData', function(evt) {
            hrRequisitionUI.doMainSearchData(evt);
            employeeUI.doMainSearchData(evt);
        });
        $(document).on('click', '.loadRecordToForm', function() {
            var recordId = $(this).attr("recordId");
            $(mainId).val(recordId);
            globalEventsHr.triggerChangeRecord(this);
        });
        $(document).on('change', mainId, function() {
            globalEventsHr.triggerChangeRecord(this);
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

    triggerChangeRecord(obj) {
        hrRequisitionUI.changeMainId(obj);
        employeeUI.changeMainId(obj);
    }
}
