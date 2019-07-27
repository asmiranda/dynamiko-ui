class MainForm {
    constructor(moduleName, searchTable, mainForm) {
        this.moduleName = moduleName;
        this.searchTable = searchTable;
        this.mainForm = mainForm;

        this.childTabs = new ChildTabs(this.moduleName, this.mainForm);
        this.searchTableClass = new SearchTable(this.moduleName, this.mainForm, this.searchTable, this.childTabs);
        this.controlButtonClass = new FormControlButton(this.moduleName, this.mainForm, this.searchTableClass);
        this.fieldConstructor = new FieldConstructor(this.moduleName, this.mainForm);
        this.moduleHelper = new ModuleHelper(this.moduleName, this.mainForm);
        this.profilePicLoader = new ProfilePicLoader(this.moduleName, this.mainForm);
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
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    };
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
    constructor(moduleName, mainForm, searchTableClass) {
        this.moduleName = moduleName;
        this.mainForm = mainForm;
        this.searchTableClass = searchTableClass;
        this.formUploadData = new FormData();

        var context = this;
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
        $('select.dynamicReport').change(function() {
            context.displayReport(this);
        });
    };

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
            context.searchTableClass.reloadSearch();
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
            context.searchTableClass.reloadSearch();
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
            context.searchTableClass.reloadSearch();
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
    }

    initTable() {
        var context = this;
        this.mainDataTable = $(this.searchTable).DataTable( {
            "searching": false
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
                context.mainDataTable.row.add(record).node().id = keyId;
                context.mainDataTable.draw(false);
            });
            console.log(data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, this.successCallback);
        ajaxCaller.ajaxGet();
    };
};
