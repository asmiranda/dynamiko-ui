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
        var uiHtml = uiCache.getUIHtml(this.moduleName);
        if (uiHtml=="" || uiHtml==null) {
            var url = MAIN_URL+"/api/ui/"+sessionStorage.companyCode+"/module/"+context.moduleName;
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            var successCallback = function(data) {
                context.cacheConstruct(recordId, data);
                uiCache.setUIHtml(context.moduleName, data);
            };
            var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
            ajaxCaller.ajaxGet();
        }
        else {
            context.cacheConstruct(recordId, uiHtml);
        }
    };

    cacheConstruct(recordId, uiHtml) {
        var context = this;        
        $("#content-main").html(uiHtml);
        $('[data-mask]').inputmask();
        context.controlButtonClass.initButtons();
        context.searchTableClass.initTable();
        context.fieldConstructor.initFields();
        context.childTabs.initTabs();
        context.moduleHelper.initHelp();
        context.profilePicLoader.init();
        // context.formRule.doRule();
        // context.chartRule.doChartRule();
        // context.printForm.init();
        if (recordId) {
            context.loadRecord(recordId);
        }
        var moduleScript = new ModuleScript(context.moduleName);
        moduleScript.init();
    };

    loadRecord(recordId) {
        var context = this;
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/findRecord/' + this.moduleName + '/' + recordId;

        var searchData = searchCache.getSearchCache(this.moduleName, url);
        if (searchData==null || searchData=="") {
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            var successCallback = function(data) {
                searchCache.setNewSearchCache(context.moduleName, url, data);

                loadJsonToForm.load(context.mainForm, data);
                loadJsonToForm.loadAddInfo(data);
    
                context.childTabs.reloadAllDisplayTabs();
                localStorage.latestModuleId = recordId;
            };
            var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
            ajaxCaller.ajaxGet();
        }
        else {
            loadJsonToForm.load(context.mainForm, searchData);
            loadJsonToForm.loadAddInfo(searchData);

            context.childTabs.reloadAllDisplayTabs();
            localStorage.latestModuleId = recordId;
        }
    }
}

class PrintForm {
    constructor(moduleName, mainForm) {
        console.log("PrintForm");
        this.moduleName = moduleName;
        this.mainForm = mainForm;
    }

    init() {
        $(document).on('click', '#printForm', function() {
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
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/formrule/' + context.moduleName;
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
                var imageLink = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/${context.moduleName}/${recordId}/`;
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
        $(document).on('click', '.moduleHeader', function() {
            var title = $(".moduleHelp").attr("title");
            var helpHtml = $(".moduleHelp").html();
            showModuleHelp.show(title, helpHtml);
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
        
        $(document).on('click', '.btnToggleSearch', function() {
            context.toggleSearch();
        });
        $(document).on('click', '.btnNew', function() {
            context.newRecord();
        });
        $(document).on('click', '.btnUpdate', function() {
            context.showModalUpdateRecord();
        });
        $(document).on('click', '.btnSave', function() {
            context.saveRecord();
        });
        $(document).on('click', '.btnDelete', function() {
            context.deleteRecord();
        });
        $(document).on('click', 'li.btnUpload', function() {
            context.listFileAttachments();
        });
        $(document).on('click', 'button.btnSaveUpload', function() {
            context.saveUpload();
        });
    };

    initReport() {
        var context = this;
        var url = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/report/dynamic/"+this.moduleName;
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
                showModuleHelp.show("Information", str);
            }
        };
        var myurl = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/report/dynamic/'+this.moduleName+"/"+value+"/"+recordId;
        xhr.responseType = 'arraybuffer';
        xhr.open('GET', myurl, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.token);
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
            showModalAny.show("No Record Selected", "Please select a record.");
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
        window.open(MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/attachment/download/'+fileId, '_blank');
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
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/new/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            loadJsonToForm.load(context.mainForm, data);
            loadJsonToForm.loadAddInfo(data);

            context.childTabs.reloadAllDisplayTabs();

            context.searchTableClass.reloadSearch();
            // context.formRule.doRule();
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
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/delete/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            // loadJsonToForm.load(context.mainForm, data);

            // context.childTabs.clearAllDisplayTabs();

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
        deleteRecordConfirm.confirm(confirmDelete);
    };

    saveRecord() {
        var context = this;
        console.log("saveRecord called");
        $('.multiSelect option').prop('selected', true);
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        console.log(vdata);
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/save/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            loadJsonToForm.load(context.mainForm, data);
            loadJsonToForm.loadAddInfo(data);

            context.childTabs.reloadAllDisplayTabs();

            context.searchTableClass.reloadSearch();
            // context.formRule.doRule();
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
        dropZone.options.url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/attachment/upload/any/${context.moduleName}/${mainDataTable.selectedId}`
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/findRecord/' + this.moduleName + '/' + mainDataTable.selectedId;

        var searchData = searchCache.getSearchCache(this.moduleName, url);
        if (searchData==null || searchData=="") {
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            var successCallback = function(data) {
                searchCache.setNewSearchCache(context.moduleName, url, data);

                loadJsonToForm.load(context.mainForm, data);
                loadJsonToForm.loadAddInfo(data);
    
                context.childTabs.reloadAllDisplayTabs();
                for (const [key, value] of dynaRegister.saasMap) {
                    value.loadToForm(context);
                }
                localStorage.latestModuleId = mainDataTable.selectedId;
            };
            var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
            ajaxCaller.ajaxGet();
        }
        else {
            loadJsonToForm.load(context.mainForm, searchData);
            loadJsonToForm.loadAddInfo(searchData);

            context.childTabs.reloadAllDisplayTabs();
            for (const [key, value] of dynaRegister.saasMap) {
                value.loadToForm(context);
            }
            localStorage.latestModuleId = mainDataTable.selectedId;
        }
    };

    displayAllFiles() {
        var context = this;
        var mainDataTable = dynaRegister.getDataTable(context.moduleName);
        var url = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/attachment/"+context.moduleName+"/"+mainDataTable.selectedId;
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
                        <img title='${fileName}' src='${MAIN_URL}/api/generic/${sessionStorage.companyCode}/attachment/download/${fileUploadId}' data-toggle='modal' data-target='#imgModal_${fileUploadId}'></img>
                        <div class='text-center' style='margin-top: 20px;'>
                            <i data='${fileUploadId}' class='fa fa-picture-o setFileProfile' title='Set As Profile' style='margin-right: 10px;'></i>
                            <i data='${fileUploadId}' class='fa fa-remove attachFileRemove' title='Remove File'></i>
                        </div>
                    </div>`;
                }
                else {
                    str = `
                    <div class='thumbnail' style='display:inline-block'>
                        <img title='${fileName}' src='${MAIN_URL}/api/generic/${sessionStorage.companyCode}/attachment/download/${fileUploadId}' data-toggle='modal' data-target='#imgModal_${fileUploadId}'></img>
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
                html = html.replace("myImage", MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/attachment/download/"+fileUploadId);
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
        var url = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/attachment/setprofile/"+fileId;
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
        var url = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/attachment/delete/"+fileId;
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
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/search/special/' + this.moduleName + '/' + input.val();
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, this.successCallback);
        ajaxCaller.ajaxGet();
    };

    loadSearchData(data) {
        var context = this;

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
    }

    reloadSearch() {
        console.log("reloadSearch");
        var context = this;
        var input = $('input[class~="filter"][module="'+this.moduleName+'"]');
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/search/' + this.moduleName + '/' + input.val();
        var searchData = searchCache.getSearchCache(this.moduleName, url);
        if (searchData==null || searchData=="") {
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            this.successCallback = function(data) {
                searchCache.setNewSearchCache(context.moduleName, url, data);
                context.loadSearchData(data);
            };
            var ajaxCaller = new AjaxCaller(ajaxRequestDTO, this.successCallback);
            ajaxCaller.ajaxGet();
        }
        else {
            this.loadSearchData(searchData);
        }
    };

    clearSearch() {
        console.log("reloadSearch");
        var context = this;
        var mainDataTable = dynaRegister.getDataTable(context.moduleName);
        $('input[class~="filter"][module="'+this.moduleName+'"]').val("");
        var input = $('input[class~="filter"][module="'+this.moduleName+'"]');
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/search/' + this.moduleName + '/' + input.val();
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
