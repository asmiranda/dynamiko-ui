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
    }

    construct() {
        var context = this;
        var url = MAIN_URL+"/api/ui/module/"+this.moduleName;
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
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    };
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
        var url = MAIN_URL+'/api/generic/formrule/' + context.moduleName;
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
        $("input.mainId[module='"+this.moduleName+"']").on('change', function() {
            console.log("ProfilePicLoader change called");
            var recordId = $(this).val();
            console.log("ProfilePicLoader src="+MAIN_URL+"/api/generic/profilePic/"+context.moduleName+"/"+recordId);

            $("#profilePic").attr("src", MAIN_URL+"/api/generic/profilePic/"+context.moduleName+"/"+recordId);
        });
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
        $('button[class~="btnNew"][module="'+this.moduleName+'"]').click(function() {
            context.newRecord();
        });
        $('button[class~="btnSave"][module="'+this.moduleName+'"]').click(function() {
            context.saveRecord();
        });
        $('button[class~="btnDelete"][module="'+this.moduleName+'"]').click(function() {
            context.deleteRecord();
        });
        $('button[class~="btnUpload"]').click(function() {
            context.listFileAttachments(this);
        });
        $('button[class~="btnSaveUpload"]').click(function() {
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
        $('button[class~="btnReturn"]').click(function() {
            context.returnWFRecord();
        });
        $('button[class~="btnForward"]').click(function() {
            context.forwardWFRecord();
        });
        $('button[class~="btnCancel"]').click(function() {
            context.cancelWFRecord();
        });
        $('button[class~="btnReject"]').click(function() {
            context.rejectWFRecord();
        });
        $('li.btnWfHistory').click(function() {
            context.historyWFRecord();
        });
        context.initReport();
    };

    historyWFRecord() {
        var context = this;
        console.log("historyWFRecord called");
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/historyWFRecord/' + context.moduleName;
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
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/rejectWFRecord/' + context.moduleName;
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
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/cancelWFRecord/' + context.moduleName;
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
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/forwardWFRecord/' + context.moduleName;
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
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/returnWFRecord/' + context.moduleName;
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
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/approveWFRecord/' + context.moduleName;
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
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/endorseWFRecord/' + context.moduleName;
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
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/workflow/submitWFRecord/' + context.moduleName;
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

    initReport() {
        var context = this;
        var url = MAIN_URL+"/api/generic/report/dynamic/"+this.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(data).each(function(index, obj) {
                console.log(obj);
                var code = obj.getProp("key");
                var name = obj.getProp("value");
                $(".dynamicReport").append('<option value="'+code+'">'+name+'</option>');
            });
            $('select.dynamicReport').css("display", "");
            $('select.dynamicReport').change(function() {
                context.displayReport(this);
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    displayReport(mySelectReport) {
        var context = this;
        var value = $(mySelectReport).val();
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
        xhr.responseType = 'arraybuffer';
        xhr.open('GET', MAIN_URL+'/api/generic/report/dynamic/'+this.moduleName+"/"+value+"/"+recordId, true);
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

    listFileAttachments(myButton) {
        var context = this;
        console.log("listFileAttachments");
        var successCallback = function(data) {
            console.log(data);
            context.listFileToTable(data);
        };
        var moduleName = $(myButton).attr("module");
        var inputName = 'input[name="'+moduleName+'Id"]';
        console.log("inputName = " + inputName);
        var recordId = $(inputName).val();
        console.log("recordId = " + recordId);
        var ajaxFileViewer = new AjaxFileViewer(successCallback);
        ajaxFileViewer.getAllFiles(moduleName, recordId);
    }

    static downloadFile(fileId) {
        console.log("downloadFile = " + fileId);
        window.open(MAIN_URL+'/api/generic/attachment/download/'+fileId, '_blank');
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

    newRecord() {
        var context = this;
        console.log("newRecord called");
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/generic/new/' + context.moduleName;
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

    deleteRecord() {
        var context = this;
        console.log("deleteRecord called");
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        var url = MAIN_URL+'/api/generic/delete/' + context.moduleName;
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

    saveRecord() {
        var context = this;
        console.log("saveRecord called");
        $('.multiSelect option').prop('selected', true);
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        console.log(vdata);
        var url = MAIN_URL+'/api/generic/save/' + context.moduleName;
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
        this.mainDataTable;
        this.selectedId;
        this.successCallback;
        this.formRule = new FormRule(this.moduleName, this.mainForm);
    }

    initTable() {
        var context = this;
        this.mainDataTable = $(this.searchTable).DataTable( {
            "searching": false,
        } );

        $(this.searchTable + ' tbody').on( 'click', 'tr', function () {
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
            }
            else {
                context.mainDataTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                console.log($(this).attr("id"));
                context.selectedId = $(this).attr("id");
                context.loadToForm();
            }
        } );
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
        var url = MAIN_URL+'/api/generic/findRecord/' + this.moduleName + '/' + this.selectedId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Record Found");
            console.log(data);
            var loadJsonToForm = new LoadJsonToForm(context.mainForm, data);
            loadJsonToForm.load();

            context.childTabs.reloadAllChildRecords();
            context.formRule.doRule();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    };

    reloadSpecialSearch() {
        console.log("reloadSpecialSearch");
        var context = this;
        var input = $('select.specialSearch');
        var url = MAIN_URL+'/api/generic/search/special/' + this.moduleName + '/' + input.val();
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, this.successCallback);
        ajaxCaller.ajaxGet();
    };

    reloadSearch() {
        console.log("reloadSearch");
        var context = this;
        var input = $('input[class~="filter"][module="'+this.moduleName+'"]');
        var url = MAIN_URL+'/api/generic/search/' + this.moduleName + '/' + input.val();
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        this.successCallback = function(data) {
            console.log("Reload Search");
            context.mainDataTable.clear();
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
                var node = context.mainDataTable.row.add(record).node();
                node.id = keyId;
                $(node).addClass("rec"+keyId);
                // console.log(node);
                context.mainDataTable.draw(false);
            });""
            // console.log(data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, this.successCallback);
        ajaxCaller.ajaxGet();
    };
};
