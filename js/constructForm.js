class ConstructMainForm {
    construct(moduleName, recordId) {
        this.moduleName = moduleName;

        var context = this;        
        var uiHtml = uiCache.getUIHtml(this.moduleName);
        if (uiHtml=="" || uiHtml==null) {
            var url = MAIN_URL+"/api/ui/"+sessionStorage.companyCode+"/module/"+context.moduleName;
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            var successCallback = function(data) {
                context.cacheConstruct(recordId, data);
                uiCache.setUIHtml(context.moduleName, data);
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
        }
        else {
            context.cacheConstruct(recordId, uiHtml);
        }
    };

    cacheConstruct(recordId, uiHtml) {
        $("#content-main").html(uiHtml);
        $('[data-mask]').inputmask();

        if (recordId) {
            this.loadRecord(recordId);
        }

        formRule.init(this.moduleName);
        profilePicLoader.init(this.moduleName);
        printForm.init(this.moduleName);
        formControlButton.initButtons(this.moduleName);
        searchTable.initTable(this.moduleName);
        fieldConstructor.initFields(this.moduleName);
        childTabs.initTabs(this.moduleName);
        profilePicLoader.init(this.moduleName);
    };

    loadRecord(recordId) {
        var context = this;
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/findRecord/' + this.moduleName + '/' + recordId;

        var searchData = searchCache.getSearchCache(this.moduleName, url);
        if (searchData==null || searchData=="") {
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            var successCallback = function(data) {
                searchCache.setNewSearchCache(context.moduleName, url, data);

                utils.loadJsonToForm(mainForm, data);
                utils.loadJsonAddInfo(data);
    
                childTabs.reloadAllDisplayTabs();
                localStorage.latestModuleId = recordId;
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
        }
        else {
            utils.loadJsonToForm(mainForm, searchData);
            utils.loadJsonAddInfo(searchData);

            childTabs.reloadAllDisplayTabs();
            localStorage.latestModuleId = recordId;
        }
    }
}

class PrintForm {
    init(moduleName) {
        $(document).on('click', '#printForm', function() {
            console.log("Print Form.");
            printJS('mainForm', 'html');
        });
    }
}

class FormRule {
    init(moduleName) {
        console.log("FormRule");
        this.moduleName = moduleName;
    }

    doRule() {
        var context = this;
        console.log("doRule called");
        var vdata = JSON.stringify(utils.convertFormToJSON($(mainForm)));
        console.log(vdata);
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/formrule/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log(data);
            context.setupButtons(data);
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback);
    }

    setupButtons(returnData) {
        this.disableHideSelector(".btnNew", "btnNew", returnData);
        this.disableHideSelector(".btnSave", "btnSave", returnData);
        this.disableHideSelector(".btnUpload", "btnUpload", returnData);
        this.disableHideSelector(".btnDelete", "btnDelete", returnData);
        this.disableHideSelector(".btnWf", "btnWf", returnData);
    }

    disableHideSelector(selector, field, returnData) {
        var dispComp = returnData.getProp("componentDisplays").filter(display => field==display.name)[0];
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
    init(moduleName) {
        this.moduleName = moduleName;

        console.log("ProfilePicLoader init called");
        var context = this;
        $(mainId).on('change', function() {
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

class FormControlButton {
    initButtons(moduleName) {
        this.moduleName = moduleName;
        this.formUploadData = new FormData();

        var myUploadDialog = $("#myUploadDialog").dialog({
            autoOpen: false,
        });
        this.initFileUpload();
        
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
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    displayReport(mySelectReport) {
        var value = $(mySelectReport).attr("value");
        // var value = $(mySelectReport).val();
        if (value == null || value == '' || value == '--Reports--') {
            console.log("EMPTY REPRT");
            return;
        }
        console.log("moduleName = " + formControlButton.moduleName);
        var recordId = $(mainId).val();

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
            }
            else {
                $(mySelectReport).val("--Reports--")
                var enc = new TextDecoder("utf-8");
                var str = enc.decode(xhr.response)
                console.log(str);
                showModuleHelp.show("Information", str);
            }
        };
        var myurl = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/report/dynamic/'+formControlButton.moduleName+"/"+value+"/"+recordId;
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
        var recordId = $(mainId).val();

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
        var recordId = $(mainId).val();
        console.log("recordId = " + recordId);

        if (this.mandatorySelectRecord()) {
            $('#fileUploadDialog').modal('show');
            var context = this;
            var successCallback = function(data) {
                console.log(data);
                context.listFileToTable(data);
            };
            ajaxCaller.getAllFiles(successCallback, moduleName, recordId);
        }
    }

    static downloadFile(fileId) {
        console.log("downloadFile = " + fileId);
        window.open(MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/attachment/download/'+fileId, '_blank');
    }

    static deleteFile(fileId) {
        console.log("deletedFile = " + fileId);
        var successCallback = function(data) {
            console.log(data);
            formControlButton.listFileToTable(data);
        };
        ajaxCaller.deleteFile(successCallback, fileId);
    }

    saveUpload(myButton) {
        var successCallback = function(data) {
            console.log(data);
            formControlButton.listFileToTable(data);
        };
        var moduleName = $(myButton).attr("module");
        var recordId = $(mainId).val();
        console.log("recordId = " + recordId);
        var uploadType = $("#XXuploadType").val();
        ajaxCaller.uploadFile(successCallback, moduleName, recordId, uploadType, this.formUploadData);
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
                formControlButton.formUploadData.append("file", file);
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

    newRecord(myButton) {
        console.log("newRecord called");
        var moduleName = $(myButton).attr("module");
        var vdata = JSON.stringify(utils.convertFormToJSON($(mainForm)));
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/new/' + moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            utils.loadJsonToForm(mainForm, data);
            utils.loadJsonAddInfo(data);

            childTabs.reloadAllDisplayTabs();

            searchTable.reloadSearch();
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback);
    };

    showModalUpdateRecord() {
        searchTable.displayAllFiles();
    }

    deleteRecord(myButton) {
        var moduleName = $(myButton).attr("module");
        console.log("deleteRecord called");
        var vdata = JSON.stringify(utils.convertFormToJSON($(mainForm)));
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/delete/' + moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            localStorage.latestModule = moduleName;
            registerDatatable.clearRegister();
        
            constructMainForm.construct(moduleName);
            fileUpload.initUpload();
        };
        var confirmDelete = function() {
            ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback);
        }
        deleteRecordConfirm.confirm(confirmDelete);
    };

    saveRecord(myButton) {
        var moduleName = $(myButton).attr("module");
        console.log("saveRecord called");
        $('.multiSelect option').prop('selected', true);
        var vdata = JSON.stringify(utils.convertFormToJSON($(mainForm)));
        console.log(vdata);
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/save/' + moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            utils.loadJsonToForm(mainForm, data);
            utils.loadJsonAddInfo(data);
            childTabs.reloadAllDisplayTabs();
            searchTable.reloadSearch();
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback);
    };
}

class SearchTable {
    constructor() {
        var context = this;
    
        $(document).on('click', '.setFileProfile', function() {
            context.setFileProfile(this);
        });               
        $(document).on('click', '.attachFileRemove', function() {
            context.removeAttachedFile(this);
        });               
        $(document).on('keyup', 'input[class~="filter"]', function() {
            context.reloadSearch();
        });
        $(document).on('click', 'select.specialSearch', function() {
            context.reloadSpecialSearch();
        });
        $(document).on('click', 'btnImage', function() {
            context.displayLargeImageFullScreen(this);
        });
    }

    initTable(moduleName) {
        this.moduleName = moduleName;
        this.successCallback;

        var context = this;
        var mainDataTable = dynaRegister.createMainTable(this.moduleName, mainSearchForm, this);
        dynaRegister.createDropZone(context.moduleName, "div#mainDropZone", context, mainDataTable);

        this.reloadSearch();
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

                utils.loadJsonToForm(mainForm, data);
                utils.loadJsonAddInfo(data);
    
                childTabs.reloadAllDisplayTabs();
                for (const [key, value] of dynaRegister.saasMap) {
                    value.loadToForm(context);
                }
                localStorage.latestModuleId = mainDataTable.selectedId;
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
        }
        else {
            utils.loadJsonToForm(mainForm, searchData);
            utils.loadJsonAddInfo(searchData);

            childTabs.reloadAllDisplayTabs();
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
                                    <button type="button" class="close btn btnImage btnImage_${fileUploadId}" title="Full Screen" value="image_${fileUploadId}">
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
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
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
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
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
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
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

        ajaxCaller.ajaxGet(ajaxRequestDTO, this.successCallback);
    };

    loadSearchData(data) {
        var context = this;

        console.log("Reload Search");
        var mainDataTable = dynaRegister.getDataTable(context.moduleName);
        mainDataTable.clear();
        var columns = $(mainSearchForm).attr("columns");
        // console.log(columns);
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
            ajaxCaller.ajaxGet(ajaxRequestDTO, this.successCallback);
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
            var columns = $(mainSearchForm).attr("columns");
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
        ajaxCaller.ajaxGet(ajaxRequestDTO, this.successCallback);
    };
};

$(function () {
    constructMainForm = new ConstructMainForm();
    searchTable = new SearchTable();
    formControlButton = new FormControlButton();
    formRule = new FormRule();
    profilePicLoader = new ProfilePicLoader();
    printForm = new PrintForm();
});
