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

        this.formSelector = 'form[module="'+this.moduleName+'"][submodule="'+this.subModuleName+'"]';
        this.modalId = $('button[class~="btnChildTabEdit"][module="'+this.moduleName+'"][submodule="'+this.subModuleName+'"]').attr("data-target");
        console.log("Modal ID === "+this.modalId);
    }

    constructTab() {
        var context = this;
        this.tableSelector = 'table[class~="childRecord"][submodule="'+this.subModuleName+'"]';
        this.childFieldId = $(this.tableSelector).attr("childFieldId");
        if (this.childFieldId) {
            this.childTableColFields = $(this.tableSelector).attr("columns");
            console.log("init child table :: "+this.tableSelector);
    
            this.childTable = $(this.tableSelector).DataTable( {
                "searching": false,
                "bLengthChange": false,
    
                "autoWidth": false,
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
        this.reloadChildRecords();
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
                    var buttonEdit = '<button recordId="'+keyId+'" module="'+context.subModuleName+'" submodule="'+context.subModuleName+'" data-target="'+modalId+'" data-toggle="modal" type="button" class="btn btn-info btnChildTabEdit" title="Edit Selected Record"><i class="fa fa-pencil"></i></button>';
                    var buttonDelete = '<button recordId="'+keyId+'" module="'+context.subModuleName+'" submodule="'+context.subModuleName+'" type="button" class="btn btn-danger btnChildTabDelete" style="margin-left: 5px;" title="Delete Selected Record"><i class="fa fa-trash"></i></button>';
                    var buttons = '<div class="btn-group">'+buttonEdit+buttonDelete+'</div>'
                    record.push(buttons);
                    for (var key of keys) {
                        var value = obj.getProp(key);
                        if (value) {
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

    initButtons() {
        var context = this;
        $('button.btnChildTabEdit[submodule="'+this.subModuleName+'"]').click(function(e) {
            var recId = $(this).attr("recordId");
            context.selectedId = recId;
            console.log("SELECTED ID == "+context.selectedId);
            if (context.selectedId) {
                context.loadToForm();
                context.editChildRecord(this);
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

        $('button.btnChildTabSave').unbind().on('click');
        $('button.btnChildTabSave').click(function() {
            context.saveChildRecord(this);
        });
    };

    newChildRecord(myButton) {
        var context = this;
        console.log("Child Tab New Button Called");
        console.log("Modal ID === "+this.modalId);

        $('button.btnChildTabSave').unbind().on('click');
        $('button.btnChildTabSave').click(function() {
            context.saveChildRecord(this);
        });

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

    saveChildRecord(myButton) {
        var context = this;
        var submodule = $(myButton).attr("submodule");
        console.log("Child Tab Save Button Called");

        var convertParent = new ConvertFormToJSON($(this.mainForm));
        var parentRecord = convertParent.convert();

        var convertRecord = new ConvertFormToJSON($("form[submodule='"+submodule+"']"));
        var subRecord = convertRecord.convert();

        var tmp = [];
        tmp.push(parentRecord);
        tmp.push(subRecord);

        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/savesubrecord/' + this.moduleName + '/' + submodule;
        var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(tmp));
        var successCallback = function(data, status, hqr) {
            $(context.modalId).modal('hide');
            var moduleScript = new ModuleScript(context.moduleName);
            moduleScript.saveChild(context.subModuleName);
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
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    };

    removeTableSelectedRecord() {
        this.selectedId = null;
        var allRecords =  $(this.tableSelector + ' tbody tr');
        $.each(allRecords, function(i, tblRow) {
            $(tblRow).removeClass("selected");
        });
    };
}

