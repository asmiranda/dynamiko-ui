class GlobalEventsHr {
    initializeGlobalEvents() {
        this.registeredModules = [];
        this.registeredModules.push("hrRequisitionUI");
        this.registeredModules.push("employeeUI");

        $(document).on('changeModule', function(evt) {
            globalEventsHr.triggerChangeModule(evt);
            // hrRequisitionUI.changeModule(evt);
            // employeeUI.changeModule(evt);
        });
        $(document).on('doMainSearchData', function(evt) {
            globalEventsHr.triggerMainSearch(evt);
            // hrRequisitionUI.doMainSearchData(evt);
            // employeeUI.doMainSearchData(evt);
        });
        $(document).on('click', '.loadRecordToForm', function() {
            var recordId = $(this).attr("recordId");
            $(mainId).val(recordId);
            globalEventsHr.triggerChangeRecord(this);
        });
        $(document).on('change', mainId, function() {
            globalEventsHr.triggerChangeRecord(this);
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

    triggerMainSearch(evt) {
        console.log("triggerMainSearch");
        console.log(evt);
        $(this.registeredModules).each(function (index, data) {
            var areEqual = data.toUpperCase() == evt.detail.text().toUpperCase();
            if (areEqual) {
                var objEval = data+".doMainSearchData(evt)";
                eval(objEval);
            }
        });
    }

    triggerChangeModule(obj) {
        console.log("triggerChangeModule");
        console.log(obj);
        $(this.registeredModules).each(function (index, data) {
            var areEqual = data.toUpperCase() == $(obj).attr("module").toUpperCase();
            if (areEqual) {
                var objEval = data+".changeModule(obj)";
                eval(objEval);
            }
        });
    }

    triggerChangeRecord(obj) {
        console.log("triggerChangeRecord");
        console.log(obj);
        $(this.registeredModules).each(function (index, data) {
            var areEqual = data.toUpperCase() == $(obj).attr("module").toUpperCase();
            if (areEqual) {
                var objEval = data+".changeMainId(obj)";
                eval(objEval);
            }
        });
    }
}
