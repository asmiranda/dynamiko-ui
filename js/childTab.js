class ChildTabs {
    constructor(moduleName, mainForm) {
        this.moduleName = moduleName;
        this.mainForm = mainForm;
        this.childTabs = [];
    }

    initTabs() {
        var context = this;
        $.each($('.myChildTab[submodule]'), function(i, obj) {  
            console.log("initTabs");
            console.log(i);
            console.log($(obj).attr("submodule"));
            var childTab = new ChildTab(context.moduleName, context.mainForm, $(obj).attr("submodule"), $(obj).attr("cache"));
            childTab.constructTab();

            context.childTabs.push(childTab);
        });
    };

    clearAllDisplayTabs() {
        var context = this;
        console.log("clearAllDisplayTabs");
        console.log(this.childTabs);
        $.each(context.childTabs, function(i, childTab) {
            console.log(i);
            console.log(childTab);
            childTab.clearDisplayTabs();
        });
    };

    reloadAllDisplayTabs() {
        var context = this;
        console.log("reloadAllDisplayTabs");
        console.log(this.childTabs);
        $.each(context.childTabs, function(i, childTab) {
            console.log(i);
            console.log(childTab);
            childTab.reloadDisplayTabs();
        });
    };
};

class ChildTab {
    constructor(moduleName, mainForm, subModuleName, cache) {
        this.moduleName = moduleName;
        this.mainForm = mainForm;
        this.subModuleName = subModuleName;
        this.cache = cache;

        this.tableSelector = 'table[class~="displayTab"][submodule="'+this.subModuleName+'"]';
        this.formSelector = 'form[module="'+this.moduleName+'"][submodule="'+this.subModuleName+'"]';
        this.modalId = $('button[class~="btnChildTabEdit"][module="'+this.moduleName+'"][submodule="'+this.subModuleName+'"]').attr("data-target");
        console.log("Modal ID === "+this.modalId);
    }

    constructTab() {
        var childDataTable = dynaRegister.createChildTable(this.subModuleName, this.tableSelector);
        dynaRegister.createDropZone(this.subModuleName, `div.childTabDropZone[submodule='${this.subModuleName}']`, this, childDataTable);
        this.reloadDisplayTabs();
    };

    clearDisplayTabs() {
        dynaRegister.clearTable(this.subModuleName);
    };

    reloadDisplayTabs() {
        var context = this;
        var convertFormToJSON = new ConvertFormToJSON($(this.mainForm));
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/subrecord/' + this.moduleName + '/' + this.subModuleName;
        convertFormToJSON["childURL"] = url;
        var cacheKey = JSON.stringify(convertFormToJSON.convert());
        var mainId = $("input.mainId").val();
        if (mainId > 0) {
            if (this.cache!="true") {
                var ajaxRequestDTO = new AjaxRequestDTO(url, cacheKey);
                var successCallback = function(data) {
                    context.loadDisplayTabData(data);
                };
                var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
                ajaxCaller.ajaxPost();
            }
            else {
                var data = sStorage.get(cacheKey);
                if (data==null || data=="") {
                    var ajaxRequestDTO = new AjaxRequestDTO(url, cacheKey);
                    var successCallback = function(data) {
                        context.loadDisplayTabData(data);
                        sStorage.set(cacheKey, data);
                    };
                    var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
                    ajaxCaller.ajaxPost();
                }
                else {
                    context.loadDisplayTabData(data);
                }
            }
        }
    };

    loadDisplayTabData(data) {
        var context = this;
        console.log(context.subModuleName + " Sub Record Reloaded");
        dynaRegister.getDataTable(context.subModuleName).selectedId = null;
        context.loadRecordsToHtml(data);
        context.loadRecordsToChildTable(data);
        context.initButtons();
    }

    loadRecordsToHtml(data) {
        console.log(data);
        var context = this;
        $(".displayTabHtml[submodule='"+context.subModuleName+"']").empty();
        if (data[0]) {
            $.each(data, function(i, obj) {
                try {
                    var recordHtml = $(".displayTabHtmlTemplate[submodule='"+context.subModuleName+"']").html();
                    $.each(obj, function(key, value) {
                        console.log(key + " -- " + value);
                        recordHtml = replaceStr.replaceAll(recordHtml, "##"+key.toUpperCase()+"##", value);
                    });
                    recordHtml = replaceStr.replaceAll(recordHtml, "##MAIN_URL##", MAIN_URL);
                    recordHtml = replaceStr.replaceAll(recordHtml, "##COMPANY_CODE##", sessionStorage.companyCode);

                    $(".displayTabHtml[submodule='"+context.subModuleName+"']").append(recordHtml);
                    }
                catch(e) {
                }
            });
        }
    }

    loadRecordsToChildTable(data) {
        var context = this;
        var childTable = dynaRegister.getDataTable(this.subModuleName);
        if (childTable.childTableColFields) {
            childTable.clear().draw(false);
            console.log(data);
            if (data[0]) {
                var keys = childTable.childTableColFields.split(",");
                console.log(keys);
                $.each(data, function(i, obj) {
                    var keyId = obj.getProp(childTable.childFieldId);
                    console.log(key);
                    var record = [];
                    var modalId = "#myModal"+context.subModuleName;
                    if (childTable.canEdit=='true' || childTable.canDelete=='true') {
                        var buttonEdit = '<button recordId="'+keyId+'" module="'+context.subModuleName+'" submodule="'+context.subModuleName+'" data-target="'+modalId+'" data-toggle="modal" type="button" class="btn btn-info btnChildTabEdit" title="Edit Selected Record"><i class="fa fa-pencil"></i></button>';
                        var buttonDelete = '<button recordId="'+keyId+'" module="'+context.subModuleName+'" submodule="'+context.subModuleName+'" type="button" class="btn btn-danger btnChildTabDelete" style="margin-left: 5px;" title="Delete Selected Record"><i class="fa fa-trash"></i></button>';
                        if (childTable.canEdit=='true' && childTable.canDelete=='true') {
                            var buttons = '<div class="btn-group">'+buttonEdit+buttonDelete+'</div>'
                            record.push(buttons);
                        }
                        else if (childTable.canEdit=='true') {
                            var buttons = '<div class="btn-group">'+buttonEdit+'</div>'
                            record.push(buttons);
                        }
                        else if (childTable.canDelete=='true') {
                            var buttons = '<div class="btn-group">'+buttonDelete+'</div>'
                            record.push(buttons);
                        }
                    }
                    for (var key of keys) {
                        var value = obj.getProp(key);
                        if (value) {
                            value = context.getFieldValue(key, value, keyId);
                            record.push(value);
                        }
                        else {
                            record.push("");
                        }
                    }
                    childTable.row.add(record).node().id = keyId;
                    childTable.draw(false);
                });
            }
        }
    }

    getFieldValue(key, value, childId) {
        var childTable = dynaRegister.getDataTable(this.subModuleName);
        var isLinkable = ~childTable.linkableColumns.indexOf(key.toUpperCase());
        if (isLinkable) {
            var recordId = $('input.mainId').val();
            return `<a href="#" class="childFormLinker" fieldName="${key}" mainId="${recordId}" childId="${childId}" module="${this.moduleName}" submodule="${this.subModuleName}">${value}</a>`;
        }
        else {
            return value;
        }
    }
    
    initButtons() {
        var context = this;
        var childTable = dynaRegister.getDataTable(this.subModuleName);
        $('button.btnChildTabEdit[submodule="'+this.subModuleName+'"]').click(function(e) {
            var recId = $(this).attr("recordId");
            childTable.selectedId = recId;
            console.log("SELECTED ID == "+childTable.selectedId);
            if (childTable.selectedId) {
                context.loadToForm();
                context.editDisplayTab(this);
                context.displayAllFiles();
            }
            else {
                e.stopPropagation();
                noSelectedRecordEdit.alert();
            }
        });
        $('button.btnChildTabNew[submodule="'+this.subModuleName+'"]').click(function() {
            context.newDisplayTab(this);
        });
        $('button.btnChildTabDelete[submodule="'+this.subModuleName+'"]').click(function() {
            context.deleteDisplayTab(this);
        });
        $('button.btnChildTabCancel[submodule="'+this.subModuleName+'"]').click(function() {
            context.cancelDisplayTab();
        });
    };

    editDisplayTab(myButton) {
        var context = this;
        console.log("Child Tab New Button Called");
        console.log("Modal ID === "+this.modalId);
    };

    newDisplayTab(myButton) {
        var context = this;
        console.log("Child Tab New Button Called");
        console.log("Modal ID === "+this.modalId);

        var childTable = dynaRegister.getDataTable(this.subModuleName);
        childTable.selectedId = null;
        this.removeTableSelectedRecord();
        var clearForm = new ClearForm(this.formSelector);
        clearForm.clear();

        var module = $(myButton).attr("module")
        var submodule = $(myButton).attr("submodule")
        var formSelector = 'form[module="'+module+'"][submodule="'+submodule+'"]';
        var fieldConstructor = new ChildFieldConstructor(module, submodule, formSelector);
        fieldConstructor.initFields();
    };

    deleteDisplayTab(myButton) {
        var context = this;
        var subRecordId = $(myButton).attr("recordId");
        var module = $(myButton).attr("module");
        var submodule = $(myButton).attr("submodule");

        console.log("Child Tab Delete Button Called");

        var convertParent = new ConvertFormToJSON($(this.mainForm));
        var parentRecord = convertParent.convert();

        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/deletesubrecord/' + module + '/' + submodule + '/' + subRecordId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(parentRecord));
        var successCallback = function(data) {
            console.log("Delete success called : "+data);
            context.reloadDisplayTabs();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    };

    cancelDisplayTab() {
        console.log("Child Tab Cancel Button Called");
    };

    loadToForm() {
        var context = this;
        var childTable = dynaRegister.getDataTable(this.subModuleName);
        var dropZone = dynaRegister.getDropZone(context.subModuleName);
        dropZone.options.url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/attachment/upload/any/${context.subModuleName}/${childTable.selectedId}`
        console.log(this.subModuleName + " loadToForm");
        console.log("selectedId == " + childTable.selectedId);
        console.log("context.formSelector == " + this.formSelector);

        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/findRecord/' + this.subModuleName + '/' + childTable.selectedId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Record Found");
            console.log(data);
            loadJsonToForm.load(context.formSelector, data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    };

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

    displayAllFiles() {
        var context = this;
        var childTable = dynaRegister.getDataTable(this.subModuleName);
        var url = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/attachment/"+context.subModuleName+"/"+childTable.selectedId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            $(".childTabRecordFiles[submodule='"+context.subModuleName+"']").empty();
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
                $(".childTabRecordFiles[submodule='"+context.subModuleName+"']").append(str);
                
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
                $(".childTabRecordFiles[submodule='"+context.subModuleName+"']").append(html);
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

    removeTableSelectedRecord() {
        var childTable = dynaRegister.getDataTable(this.subModuleName);
        childTable.selectedId = null;
        var allRecords =  $(this.tableSelector + ' tbody tr');
        $.each(allRecords, function(i, tblRow) {
            $(tblRow).removeClass("selected");
        });
    };
}

