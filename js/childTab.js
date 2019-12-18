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
            var childTab = new ChildTab(context.moduleName, context.mainForm, $(obj).attr("submodule"));
            childTab.constructTab();

            context.childTabs.push(childTab);
        });
    };

    clearAllChildRecords() {
        var context = this;
        console.log("clearAllChildRecords");
        console.log(this.childTabs);
        $.each(context.childTabs, function(i, childTab) {
            console.log(i);
            console.log(childTab);
            childTab.clearChildRecords();
        });
    };

    reloadAllChildRecords() {
        var context = this;
        console.log("reloadAllChildRecords");
        console.log(this.childTabs);
        $.each(context.childTabs, function(i, childTab) {
            console.log(i);
            console.log(childTab);
            childTab.reloadChildRecords();
        });
    };
};

class ChildTab {
    constructor(moduleName, mainForm, subModuleName) {
        this.moduleName = moduleName;
        this.mainForm = mainForm;
        this.subModuleName = subModuleName;
        this.childTable;
        this.childFieldId;
        this.childTableColFields;
        this.tableSelector;

        this.selectedId;
        this.dropZone;
        this.readOnly;

        this.formSelector = 'form[module="'+this.moduleName+'"][submodule="'+this.subModuleName+'"]';
        this.modalId = $('button[class~="btnChildTabEdit"][module="'+this.moduleName+'"][submodule="'+this.subModuleName+'"]').attr("data-target");
        console.log("Modal ID === "+this.modalId);
    }

    constructTab() {
        var context = this;
        this.tableSelector = 'table[class~="childRecord"][submodule="'+this.subModuleName+'"]';
        this.childFieldId = $(this.tableSelector).attr("childFieldId");
        this.readWrite = $(this.tableSelector).attr("readWrite");
        this.linkableColumns = $(this.tableSelector).attr("linkableColumns");
        if (this.linkableColumns) {
            this.linkableColumns = this.linkableColumns.toUpperCase();
        }
        if (this.childFieldId) {
            this.childTableColFields = $(this.tableSelector).attr("columns");
            console.log("init child table :: "+this.tableSelector);
    
            if (this.readWrite=='true') {
                this.childTable = $(this.tableSelector).DataTable( {
                    "searching": false,
                    "bLengthChange": false,
        
                    "autoWidth": true,
                    "fixedHeader": {
                        "header": false,
                        "footer": false
                    },
                    "columnDefs": [
                        {
                            "width": "70px",
                            "targets": 0,
                            'orderable': false,
                        },
                    ],
                } );
            }
            else {
                this.childTable = $(this.tableSelector).DataTable( {
                    "searching": false,
                    "bLengthChange": false,
        
                    "autoWidth": true,
                    "fixedHeader": {
                        "header": false,
                        "footer": false
                    },
                    "columnDefs": [
                        {
                            'orderable': false,
                        },
                    ],
                } );
            }
        }
        this.reloadChildRecords();
    };

    clearChildRecords() {
        this.childTable.clear().draw(false);
    };

    reloadChildRecords() {
        var context = this;
        var convertFormToJSON = new ConvertFormToJSON($(this.mainForm));
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/subrecord/' + this.moduleName + '/' + this.subModuleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(convertFormToJSON.convert()));
        var successCallback = function(data) {
            console.log(context.subModuleName + " Sub Record Reloaded");
            context.selectedId = null;
            context.loadRecordsToHtml(data);
            context.loadRecordsToChildTable(data);
            context.initButtons();

            var formLink = new FormLinker();
            formLink.init();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    };

    loadRecordsToHtml(data) {
        console.log(data);
        var context = this;
        $(".childRecordHtml[submodule='"+context.subModuleName+"']").empty();
        if (data[0]) {
            $.each(data, function(i, obj) {
                try {
                    var recordHtml = $(".childRecordHtmlTemplate[submodule='"+context.subModuleName+"']").html();
                    $.each(obj, function(key, value) {
                        console.log(key + " -- " + value);
                        var replaceStr = new ReplaceStr();
                        recordHtml = replaceStr.replaceAll(recordHtml, "##"+key.toUpperCase()+"##", value);
                    });

                    var replaceStr = new ReplaceStr();
                    recordHtml = replaceStr.replaceAll(recordHtml, "##MAIN_URL##", MAIN_URL);
                    recordHtml = replaceStr.replaceAll(recordHtml, "##COMPANY_CODE##", localStorage.companyCode);

                    $(".childRecordHtml[submodule='"+context.subModuleName+"']").append(recordHtml);
                    }
                catch(e) {
                }
            });
        }
    }

    loadRecordsToChildTable(data) {
        var context = this;
        if (context.childTable) {
            context.childTable.clear().draw(false);
            console.log(data);
            if (data[0]) {
                console.log(context.childTableColFields);
                var keys = context.childTableColFields.split(",");
                console.log(keys);
                $.each(data, function(i, obj) {
                    var keyId = obj.getProp(context.childFieldId);
                    console.log(key);
                    var record = [];
                    var modalId = "#myModal"+context.subModuleName;
                    if (context.readWrite=='true') {
                        var buttonEdit = '<button recordId="'+keyId+'" module="'+context.subModuleName+'" submodule="'+context.subModuleName+'" data-target="'+modalId+'" data-toggle="modal" type="button" class="btn btn-info btnChildTabEdit" title="Edit Selected Record"><i class="fa fa-pencil"></i></button>';
                        var buttonDelete = '<button recordId="'+keyId+'" module="'+context.subModuleName+'" submodule="'+context.subModuleName+'" type="button" class="btn btn-danger btnChildTabDelete" style="margin-left: 5px;" title="Delete Selected Record"><i class="fa fa-trash"></i></button>';
                        var buttons = '<div class="btn-group">'+buttonEdit+buttonDelete+'</div>'
                        record.push(buttons);
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
                    context.childTable.row.add(record).node().id = keyId;
                    context.childTable.draw(false);
                });
            }
        }
    }

    getFieldValue(key, value, childId) {
        var isLinkable = ~this.linkableColumns.indexOf(key.toUpperCase());
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
        $('button.btnChildTabEdit[submodule="'+this.subModuleName+'"]').click(function(e) {
            var recId = $(this).attr("recordId");
            context.selectedId = recId;
            console.log("SELECTED ID == "+context.selectedId);
            if (context.selectedId) {
                context.loadToForm();
                context.editChildRecord(this);
                context.displayAllFiles();
            }
            else {
                e.stopPropagation();
                var noSelectedRecordEdit = new NoSelectedRecordEdit();
                noSelectedRecordEdit.alert();
            }
        });
        $('button.btnChildTabNew[submodule="'+this.subModuleName+'"]').click(function() {
            context.newChildRecord(this);
        });
        $('button.btnChildTabDelete[submodule="'+this.subModuleName+'"]').click(function() {
            context.deleteChildRecord(this);
        });
        $('button.btnChildTabCancel[submodule="'+this.subModuleName+'"]').click(function() {
            context.cancelChildRecord();
        });
    };

    editChildRecord(myButton) {
        var context = this;
        console.log("Child Tab New Button Called");
        console.log("Modal ID === "+this.modalId);
    };

    newChildRecord(myButton) {
        var context = this;
        console.log("Child Tab New Button Called");
        console.log("Modal ID === "+this.modalId);

        this.selectedId = null;
        this.removeTableSelectedRecord();
        var clearForm = new ClearForm(this.formSelector);
        clearForm.clear();

        var module = $(myButton).attr("module")
        var submodule = $(myButton).attr("submodule")
        var formSelector = 'form[module="'+module+'"][submodule="'+submodule+'"]';
        var fieldConstructor = new ChildFieldConstructor(module, submodule, formSelector);
        fieldConstructor.initFields();
    };

    deleteChildRecord(myButton) {
        var context = this;
        var subRecordId = $(myButton).attr("recordId");
        var module = $(myButton).attr("module");
        var submodule = $(myButton).attr("submodule");

        console.log("Child Tab Delete Button Called");

        var convertParent = new ConvertFormToJSON($(this.mainForm));
        var parentRecord = convertParent.convert();

        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/deletesubrecord/' + module + '/' + submodule + '/' + subRecordId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(parentRecord));
        var successCallback = function(data) {
            console.log("Delete success called : "+data);
            context.reloadChildRecords();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    };

    cancelChildRecord() {
        console.log("Child Tab Cancel Button Called");
    };

    loadToForm() {
        var context = this;
        console.log(this.subModuleName + " loadToForm");
        console.log("selectedId == " + this.selectedId);
        console.log("context.formSelector == " + this.formSelector);

        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/findRecord/' + this.subModuleName + '/' + this.selectedId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Record Found");
            console.log(data);
            var loadJsonToForm = new LoadJsonToForm(context.formSelector, data);
            loadJsonToForm.load();

            context.initChildTabRecords();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    };

    initChildTabRecords() {
        var context = this;
        Dropzone.autoDiscover = false;
        if (this.dropZone) {
            this.dropZone.destroy();
        }
        this.dropZone = new Dropzone("div.childTabDropZone[submodule='"+this.subModuleName+"']", { 
            url: MAIN_URL+"/api/generic/"+localStorage.companyCode+"/attachment/upload/any/"+context.subModuleName+"/"+context.selectedId,
            maxFiles: 1, 
            clickable: true, 
            maxFilesize: 1, //MB
            headers:{"Authorization":'Bearer ' + localStorage.token},   
            init: function() {
                    this.on("addedfile", function(file) {
                        // alert("Added file.");
                    }),
                    this.on("success", function(file, response) {
                        this.removeAllFiles();
                        context.displayAllFiles();
                    })
            }                   
        });
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

    displayAllFiles() {
        var context = this;
        var url = MAIN_URL+"/api/generic/"+localStorage.companyCode+"/attachment/"+context.subModuleName+"/"+context.selectedId;
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
                html = html.replace("myImage", MAIN_URL+"/api/generic/"+localStorage.companyCode+"/attachment/download/"+fileUploadId);
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
        this.selectedId = null;
        var allRecords =  $(this.tableSelector + ' tbody tr');
        $.each(allRecords, function(i, tblRow) {
            $(tblRow).removeClass("selected");
        });
    };
}

