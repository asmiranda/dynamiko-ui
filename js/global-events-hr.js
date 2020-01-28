class GlobalEventsHr {
    initializeGlobalEvents() {
        $(document).on('click', '.btnAcceptApplicant', function() {
            hrRequisitionUI.acceptApplicant(this);
        });
        $(document).on('click', '.btnCreateJob', function() {
            hrRequisitionUI.createJob(this);
        });
        $(document).on('click', '.btnRemoveApplicant', function() {
            hrRequisitionUI.removeApplicant(this);
        });
        $(document).on('click', '.loadRecordToForm', function() {
            hrRequisitionUI.loadRecordToForm(this);
        });
    }
}
