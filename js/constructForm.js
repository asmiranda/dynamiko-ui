class MainForm {
    constructor(moduleName, searchTable, mainForm) {
        this.moduleName = moduleName;
        this.searchTable = searchTable;
        this.mainForm = mainForm;

        this.childTabs = new ChildTabs(this.moduleName, this.mainForm);
        this.searchTableClass = new SearchTable(this.moduleName, this.mainForm, this.searchTable, this.childTabs);
        this.controlButtonClass = new FormControlButton(this.moduleName, this.mainForm, this.searchTableClass, this.childTabs);
        this.fieldConstructor = new FieldConstructor(this.moduleName, this.mainForm);
        this.moduleHelper = new ModuleHelper(this.moduleName, this.mainForm);
        this.profilePicLoader = new ProfilePicLoader(this.moduleName, this.mainForm);
        this.formRule = new FormRule(this.moduleName, this.mainForm);
        this.chartRule = new ChartRule(this.moduleName, this.mainForm);
        this.printForm = new PrintForm(this.moduleName, this.mainForm);
    }

    construct(recordId) {
        var context = this;
        var url = MAIN_URL+"/api/ui/"+localStorage.companyCode+"/module/"+this.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            $("#content-main").html(data);
            $('[data-mask]').inputmask();
            context.controlButtonClass.initButtons();
            context.searchTableClass.initTable();
            context.fieldConstructor.initFields();
            context.childTabs.initTabs();
            context.moduleHelper.initHelp();
            context.profilePicLoader.init();
            context.formRule.doRule();
            context.chartRule.doChartRule();
            // context.printForm.init();
            if (recordId) {
                context.loadRecord(recordId);
            }
            
            var formLink = new FormLinker();
            formLink.init();

            var moduleScript = new ModuleScript(context.moduleName);
            moduleScript.init();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    };

    loadRecord(recordId) {
        var context = this;
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/findRecord/' + this.moduleName + '/' + recordId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Record Found");
            console.log(data);
            var loadJsonToForm = new LoadJsonToForm(context.mainForm, data);
            loadJsonToForm.load();

            context.childTabs.reloadAllChildRecords();
            context.formRule.doRule();
            context.chartRule.doChartRule();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }
}

class PrintForm {
    constructor(moduleName, mainForm) {
        console.log("PrintForm");
        this.moduleName = moduleName;
        this.mainForm = mainForm;
    }

    init() {
        $("#printForm").click(function() {
            console.log("Print Form.");
            printJS('mainForm', 'html');
        });
    }
}

class FormRule {
    constructor(moduleName, mainForm) {
        console.log("FormRule");
        this.moduleName = moduleName;
        this.mainForm = mainForm;
    }

    doRule() {
        var context = this;
        console.log("doRule called");
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        console.log(vdata);
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/formrule/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log(data);
            context.setupButtons(data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    }

    setupButtons(formrule) {
        this.disableHideSelector(".btnNew", "btnNew", formrule);
        this.disableHideSelector(".btnSave", "btnSave", formrule);
        this.disableHideSelector(".btnUpload", "btnUpload", formrule);
        this.disableHideSelector(".btnDelete", "btnDelete", formrule);
        this.disableHideSelector(".btnWf", "btnWf", formrule);
    }

    disableHideSelector(selector, field, formrule) {
        var dispComp = formrule.getProp("componentDisplays").filter(display => field==display.name)[0];
        if (dispComp.getProp("display")) {
            $(selector).show();
        }
        else {
            $(selector).hide();
        }

        if (dispComp.getProp("enabled")) {
            $(selector).prop("disabled", false);
        }
        else {
            $(selector).prop("disabled", true);
        }
    }
}

class ProfilePicLoader {
    constructor(moduleName, mainForm) {
        console.log("ProfilePicLoader");
        this.moduleName = moduleName;
        this.mainForm = mainForm;
    }

    init() {
        console.log("ProfilePicLoader init called");
        var context = this;
        $(`input.mainId[module='${this.moduleName}']`).on('change', function() {
            console.log("ProfilePicLoader change called");
            var recordId = $(this).val();
            if (recordId && recordId > 0) {
                var imageLink = `${MAIN_URL}/api/generic/${localStorage.companyCode}/profilePic/${context.moduleName}/${recordId}/`;
                console.log(`ProfilePicLoader src="${imageLink}"`);
                $("#profilePic").attr("src", imageLink);
                $("#profilePic").show();
            }
            else {
                $("#profilePic").hide();
            }
        });
        $("#profilePic").hide();
    }
}

class ModuleHelper {
    constructor(moduleName, mainForm) {
        this.moduleName = moduleName;
        this.mainForm = mainForm;
    }

    initHelp() {
        var context = this;
        $(".moduleHeader").click(function() {
            var title = $(".moduleHelp").attr("title");
            var helpHtml = $(".moduleHelp").html();
            var showHelp = new ShowModuleHelp(title, helpHtml);
            showHelp.show();
        });
    }
}

class FormControlButton {
    constructor(moduleName, mainForm, searchTableClass, childTabs) {
        this.moduleName = moduleName;
        this.mainForm = mainForm;
        this.searchTableClass = searchTableClass;
        this.childTabs = childTabs;
        this.formUploadData = new FormData();
        this.formRule = new FormRule(this.moduleName, this.mainForm);
    }

    initButtons() {
        var context = this;
        var myUploadDialog = $("#myUploadDialog").dialog({
            autoOpen: false,
        });
        this.initFileUpload();
        
        $('.btnToggleSearch[module="'+this.moduleName+'"]').click(function() {
            context.toggleSearch();
        });
        $('.btnNew[module="'+this.moduleName+'"]').click(function() {
            context.newRecord();
        });
        $('.btnUpdate[module="'+this.moduleName+'"]').click(function() {
            context.showModalUpdateRecord();
        });
        $('.btnSave[module="'+this.moduleName+'"]').click(function() {
            context.saveRecord();
        });
        $('.btnDelete[module="'+this.moduleName+'"]').click(function() {
            context.deleteRecord();
        });
        $('li.btnUpload').click(function() {
            context.listFileAttachments(this);
        });
        $('button.btnSaveUpload').click(function() {
            context.saveUpload(this);
        });

        $('li.btnSubmit').click(function() {
            context.submitWFRecord();
        });
        $('li.btnEndorse').click(function() {
            context.endorseWFRecord();
        });
        $('li.btnApprove').click(function() {
            context.approveWFRecord();
        });
        $('li.btnReturn').click(function() {
            context.returnWFRecord();
        });
        $('li.btnForward').click(function() {
            context.forwardWFRecord();
        });
        $('li.btnCancel').click(function() {
            context.cancelWFRecord();
        });
        $('li.btnReject').click(function() {
            context.rejectWFRecord();
        });
        $('li.btnWfHistory').click(function() {
            context.historyWFRecord();
        });
        context.initReport();
        context.initActions();
    };

    historyWFRecord() {
        var context = this;
        console.log("historyWFRecord called");
        if (!this.mandatorySelectRecord()) {
            return;
        }
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/'+localStorage.companyCode+'/historyWFRecord/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log("historyWFRecord data");
            console.log(data);


            var str = '<div class="box">';
            str += '<div class="box-header with-border">';
            str += '<h3 class="box-title">Workflow Status</h3>';
            str += '</div>';
            str += '<!-- /.box-header -->';
            str += '<div class="box-body">'
            str += '<table class="table table-bordered"><tbody>';
            str += '<tr><th>Approver</th><th>Role</th><th>Status</th></tr>';
            $(data).each(function(index, obj) {
                console.log(obj);
                var employeeName = obj.getProp("employeeName");
                var role = obj.getProp("role");
                var status = obj.getProp("wfStatus");
                if (status) {
                    str += '<tr><td>'+employeeName+'</td><td>'+role+'</td><td>'+status+'</td></tr>';
                }
                else {
                    str += '<tr><td>'+employeeName+'</td><td>'+role+'</td><td>--</td></tr>';
                }
            });
            str += '</tbody></table>';
            str += '</div></div>';
          
            var showModal = new ShowModalAny('', str);
            showModal.show();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    }

    rejectWFRecord() {
        var context = this;
        console.log("rejectWFRecord called");
        if (!this.mandatorySelectRecord()) {
            return;
        }
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/'+localStorage.companyCode+'/rejectWFRecord/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            var loadJsonToForm = new LoadJsonToForm(context.mainForm, data);
            loadJsonToForm.load();
            context.searchTableClass.reloadSearch();
            context.formRule.doRule();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    }

    cancelWFRecord() {
        var context = this;
        console.log("cancelWFRecord called");
        if (!this.mandatorySelectRecord()) {
            return;
        }
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/'+localStorage.companyCode+'/cancelWFRecord/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            var loadJsonToForm = new LoadJsonToForm(context.mainForm, data);
            loadJsonToForm.load();
            context.searchTableClass.reloadSearch();
            context.formRule.doRule();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    }

    forwardWFRecord() {
        var context = this;
        console.log("forwardWFRecord called");
        if (!this.mandatorySelectRecord()) {
            return;
        }
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/'+localStorage.companyCode+'/forwardWFRecord/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            var loadJsonToForm = new LoadJsonToForm(context.mainForm, data);
            loadJsonToForm.load();
            context.searchTableClass.reloadSearch();
            context.formRule.doRule();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    }

    returnWFRecord() {
        var context = this;
        console.log("returnWFRecord called");
        if (!this.mandatorySelectRecord()) {
            return;
        }
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/'+localStorage.companyCode+'/returnWFRecord/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            var loadJsonToForm = new LoadJsonToForm(context.mainForm, data);
            loadJsonToForm.load();
            context.searchTableClass.reloadSearch();
            context.formRule.doRule();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    }

    approveWFRecord() {
        var context = this;
        console.log("approveWFRecord called");
        if (!this.mandatorySelectRecord()) {
            return;
        }
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/'+localStorage.companyCode+'/approveWFRecord/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            var loadJsonToForm = new LoadJsonToForm(context.mainForm, data);
            loadJsonToForm.load();
            context.searchTableClass.reloadSearch();
            context.formRule.doRule();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    }

    endorseWFRecord() {
        var context = this;
        console.log("endorseWFRecord called");
        if (!this.mandatorySelectRecord()) {
            return;
        }
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/'+localStorage.companyCode+'/endorseWFRecord/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            var loadJsonToForm = new LoadJsonToForm(context.mainForm, data);
            loadJsonToForm.load();
            context.searchTableClass.reloadSearch();
            context.formRule.doRule();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    }

    submitWFRecord() {
        var context = this;
        console.log("submitWFRecord called");
        if (!this.mandatorySelectRecord()) {
            return;
        }
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/'+localStorage.companyCode+'/submitWFRecord/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            var loadJsonToForm = new LoadJsonToForm(context.mainForm, data);
            loadJsonToForm.load();
            context.searchTableClass.reloadSearch();
            context.formRule.doRule();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    }

    initActions() {
        var context = this;
        var url = MAIN_URL+"/api/generic/"+localStorage.companyCode+"/specialaction/actions/"+this.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(data).each(function(index, obj) {
                console.log(obj);
                var code = obj.getProp("key");
                var name = obj.getProp("value");
                var module = context.moduleName;

                var str = `<li class="mySpecialAction ${code}" module="${module}" value="${code}"><a href="#" style="padding: 3px 20px;"><i class="fa fa-gears"> ${name}</i></a></li>`;
                $(".specialActions").after(str);
            });
            $('.mySpecialAction').click(function() {
                context.doAction(this);
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    doAction(obj) {
        var context = this;
        var moduleName = $(obj).attr("module");
        var code = $(obj).attr("value");
        var url = MAIN_URL+"/api/generic/"+localStorage.companyCode+"/specialaction/"+moduleName+"/"+code;
        console.log(url);
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            var moduleScript = new ModuleScript(moduleName);
            var moduleObj = moduleScript.getModuleScript();
            moduleObj.doSpecialAction(data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    initReport() {
        var context = this;
        var url = MAIN_URL+"/api/generic/"+localStorage.companyCode+"/report/dynamic/"+this.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(data).each(function(index, obj) {
                console.log(obj);
                var code = obj.getProp("key");
                var name = obj.getProp("value");
                var module = context.moduleName;

                var str = `<li class="myReport ${code}" module="${module}" value="${code}"><a href="#" style="padding: 3px 20px;"><i class="fa fa-line-chart"> ${name}</i></a></li>`;
                $(".dynamicReport").after(str);
            });
            $('.myReport').click(function() {
                context.displayReport(this);
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    displayReport(mySelectReport) {
        var context = this;
        var value = $(mySelectReport).attr("value");
        // var value = $(mySelectReport).val();
        if (value == null || value == '' || value == '--Reports--') {
            console.log("EMPTY REPRT");
            return;
        }
        console.log("moduleName = " + this.moduleName);
        var inputName = 'input.mainId[module="'+this.moduleName+'"]';
        console.log("inputName = " + inputName);
        var recordId = $(inputName).val();

        console.log("displayReport");
        console.log(value);
        var xhr = new XMLHttpRequest();
        xhr.onload = function(e) {
            if (this.status == 200) {
                var file = new Blob([xhr.response], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                $("#reportDynamicContent").attr("data", fileURL);
                $(mySelectReport).val("--Reports--")
                var dynamicReport = $("#reportDynamicDialog").dialog({
                    width: '90%',
                    modal: true,
                });
                $(".reportClose").click(function() {
                    console.log("close report");
                    dynamicReport.dialog("close");
                });
            }
            else {
                $(mySelectReport).val("--Reports--")
                var enc = new TextDecoder("utf-8");
                var str = enc.decode(xhr.response)
                console.log(str);
                var showModuleHelp = new ShowModuleHelp("Information", str);
                showModuleHelp.show();
            }
        };
        var myurl = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/report/dynamic/'+this.moduleName+"/"+value+"/"+recordId;
        xhr.responseType = 'arraybuffer';
        xhr.open('GET', myurl, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
        xhr.send("");
    }

    listFileToTable(data) {
        try {
            $(".fileAttachments li").remove();
        }
        catch (e) {
            console.log(e);
        }
        $(data).each(function(index, obj) {
            console.log(obj);
            var fileName = obj.filename;
            var fileSize = obj.filesize;
            var fileId = obj.fileuploadid;
            $(".fileAttachments").append('<li class="list-group-item align-middle"><span class="pull-right align-top" style="margin-left: 10px;"><button class="btn btn-link" onclick="FormControlButton.deleteFile('+fileId+')">Delete</button></span><span class="badge"><a onclick="FormControlButton.downloadFile('+fileId+')" style="color:white;cursor: pointer;" target="_blank">Size : '+fileSize+'</a></span>'+fileName+'</li>');
        });
    }

    mandatorySelectRecord() {
        var recordId = $('input.mainId').val();

        if (recordId > 0) {
            return true;
        }
        else {
            var showModalAny = new ShowModalAny("No Record Selected", "Please select a record.");
            showModalAny.show();
            return false;
        }
    }

    listFileAttachments(myButton) {
        console.log("listFileAttachments");
        var moduleName = $(myButton).attr("module");
        var inputName = 'input.mainId[module="'+moduleName+'"]';
        console.log("inputName = " + inputName);
        var recordId = $(inputName).val();
        console.log("recordId = " + recordId);

        if (this.mandatorySelectRecord()) {
            $('#fileUploadDialog').modal('show');
            var context = this;
            var successCallback = function(data) {
                console.log(data);
                context.listFileToTable(data);
            };
            var ajaxFileViewer = new AjaxFileViewer(successCallback);
            ajaxFileViewer.getAllFiles(moduleName, recordId);
        }
    }

    static downloadFile(fileId) {
        console.log("downloadFile = " + fileId);
        window.open(MAIN_URL+'/api/generic/'+localStorage.companyCode+'/attachment/download/'+fileId, '_blank');
    }

    static deleteFile(fileId) {
        var context = new FormControlButton();
        console.log("deletedFile = " + fileId);
        var successCallback = function(data) {
            console.log(data);
            context.listFileToTable(data);
        };
        var ajaxDeleteFile = new AjaxDeleteFile(successCallback);
        ajaxDeleteFile.deleteFile(fileId);
    }

    saveUpload(myButton) {
        var context = this;
        var successCallback = function(data) {
            console.log(data);
            context.listFileToTable(data);
        };
        var moduleName = $(myButton).attr("module");
        var inputName = 'input.mainId[module="'+moduleName+'"]';
        console.log("inputName = " + inputName);
        var recordId = $(inputName).val();
        console.log("recordId = " + recordId);
        var uploadType = $("#XXuploadType").val();
        var ajaxUploader = new AjaxUploader(successCallback);
        ajaxUploader.uploadFile(moduleName, recordId, uploadType, this.formUploadData);
    }

    initFileUpload() {
        var context = this;
        $('#fileUpload').change(function(){
            console.log("File Upload Change Called");
            //on change event
            if($(this).prop('files').length > 0) {
                var file = $(this).prop('files')[0];
                console.log("Received File");
                console.log(file);
                context.formUploadData.append("file", file);
            }
        });
    }

    toggleSearch() {
        if ($("#dynamikoMainSearch").is(":visible")) {
            $("#dynamikoMainSearch").hide();
        }
        else {
            $("#dynamikoMainSearch").show();
        }
    }

    newRecord() {
        var context = this;
        console.log("newRecord called");
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/new/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            var loadJsonToForm = new LoadJsonToForm(context.mainForm, data);
            loadJsonToForm.load();

            context.childTabs.reloadAllChildRecords();

            context.searchTableClass.reloadSearch();
            context.formRule.doRule();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    };

    showModalUpdateRecord() {
        this.searchTableClass.displayAllFiles();
    }

    deleteRecord() {
        var context = this;
        console.log("deleteRecord called");
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/delete/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            // var loadJsonToForm = new LoadJsonToForm(context.mainForm, data);
            // loadJsonToForm.load();

            // context.childTabs.clearAllChildRecords();

            // context.searchTableClass.clearSearch();
            // context.formRule.doRule();
            localStorage.latestModule = context.moduleName;
    
            var registerDatatable = new RegisterDatatable();
            registerDatatable.clearRegister();
        
            var constructForm = new MainForm(context.moduleName, `#searchTable[module="${context.moduleName}"]`, `#mainForm[module="${context.moduleName}"]`);
            constructForm.construct();
        
            var fileUpload = new FileUpload();
            fileUpload.initUpload();
        };
        var confirmDelete = function() {
            var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
            ajaxCaller.ajaxPost();
        }

        var deleteRecordConfirm = new DeleteRecordConfirm(confirmDelete);
        deleteRecordConfirm.confirm();
    };

    saveRecord() {
        var context = this;
        console.log("saveRecord called");
        $('.multiSelect option').prop('selected', true);
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        console.log(vdata);
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/save/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            var loadJsonToForm = new LoadJsonToForm(context.mainForm, data);
            loadJsonToForm.load();

            context.childTabs.reloadAllChildRecords();

            context.searchTableClass.reloadSearch();
            context.formRule.doRule();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    };
}

class SearchTable {
    constructor(moduleName, mainForm, searchTable, childTabs) {
        this.moduleName = moduleName;
        this.mainForm = mainForm;
        this.searchTable = searchTable;
        this.childTabs = childTabs;
        this.successCallback;
        this.formRule = new FormRule(this.moduleName, this.mainForm);
        this.chartRule = new ChartRule(this.moduleName, this.mainForm);
    }

    initTable() {
        var context = this;
        var mainDataTable = dynaRegister.createMainTable(this.moduleName, this.searchTable, this);
        dynaRegister.createDropZone(context.moduleName, "div#mainDropZone", context, mainDataTable);

        this.reloadSearch();
        $('input[class~="filter"][module="'+this.moduleName+'"]').keyup(function() {
            context.reloadSearch();
        });
        $('select.specialSearch').change(function() {
            context.reloadSpecialSearch();
        });
    };

    loadToForm() {
        var context = this;
        var mainDataTable = dynaRegister.getDataTable(context.moduleName);
        var dropZone = dynaRegister.getDropZone(context.moduleName);
        dropZone.options.url = `${MAIN_URL}/api/generic/${localStorage.companyCode}/attachment/upload/any/${context.moduleName}/${mainDataTable.selectedId}`
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/findRecord/' + this.moduleName + '/' + mainDataTable.selectedId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Record Found");
            console.log(data);
            var loadJsonToForm = new LoadJsonToForm(context.mainForm, data);
            loadJsonToForm.load();

            context.childTabs.reloadAllChildRecords();
            context.formRule.doRule();
            context.chartRule.doChartRule();

            for (const [key, value] of dynaRegister.saasMap) {
                console.log(key, value);
                value.loadToForm(context);
            }
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    };

    displayAllFiles() {
        var context = this;
        var mainDataTable = dynaRegister.getDataTable(context.moduleName);
        var url = MAIN_URL+"/api/generic/"+localStorage.companyCode+"/attachment/"+context.moduleName+"/"+mainDataTable.selectedId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(".recordFiles").empty();
            $(data).each(function(index, obj) {
                console.log(obj);
                var fileUploadId = obj.getProp("fileUploadId");
                var fileName = obj.getProp("fileName");
                var uploadType = obj.getProp("uploadType");
                var str = "";
                if (uploadType == 'Profile') {
                    str = `
                    <div class='thumbnail' style='display:inline-block; border-width: 5px;'>
                        <img title='${fileName}' src='${MAIN_URL}/api/generic/${localStorage.companyCode}/attachment/download/${fileUploadId}' data-toggle='modal' data-target='#imgModal_${fileUploadId}'></img>
                        <div class='text-center' style='margin-top: 20px;'>
                            <i data='${fileUploadId}' class='fa fa-picture-o setFileProfile' title='Set As Profile' style='margin-right: 10px;'></i>
                            <i data='${fileUploadId}' class='fa fa-remove attachFileRemove' title='Remove File'></i>
                        </div>
                    </div>`;
                }
                else {
                    str = `
                    <div class='thumbnail' style='display:inline-block'>
                        <img title='${fileName}' src='${MAIN_URL}/api/generic/${localStorage.companyCode}/attachment/download/${fileUploadId}' data-toggle='modal' data-target='#imgModal_${fileUploadId}'></img>
                        <div class='text-center' style='margin-top: 20px;'>
                            <i data='${fileUploadId}' class='fa fa-picture-o setFileProfile' title='Set As Profile' style='margin-right: 10px;'></i>
                            <i data='${fileUploadId}' class='fa fa-remove attachFileRemove' title='Remove File'></i>
                        </div>
                    </div>`;
                }
                $(".recordFiles").append(str);
                
                var html = `
                    <div id="myModal" class="modal fade" role="dialog">
                        <div class="modal-dialog">                    
                        <!-- Modal content-->
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close btn btnImage_${fileUploadId}" title="Full Screen" value="image_${fileUploadId}">
                                        <i class="glyphicon glyphicon-fullscreen"></i>
                                    </button>       
                                    <h4 class="modal-title">Larger Image</h4>
                                </div>
                                <div class="modal-body">
                                    <div style="overflow-x: auto; white-space: nowrap; height: 500px; width: 100%;" id="image_${fileUploadId}">
                                        <img src='myImage'></img>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                </div>
                            </div>                    
                        </div>
                    </div>
                `;
                html = html.replace("myModal", "imgModal_"+fileUploadId);
                html = html.replace("myImage", MAIN_URL+"/api/generic/"+localStorage.companyCode+"/attachment/download/"+fileUploadId);
                $(".recordFiles").append(html);
                $(".btnImage_"+fileUploadId).click(function() {
                    context.displayLargeImageFullScreen(this);
                });
            });
            $('.setFileProfile').click(function() {
                context.setFileProfile(this);
            });               
            $('.attachFileRemove').click(function() {
                context.removeAttachedFile(this);
            });               
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    setFileProfile(obj) {
        var context = this;
        var fileId = $(obj).attr("data");
        var url = MAIN_URL+"/api/generic/"+localStorage.companyCode+"/attachment/setprofile/"+fileId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            context.displayAllFiles();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    removeAttachedFile(obj) {
        var context = this;
        var fileId = $(obj).attr("data");
        var url = MAIN_URL+"/api/generic/"+localStorage.companyCode+"/attachment/delete/"+fileId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            context.displayAllFiles();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    displayLargeImageFullScreen(btn) {
        var val = $(btn).attr("value");
        console.log(val);
        $("#"+val).fullScreen(true);
    }

    reloadSpecialSearch() {
        console.log("reloadSpecialSearch");
        var context = this;
        var input = $('select.specialSearch');
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/search/special/' + this.moduleName + '/' + input.val();
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, this.successCallback);
        ajaxCaller.ajaxGet();
    };

    reloadSearch() {
        console.log("reloadSearch");
        var context = this;
        var input = $('input[class~="filter"][module="'+this.moduleName+'"]');
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/search/' + this.moduleName + '/' + input.val();
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        this.successCallback = function(data) {
            console.log("Reload Search");
            var mainDataTable = dynaRegister.getDataTable(context.moduleName);
            mainDataTable.clear();
            var columns = $(context.searchTable).attr("columns");
            console.log(columns);
            var firstRec = Object.keys(data[0]);
            var keys = columns.split(',');
            $.each(data, function(index, obj) {
                var keyId = obj.getProp(firstRec[0]);
                var record = [];
                for (var key of keys) {
                    var value = obj.getProp(key);
                    if (value) {
                        record.push(value);
                    }
                    else {
                        record.push("");
                    }
                }
                var node = mainDataTable.row.add(record).node();
                node.id = keyId;
                $(node).addClass("rec"+keyId);
                // console.log(node);
                mainDataTable.draw(false);
            });""
            // console.log(data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, this.successCallback);
        ajaxCaller.ajaxGet();
    };

    clearSearch() {
        console.log("reloadSearch");
        var context = this;
        var mainDataTable = dynaRegister.getDataTable(context.moduleName);
        $('input[class~="filter"][module="'+this.moduleName+'"]').val("");
        var input = $('input[class~="filter"][module="'+this.moduleName+'"]');
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/search/' + this.moduleName + '/' + input.val();
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        this.successCallback = function(data) {
            console.log("Reload Search");
            mainDataTable.clear();
            var columns = $(context.searchTable).attr("columns");
            console.log(columns);
            var firstRec = Object.keys(data[0]);
            var keys = columns.split(',');
            $.each(data, function(index, obj) {
                var keyId = obj.getProp(firstRec[0]);
                var record = [];
                for (var key of keys) {
                    var value = obj.getProp(key);
                    if (value) {
                        record.push(value);
                    }
                    else {
                        record.push("");
                    }
                }
                var node = mainDataTable.row.add(record).node();
                node.id = keyId;
                $(node).addClass("rec"+keyId);
                // console.log(node);
                mainDataTable.draw(false);

                for (const [key, value] of dynaRegister.saasMap) {
                    console.log(key, value);
                    value.clearSearch(context);
                }
            });
            // console.log(data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, this.successCallback);
        ajaxCaller.ajaxGet();
    };
};
