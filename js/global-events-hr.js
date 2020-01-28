class GlobalEventsHr {
    initializeGlobalEvents() {
        $(document).on('changeModule', function(evt) {
            var moduleName = evt.detail.text();
            console.log(moduleName);
            hrRequisitionUI.initializeModule(moduleName);
        });
        $(document).on('change', mainId, function() {
            hrRequisitionUI.reArrange(this);
            hrRequisitionUI.loadFulfilled(this);
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
        $(document).on('click', '.loadRecordToForm', function() {
            hrRequisitionUI.loadRecordToForm(this);
        });
    }
}
