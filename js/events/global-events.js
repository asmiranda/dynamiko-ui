class GlobalEvents {
    initializeGlobalEvents() {
        $(window).keydown(function(event){
            if(event.keyCode == 13) {
              event.preventDefault();
              return false;
            }
        });
        
        this.registeredModules = [];
        this.registeredModules.push("hrRequisitionUI");
        this.registeredModules.push("employeeUI");
        this.registeredModules.push("payrollScheduleUI");
        this.registeredModules.push("purchaseOrderUI");
        this.registeredModules.push("salesOrderUI");
        this.registeredModules.push("inventoryUI");
        this.registeredModules.push("accountingUI");
        this.registeredModules.push("hospitalUI");
        this.registeredModules.push("governmentUI");
        this.registeredModules.push("reportUI");
        this.registeredModules.push("conferenceUI");
        this.registeredModules.push("facultyMeetingUI");
        this.registeredModules.push("schoolUI");

        $(document).on('changeModule', function(evt) {
            globalEvents.triggerChangeModule(evt);
        });
        $(document).on('doMainSearchData', function(evt) { 
            globalEvents.triggerMainSearch(evt);
        });
        $(document).on('click', '.loadRecordToForm', function() {
            var recordId = $(this).attr("recordId");
            $(mainId).val(recordId);
            globalEvents.triggerChangeRecord(this);
        });
        $(document).on('change', mainId, function() {
            globalEvents.triggerChangeRecord(this);
        });

        $(document).on('click', '.btnDownloadExcel[module="ReportUI"]', function() {
            reportUI.downloadExcel(this);
        });
        $(document).on('click', '.btnRunReport[module="ReportUI"]', function() {
            reportUI.displayReport(this);
        });
        $(document).on('change', 'select[module="ReportUI"][name="report"]', function() {
            reportUI.changeParameters(this);
        });

        $(document).on('click', '.leftDashboardItem', function() {
            dashboard.load(this);
        });
        $(document).on('click', '.leftMenuItem[report="true"]', function() {
            mainReport.constructMainReport(this);
        });
        $(document).on('click', '.leftMenuItem[report="false"]', function() {
            leftMenu.loadUI(this);
        });

        $(document).on('click', '.btnSignOut', function() {
            window.location.href = "login.html";
        });
        $(document).on('click', '.manageUserRoles', function() {
            uiService.manageUserRoles();
        });
        $(document).on('click', '.manageDepartment', function() {
            uiService.manageDepartment();
        });
        $(document).on('click', '.manageTaxCategory', function() {
            uiService.manageTaxCategory();
        });
        $(document).on('click', '.manageAccountChart', function() {
            uiService.manageAccountChart();
        });
        $(document).on('click', '.manageBenefit', function() {
            uiService.manageBenefit();
        });
        $(document).on('click', '.manageEmployee', function() {
            uiService.manageEmployee();
        });
        $(document).on('click', '.manageSupplier', function() {
            uiService.manageSupplier();
        });
        $(document).on('click', '.manageProduct', function() {
            uiService.manageProduct();
        });
        $(document).on('click', '.choiceCompany', function() {
            uiService.changeCompany($(this).attr("companyCode"), $(this).attr("companyName"));
        });

        $(document).on('keyup', '.autocomplete', function() {
            dynaAutoComplete.doAutoComplete(this);
        });
        $(document).on('click', '.autocomplete', function() {
            dynaAutoComplete.doAutoComplete(this);
        });
        $(document).on('click', '.autocomplete-choice', function() {
            dynaAutoComplete.putAutoComplete(this);
        });
        $(document).on('click', '.btnCloseAutoComplete', function() {
            dynaAutoComplete.closeAutoComplete(this);
        });
        $(document).on('click', '.btnAutoClearSelected', function() {
            dynaAutoComplete.clearSelected(this);
        });
        

        $(document).on('click', '.btnChildTabSave', function() {
            dynaButtonAction.saveDisplayTab(this);
        });
        $(document).on('click', '.btnAddInfoSave', function() {
            dynaButtonAction.saveAddInfoSave(this);
        });

        $(document).on('click', 'button.btnChildTabEdit', function() {
            childTabs.editChildRecord(this);
        });
        $(document).on('click', 'button.btnChildTabNew', function() {
            childTabs.newDisplayTab(this);
        });
        $(document).on('click', 'button.btnChildTabDelete', function() {
            childTabs.deleteDisplayTab(this);
        });
        $(document).on('click', 'button.btnChildTabCancel', function() {
            childTabs.cancelDisplayTab(this);
        });
        $(document).on('click', '.setFileProfile', function() {
            childTabs.setFileProfile(this);
        });               
        $(document).on('click', '.attachFileRemove', function() {
            childTabs.removeAttachedFile(this);
        });               
        $(document).on('click', '.btnImage_', function() {
            childTabs.displayLargeImageFullScreen(this);
        });

        // ##################################### for Search
        $(document).on('click', '.setFileProfile', function() {
            searchTable.setFileProfile(this);
        });               
        $(document).on('click', '.attachFileRemove', function() {
            searchTable.removeAttachedFile(this);
        });               
        $(document).on('keyup', 'input[class~="filter"]', function() {
            searchTable.reloadSearch();
        });
        $(document).on('click', 'select.specialSearch', function() {
            searchTable.reloadSpecialSearch();
        });
        $(document).on('click', 'btnImage', function() {
            searchTable.displayLargeImageFullScreen(this);
        });

        // ########################Form Control Button
        $(document).on('click', '.btnToggleSearch', function() {
            formControlButton.toggleSearch();
        });
        $(document).on('click', '.btnNew', function() {
            formControlButton.newRecord(this);
        });
        $(document).on('click', '.btnUpdate', function() {
            formControlButton.showModalUpdateRecord(this);
        });
        $(document).on('click', '.btnSave', function() {
            formControlButton.saveRecord(this);
        });
        $(document).on('click', '.btnDelete', function() {
            formControlButton.deleteRecord(this);
        });
        $(document).on('click', 'li.btnUpload', function() {
            formControlButton.listFileAttachments(this);
        });
        $(document).on('click', 'button.btnSaveUpload', function() {
            formControlButton.saveUpload(this);
        });
        $(document).on('click', '.myReport', function() {
            formControlButton.displayReport(this);
        });
        $(document).on('click', '.reportClose', function() {
            console.log("close report");
            dynamicReport.dialog("close");
        });

        // ########################Custom Report
        $(document).on('click', '.btnCustomReportToggleCriteria', function() {
            customReport.customReportToggleCriteria(this);
        });
        $(document).on('click', '.btnCustomReportFullScreen', function() {
            customReport.customReportFullScreen(this);
        });
        $(document).on('click', '.btnCustomReportRun', function() {
            customReport.customReportRun(this);
        });     
        $(document).on('click', '.btnCustomDisplayModalReport', function() {
            customReport.customDisplayModalReport(this);
        });     
        $(document).on('click', '.btnAutoCustomDisplayModalReport', function() {
            customReport.customAutoDisplayModalReport(this);
        });     

        // #########################Field Constructors
        $(document).on('click', mainId, function() {
            fieldMultiSelect.changeMultiSelectData(this);
        });
        $(document).on('click', '.multiSelectDisplayAdd', function() {
            fieldMultiSelect.clickDisplayAdd(this);
        });
        $(document).on('click', '.multiSelectAdd', function() {
            fieldMultiSelect.addSelected(this);
        });
        $(document).on('click', '.multiSelectDelete', function() {
            fieldMultiSelect.deleteSelected(this);
        });
        $(document).on('keyup', '.multiSelectTextFilter', function() {
            fieldMultiSelect.filterChoices(this);
        });

        // #########################Form Linker
        $(document).on('click', '.formLinker', function() {
            formLinker.startLink(this);
        });
        $(document).on('click', '.childFormLinker', function() {
            formLinker.startChildToFormLink(this);
        });

        // ########################Quick Updater
        $(document).on('click', '.quickAttachmentTarget', function() {
            quickUpdater.quickAttachment(this);
        });
        $(document).on('click', '.quickDownloaderTarget', function() {
            quickUpdater.quickDownloader(this);
        });
        $(document).on('click', '.quickUpdaterCallback', function() {
            quickUpdater.quickUpdaterCallback(this);
        });
        $(document).on('click', '.quickUpdaterTarget', function() {
            quickUpdater.quickUpdater(this);
        });
        $(document).on('change', '.calendarQuickUpdaterInput', function() {
            quickUpdater.quickUpdateInput(this);
        });
        $(document).on('change', '.textQuickUpdaterInput', function() {
            quickUpdater.quickUpdateInput(this);
        });
        $(document).on('change', '.autoCompleteQuickUpdaterSelect', function() {
            quickUpdater.quickAutoCompleteUpdateInput(this);
        });

        // ########################Quick Searcher
        $(document).on('click', '.btnQuickSearch', function() {
            quickSearcher.displayMainQuickSearcher(this);
        });
        $(document).on('keyup', '.quickMainSearcherInput', function() {
            quickSearcher.doMainQuickSearcher(this);
        });

        // ###################### Other events
        $(document).on('click', '.pivotTable', function() {
            dataVisualizer.showPivot();
        });
        $(document).on('click', '.btnFullScreenAny', function() {
            dynamikoFullScreen.fullScreen(this);
        });        
        $(document).on('click', '.btnChartFullScreen', function() {
            widgetChartRule.chartFullScreen(this);
        });        
        $(document).on('click', '#printForm', function() {
            printJS('mainForm', 'html');
        });
        $(document).on('click', '.myReportViewer', function() {
            myReportViewer.displayReportViewer(this);
        });
        $(document).on('click', '.btnSubmitReportCriteria', function() {
            myReportViewer.displayReportPdf(this);
        });

        // #############################################Review Center
        $(document).on('click', '.btnReviewCenterShowQuestions', function(){
            reviewCenter.showQuestions(this);
        });
        $(document).on('click', '.btnReviewCenterAddQuestion', function(){
            reviewCenter.addQuestion(this);
        });
        $(document).on('click', '.btnReviewCenterDeleteQuestion', function(){
            reviewCenter.deleteQuestion(this);
        });
        $(document).on('keyup', '.txtReviewCenterSearchQuestion', function(){
            reviewCenter.searchQuestion(this);
        });
        $(document).on('click', '.btnReviewCenterSubmitEnrollment', function(){
            reviewCenter.submitEnrollment();
        });
        $(document).on('click', '.btnReviewCenterEnrollTo', function(){
            reviewCenter.populateEnrollmentChoices(); 
        });

        // ################################################For Upload Data File
        $(document).on('click', '#uploadDataFile', function() {
            uploadDataFile.displayUploadDataViewer();
        });
        $(document).on('click', '.downloadTemplate', function() {
            uploadDataFile.downloadTemplate();
        });
        $(document).on('change', '#fileDataUpload', function(evt) {
            uploadDataFile.displayCsvFile(evt);
            var fileName = evt.target.files[0].name;
            $("#chosenFileForUpload").html(fileName);
        });
        $(document).on('change', '.btnUploadDataFile', function(evt) {
            uploadDataFile.uploadDataFile();
        });
        $(document).on('click', '.useTemplate', function() {
            uploadDataFile.useChosenTemplate(this);
        });
        $(document).on('change', '#fileUpload', function(evt) {
            if($(this).prop('files').length > 0) {
                var file = $(this).prop('files')[0];
                formControlButton.formUploadData.append("file", file);
            }
        });

        // ################################################# for modules
        // $(document).on('click', '.addToPayroll', function() {
        //     payrollScheduleUI.addToPayroll(this);
        // });
        // $(document).on('click', 'input.payrollInput', function() {
        //     payrollScheduleUI.onfocusout(this);
        // });
        // $(document).on('change', 'input[module="PurchaseOrderUI"]', function() {
        //     purchaseOrderUI.onfocusout(this);
        // });
        // $(document).on('change', 'input[module="SalesOrderUI"]', function() {
        //     salesOrderUI.onfocusout(this);
        // });


        // ###################For Reports 
        $(document).on('click', '.btnShowInvoiceReport', function() {
            ajaxCaller.displayReport("Invoice", "sample=sample");
        });

        $(document).on('click', '.toggle-box', function() {
            utils.toggleBox(this);
        });

        $(document).on('click', '.toggle-any', function() {
            utils.toggleAny(this);
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
        var recordId = dynamikoCache.getLastRecordId();
        $(mainId).val(recordId);

        $(this.registeredModules).each(function (index, data) {
            var useModule = null;
            if ($(obj).attr("module")==null || $(obj).attr("module")==undefined) {
                useModule = localStorage.latestModule;
            }
            else {
                useModule = $(obj).attr("module");
            }
            var isEqual = data.toUpperCase() == useModule.toUpperCase();
            if (isEqual) {
                var objEval = data+".changeModule(obj)";
                eval(objEval);
                childTabs.initTabs(useModule);
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

$(function () {
    globalEventsHr = new GlobalEventsHr();    
    globalEventsHr.initializeGlobalEvents();

    globalEventsAccounting = new GlobalEventsAccounting();    
    globalEventsAccounting.initializeGlobalEvents();

    globalEventsGovernment = new GlobalEventsGovernment();    
    globalEventsGovernment.initializeGlobalEvents();
    
    globalEventsOthers = new GlobalEventsOthers();    
    globalEventsOthers.initializeGlobalEvents();
})
